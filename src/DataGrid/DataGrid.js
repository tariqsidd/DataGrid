import React, { useEffect, useState, useRef, createRef } from "react";
import { Table, TableBody } from "@material-ui/core";
import GridHeader from "./GridHeader";
import GridFooter from "./GridFooter";
import GridRow from "./GridRow";
import { DataGridOptions, maxRowCount } from "./Constants";
import { addNewRow } from "./utils";
import ContextMenu from "./ContextMenu";
import { commonStyles } from "./styles";
import ExportAndSubmitButton from "./ExportAndSubmitButton";
import ErrorAlert from "./ErrorAlert";
import {
  subscribeToData,
  unsubscribe,
  setSubscribedData,
} from "./Reactive/subscriber";

const DataGrid = ({
  incomingData,
  tableHeaders,
  incomingTableOptions,
  callExportCSV,
  onSubmit,
  onDataChange,
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

  console.log(data);
  useEffect(() => {
    subscribeToData("gridData", getGridData);
    subscribeToData("selectedRows", getSelectedRows);
    setSubscribedData("selectedRows", []);
    //setSubscribedData("gridData", data);
    return () => {
      // Run on unmount
      unsubscribe("gridData");
    };
  }, []);

  const getGridData = (data) => {
    //setData([...data]);
    onDataChange(data);
  };

  const getSelectedRows = (value) => {
    console.log("Selected Rows", value);
  };

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
      maxRowCount: maxRowCount,
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

  const classes = commonStyles();
  return (
    <div className="table-container">
      <ExportAndSubmitButton
        data={data}
        setData={setData}
        tableOptions={tableOptions}
        tableHeaders={tableHeaders}
        callExportCSV={callExportCSV}
        onSubmit={onSubmit}
      />
      {tableOptions.showErrorAlert && tableOptions.showErrors && (
        <ErrorAlert data={data} tableOptions={tableOptions} />
      )}
      <Table stickyHeader>
        <GridHeader tableOptions={tableOptions} tableHeaders={tableHeaders} />
        <TableBody>
          {data.map((row, rowIndex) => (
            <GridRow
              tableOptions={tableOptions}
              tableHeaders={tableHeaders}
              rowIndex={rowIndex}
              row={row}
              data={data}
              key={row.id}
              id={row.id}
              // openContextMenu={openContextMenu}
            />
          ))}
          {tableOptions.addRow && data.length < tableOptions.maxRowCount && (
            <GridFooter
              addRow={() => setData(addNewRow(tableHeaders, data))}
              tableHeaders={tableHeaders}
              tableOptions={tableOptions}
            />
          )}
        </TableBody>
      </Table>
      {/* <ContextMenu
        tableOptions={tableOptions}
        setData={setData}
        data={data}
        contextMenuVisible={contextMenuVisible}
        contextMenuPosition={contextMenuPosition}
        closeContextMenu={closeContextMenu}
      /> */}
    </div>
  );
};

export default DataGrid;
