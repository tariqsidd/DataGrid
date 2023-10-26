import React, {useEffect, useState, useRef, createRef, useCallback, memo} from "react";
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
import {unsubscribe} from "./Reactive/subscriber";
import isEqual from 'lodash.isequal'

const TBody = memo(({tableOptions, tableHeaders, data, openContextMenu}) => {
  console.log('TableBody RERENDER')

  return(
    <TableBody style={{ height: data.length * 40 }}>
      {data.map((row, rowIndex) => {
        return(
          <GridRow
            key={row.id}
            id={row.id}
            tableOptions={DataGridOptions}
            tableHeaders={tableHeaders}
            // rowIndex={rowIndex}
            row={row}
            data={data}
            openContextMenu={openContextMenu}
          />
        )
      })}
    </TableBody>
  )
},isEqual);

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
    return () => {
      // Run on unmount
      unsubscribe("highlightedCell");
      unsubscribe("errorFocusCell");
      unsubscribe("dropCell");
      unsubscribe("errorFocusedCellRef");
    };
  }, [incomingTableOptions]);

  const openContextMenu = useCallback((event, rowIndex, id) => {
    event.preventDefault();
    setContextMenuPosition({
      id,
      top: event.clientY,
      left: event.clientX,
      rowIndex: rowIndex,
    });
    setContextMenuVisible(true);
  },[]);

  const closeContextMenu = () => {
    setContextMenuVisible(false);
  };

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
        <GridHeader tableOptions={tableOptions} tableHeaders={tableHeaders} />
        <TBody
          tableOptions={tableOptions}
          tableHeaders={tableHeaders}
          data={data}
          openContextMenu={openContextMenu}
        />
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
