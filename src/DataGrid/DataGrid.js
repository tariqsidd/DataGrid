import React, { useEffect, useState, useRef, createRef } from "react";
import { Table, TableBody, TableContainer } from "@material-ui/core";
import GridHeader from "./GridHeader";
import GridFooter from "./GridFooter";
import GridRow from "./GridRow";
import { DataGridOptions } from "./Constants";
import { addNewRow } from "./utils";
import ContextMenu from "./ContextMenu";
import { commonStyles } from "./styles";
import ExportAndSubmitButton from "./ExportAndSubmitButton";
import ErrorAlert from "./ErrorAlert";
import "./grid.css";

const DataGrid = ({
  incomingData,
  tableHeaders,
  incomingTableOptions,
  callExportCSV,
  onSubmit,
  itemHeight = 40,
  buffer = 15,
}) => {
  console.log("RE-Render");
  let numVisibleItems = Math.trunc(300 / itemHeight);
  const [data, setData] = useState(incomingData);
  const [tableOptions, setTableOptions] = useState(DataGridOptions);
  const [start, setStart] = useState(0);
  const [end, setEnd] = useState(numVisibleItems);
  const [contextMenuVisible, setContextMenuVisible] = useState(false);
  const [contextMenuPosition, setContextMenuPosition] = useState({
    top: 0,
    left: 0,
    rowIndex: -1,
  });
  const viewPort = useRef(null);
  let containerStyle = { height: data.length * itemHeight };

  useEffect(() => {
    let updatedTableOptions = {
      ...tableOptions,
      ...incomingTableOptions,
    };
    const contextMenu =
      updatedTableOptions.deleteRow || updatedTableOptions.duplicateRow;

    setTableOptions({
      ...updatedTableOptions,
      contextMenu: contextMenu,
    });
  }, [incomingTableOptions]);

  const openContextMenu = (event, rowIndex) => {
    event.preventDefault();
    setContextMenuPosition({
      top: event.clientY,
      left: event.clientX,
      rowIndex: rowIndex,
    });
    setContextMenuVisible(true);
  };

  const closeContextMenu = () => {
    setContextMenuVisible(false);
  };

  const onScroll = () => {
    let currentIndex = Math.trunc(viewPort.current.scrollTop / itemHeight);
    currentIndex =
      currentIndex - numVisibleItems >= data.length
        ? currentIndex - numVisibleItems
        : currentIndex;
    if (currentIndex !== start) {
      setStart(currentIndex);
      setEnd(
        currentIndex + numVisibleItems >= data.length
          ? data.length - 1
          : currentIndex + numVisibleItems
      );
    }
  };

  const renderRows = (top) => {
    let result = [];
    result.push(
      <div
        className="item"
        style={{ top: start * itemHeight, height: itemHeight }}
      >
        <GridHeader tableOptions={tableOptions} tableHeaders={tableHeaders} />
      </div>
    );
    for (let i = start + 1; i <= end; i++) {
      let item = data[i];
      result.push(
        <div
          className="item"
          style={{ top: i * itemHeight, height: itemHeight }}
        >
          <GridRow
            tableOptions={tableOptions}
            tableHeaders={tableHeaders}
            rowIndex={i}
            row={item}
            data={data}
            openContextMenu={openContextMenu}
          />
        </div>
      );
    }
    return result;
  };

  const classes = commonStyles();
  return (
    <div className="table-container">
      <ExportAndSubmitButton
        data={data}
        tableOptions={tableOptions}
        tableHeaders={tableHeaders}
        callExportCSV={callExportCSV}
        onSubmit={onSubmit}
      />
      {tableOptions.showErrorAlert && tableOptions.showErrors && (
        <ErrorAlert data={data} tableOptions={tableOptions} />
      )}
      <TableContainer
        className="viewPort"
        ref={viewPort}
        //style={{position:'relative', overflowY:'scroll', height:500}}
        component="div"
        onScroll={onScroll}
      >
        <Table>
          {/* <GridHeader tableOptions={tableOptions} tableHeaders={tableHeaders} /> */}
          <TableBody>
            <div className="itemContainer" style={containerStyle}>
              {renderRows()}
            </div>
            {/*{tableOptions.addRow && (*/}
            {/*  <GridFooter*/}
            {/*    addRow={() => setData(addNewRow(tableHeaders, data))}*/}
            {/*    tableHeaders={tableHeaders}*/}
            {/*    tableOptions={tableOptions}*/}
            {/*  />*/}
            {/*)}*/}
          </TableBody>
        </Table>
      </TableContainer>
      <ContextMenu
        tableOptions={tableOptions}
        setData={setData}
        data={data}
        contextMenuVisible={contextMenuVisible}
        contextMenuPosition={contextMenuPosition}
        closeContextMenu={closeContextMenu}
      />
    </div>
  );
};

export default DataGrid;
