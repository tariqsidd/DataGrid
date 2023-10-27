import React, { useEffect, useState, useCallback } from "react";
import { Table } from "@material-ui/core";
import GridHeader from "./GridHeader";
import GridFooter from "./GridFooter";
import { DataGridOptions } from "./Constants";
import { addNewRow } from "./utils";
import ContextMenu from "./ContextMenu";
import GridButtons from "./GridButtons";
import ErrorAlert from "./ErrorAlert";
import { unsubscribe, setSubscribedData } from "./Reactive/subscriber";
import GridBody from "./GridBody";

const DataGrid = ({
  incomingData,
  tableHeaders,
  incomingTableOptions,
  callExportCSV,
  onChangeInData,
  onSubmit,
  onProceedAnyway,
  onSkip,
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

  useEffect(() => {
    setSubscribedData("selectedRows", []);
    setSubscribedData("gridData", data);
    return () => {
      // Run on unmount
      unsubscribe("gridData");
      unsubscribe("selectedRows");
      unsubscribe("highlightedCell");
      unsubscribe("errorFocusCell");
      unsubscribe("dropCell");
      unsubscribe("errorFocusedCellRef");
    };
  }, []);

  useEffect(() => {
    setSubscribedData("gridData", data);
  }, [data]);

  const openContextMenu = useCallback((event, rowIndex, id) => {
    event.preventDefault();
    setContextMenuPosition({
      id,
      top: event.clientY,
      left: event.clientX,
      rowIndex: rowIndex,
    });
    setContextMenuVisible(true);
  }, []);

  const closeContextMenu = () => {
    setContextMenuVisible(false);
  };

  return (
    <div className="table-container">
      <GridButtons
        data={data}
        tableOptions={tableOptions}
        tableHeaders={tableHeaders}
        callExportCSV={callExportCSV}
        onSubmit={onSubmit}
        onProceedAnyway={onProceedAnyway}
        onSkip={onSkip}
        onDataChange={(data) => {
          console.log("Updated Data in DataGrid", data);
          setData([...data]);
          onChangeInData(data);
        }}
      />
      {tableOptions.showErrorAlert && tableOptions.showErrors && (
        <ErrorAlert data={data} tableOptions={tableOptions} />
      )}
      <Table stickyHeader>
        <GridHeader tableOptions={tableOptions} tableHeaders={tableHeaders} />
        <GridBody
          tableOptions={tableOptions}
          tableHeaders={tableHeaders}
          data={data}
          // openContextMenu={openContextMenu}
          onDataChange={(data) => {
            console.log("Updated Data in DataGrid", data);
            setData([...data]);
            onChangeInData(data);
          }}
        />
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
