import React, { useState, useRef, useCallback, useEffect } from "react";
import { Box, Paper, Button } from "@material-ui/core";
import TableHeader from "./TableHeader";
import TableRow from "./TableRow";
import {
  setSubscribedData,
  subscribeToData,
  unsubscribe,
} from "../DataGrid/Reactive/subscriber";
import {
  bulkDeleteFromDataAndHashMap,
  convertToHashMap,
  setColumnOrder,
  findIndexById,
} from "./utils";

export const DataGridOptions = {
  addRow: true,
  deleteRow: true,
  duplicateRow: true,
  columnHeight: 40,
  editing: true,
  showErrors: true,
  showErrorAlert: true,
  showExportButton: true,
  showSubmitButton: true,
  showProceedButton: true,
};

const VirtualTable = ({
  itemHeight,
  incomingData,
  incomingTableOptions,
  tableHeaders,
  buffer = 5,
  numberOfRows = 6,
}) => {
  const [tableOptions, setTableOptions] = useState(DataGridOptions);
  const viewportHeight = numberOfRows * itemHeight;
  const [data, setData] = useState([]);
  const [numVisibleItems, setNumVisibleItems] = useState(
    Math.trunc(viewportHeight / itemHeight)
  );
  const [viewState, setViewState] = useState({
    start: 0,
    end: numVisibleItems,
  });
  // const cellErrors = useRef([]);
  const viewPortRef = useRef(null);
  const rowsToDelete = useRef([]);
  const scrollPositionRef = useRef(0);
  const containerStyle = { height: data.length * itemHeight };

  useEffect(() => {
    setData(incomingData);
    convertToHashMap(incomingData);
    setColumnOrder(tableHeaders);
    subscribeToData("rowsToDelete", getRowsToDelete);
    setSubscribedData("rowsToDelete", []);
    return () => {
      unsubscribe("willRowMutate");
      unsubscribe("rowsToDelete");
      unsubscribe("gridData");
      unsubscribe("errorFocusCell");
      unsubscribe("errorFocusCellRef");
    };
  }, []);

  useEffect(() => {
    let updatedTableOptions = {
      ...tableOptions,
      ...incomingTableOptions,
    };

    setTableOptions({
      ...updatedTableOptions,
    });
  }, [incomingTableOptions]);

  const scrollPos = useCallback(() => {
    const currentIndx = Math.trunc(viewPortRef.current.scrollTop / itemHeight);
    const adjustedIndex = Math.max(0, currentIndx - buffer);
    const endIndex = Math.min(
      data.length - 1,
      adjustedIndex + numVisibleItems + buffer
    );

    if (adjustedIndex !== viewState.start || endIndex !== viewState.end) {
      setViewState({ start: adjustedIndex, end: endIndex });
    }
  }, [
    itemHeight,
    numVisibleItems,
    viewState.start,
    viewState.end,
    data.length,
  ]);

  const scrollToRow = (rowIndex) => {
    const scrollPosition = rowIndex * itemHeight - itemHeight;
    if (viewPortRef.current) {
      viewPortRef.current.scrollTop = scrollPosition;
    }
  };

  const renderRows = useCallback(() => {
    let result = [];
    if (data.length) {
      for (let i = viewState.start; i <= viewState.end; i++) {
        let item = { ...data[i], top: i * itemHeight };
        "indexId" in item &&
          result.push(
            <TableRow
              key={`${item.indexId}-Row`}
              item={item}
              columns={tableHeaders}
              itemHeight={itemHeight}
              onRowChange={(updatedRow) => {
                const index = findIndexById(updatedRow.indexId);
                if (index !== -1) {
                  let _data = data;
                  _data[index] = updatedRow;
                  setData(_data);
                  setSubscribedData("gridData", _data);
                }
              }}
            />
          );
      }
      return result;
    }
  }, [viewState.start, viewState.end, itemHeight, data, tableHeaders]);

  useEffect(() => {
    if (scrollPositionRef.current) {
      viewPortRef.current.scrollTop = scrollPositionRef.current;
    }
    return () => {
      scrollPositionRef.current = viewPortRef.current.scrollTop;
    };
  }, []);

  useEffect(() => {
    setNumVisibleItems(Math.trunc(viewportHeight / itemHeight));
  }, [itemHeight, viewportHeight]);

  const getRowsToDelete = (value) => {
    rowsToDelete.current = value;
  };

  return (
    <Box
      ref={viewPortRef}
      style={{
        position: "relative",
        width: "100%",
        height: "100vh",
        border: "1px solid rgba(224, 224, 224, 1)",
        overflowY: "scroll",
        fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
      }}
      onScroll={scrollPos}
    >
      <TableHeader
        columns={tableHeaders}
        scrollToRow={scrollToRow}
        data={data}
      />
      <Box
        style={{
          position: "absolute",
          width: "100%",
          ...containerStyle,
        }}
      >
        {renderRows()}
      </Box>
    </Box>
  );
};

export default VirtualTable;
