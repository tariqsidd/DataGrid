import React, { useEffect, useState, useRef, createRef } from "react";
import { Table, TableBody } from "@material-ui/core";
import GridHeader from "./GridHeader";
import GridFooter from "./GridFooter";
import GridRow from "./GridRow";
import { DataGridOptions } from "./Constants";
import { addNewRow } from "./utils";
import ContextMenu from "./ContextMenu";
import { commonStyles } from "./styles";
import ExportAndSubmitButton from "./ExportAndSubmitButton";
import ErrorAlert from "./ErrorAlert";
import { List, AutoSizer, Table as TableVirtual } from "react-virtualized";

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
  const [data, setData] = useState(incomingData);
  const [tableOptions, setTableOptions] = useState(DataGridOptions);
  const [contextMenuVisible, setContextMenuVisible] = useState(false);
  const [contextMenuPosition, setContextMenuPosition] = useState({
    top: 0,
    left: 0,
    rowIndex: -1,
  });

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

  const rowRenderer = ({ index, key, style }) => {
    console.log("Index", index, "Key", key);
    return (
      <div key={key} style={style}>
        <GridRow
          tableOptions={tableOptions}
          tableHeaders={tableHeaders}
          rowIndex={index}
          row={data[index]}
          data={data}
          openContextMenu={openContextMenu}
        />
      </div>
    );
  };

  const headerRowRenderer = ({ style }) => {
    return (
      <div style={style}>
        <GridHeader tableOptions={tableOptions} tableHeaders={tableHeaders} />
      </div>
    );
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
      <Table stickyHeader>
        {/* <GridHeader tableOptions={tableOptions} tableHeaders={tableHeaders} /> */}
        <AutoSizer>
          {({ height, width }) => (
            // <List
            //   height={500}
            //   width={width}
            //   rowCount={data.length}
            //   rowHeight={itemHeight}
            //   rowRenderer={rowRenderer}
            // />
            <TableVirtual
              //overscanRowCount={100}
              height={500}
              headerHeight={40}
              rowHeight={40}
              rowCount={data.length}
              rowGetter={({ index }) => data[index]}
              headerRowRenderer={headerRowRenderer}
              rowRenderer={rowRenderer}
              width={width}
              headerStyle={{ width: "100px" }}
            />
          )}
        </AutoSizer>
      </Table>
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
