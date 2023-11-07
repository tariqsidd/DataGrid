import React, { useState, useRef, useCallback, useEffect } from "react";
import { Box, Button } from "@material-ui/core";
import DeleteIcon from "@material-ui/icons/Delete";
import TableHeader from "./TableHeader";
import TableRow from "./TableRow";
import ErrorAlert from "./ErrorAlert";
import { subscribeToData, unsubscribe } from "./Reactive/subscriber";
import {
  bulkDeleteFromDataAndHashMap,
  convertToHashMap,
  setColumnOrder,
  findIndexById,
  errorIdentifier,
} from "./utils";
import { commonStyles } from "./styles";
import { DataGridOptions, itemHeightConstant } from "./constants";

const VirtualTable = ({
  itemHeight = itemHeightConstant,
  incomingData,
  incomingTableOptions,
  tableHeaders,
  buffer = 5,
  numberOfRows = 6,
  onSubmit = () => {},
  onProceedAnyway = () => {},
  onSkip = () => {},
}) => {
  const [tableOptions, setTableOptions] = useState({});
  const viewportHeight = numberOfRows * itemHeight;
  const [data, setData] = useState([]);
  const [numVisibleItems, setNumVisibleItems] = useState(
    Math.trunc(viewportHeight / itemHeight)
  );
  const [viewState, setViewState] = useState({
    start: 0,
    end: numVisibleItems,
  });
  const viewPortRef = useRef(null);
  const rowsToDelete = useRef([]);
  const scrollPositionRef = useRef(0);
  const containerStyle = { height: data.length * itemHeight };
  const [error, setError] = useState(false);

  useEffect(() => {
    setData(incomingData);
    convertToHashMap(incomingData);
    setColumnOrder(tableHeaders);
    subscribeToData("rowsToDelete", getRowsToDelete);
    return () => {
      unsubscribe("willRowMutate");
      unsubscribe("rowsToDelete");
      unsubscribe("errorFocusCell");
      unsubscribe("errorFocusCellRef");
    };
  }, []);

  useEffect(() => {
    let options = DataGridOptions;
    let updatedTableOptions = {
      ...options,
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

  const onRowChange = useCallback((updatedRow) => {
    setData((prevData) => {
      const index = findIndexById(updatedRow.indexId, prevData);
      if (index !== -1) {
        return [
          ...prevData.slice(0, index),
          updatedRow,
          ...prevData.slice(index + 1),
        ];
      }
      return prevData;
    });
  }, []);

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
              onRowChange={onRowChange}
              tableOptions={tableOptions}
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

  const getRowsToDelete = (id) => {
    const index = rowsToDelete.current.indexOf(id);
    if (index === -1) {
      rowsToDelete.current.push(id);
    } else {
      rowsToDelete.current.splice(index, 1);
    }
  };

  useEffect(() => {
    const errors = errorIdentifier(data);
    if (errors.length > 0) {
      setError(true);
    } else {
      setError(false);
    }
  }, [data]);

  const classes = commonStyles();
  return (
    <Box
      style={{
        height: "calc(100vh - 64px)",
        // overflow: "hidden"
      }}
    >
      <Box className={classes.buttonContainer}>
        {tableOptions.showSkipButton && error && (
          <Button
            variant="outlined"
            color="primary"
            className={classes.button}
            onClick={onSkip}
          >
            Skip These Records
          </Button>
        )}
        {tableOptions.showSubmitButton && (
          <Button
            variant="contained"
            color="primary"
            className={classes.button}
            onClick={onSubmit}
            disabled={error}
          >
            Submit
          </Button>
        )}
        {tableOptions.showProceedButton && (
          <Button
            variant="contained"
            color="primary"
            className={classes.button}
            onClick={onProceedAnyway}
          >
            Proceed Anyway
          </Button>
        )}
      </Box>
      <Box className={classes.buttonContainer}>
        {rowsToDelete.current.length > 0 && (
          <Button
            variant="contained"
            style={{ color: "white", backgroundColor: "#F04438" }}
            className={classes.button}
            startIcon={<DeleteIcon />}
            onClick={() => {
              let modifiedData = bulkDeleteFromDataAndHashMap(
                data,
                rowsToDelete.current
              );
              setData(modifiedData);
              rowsToDelete.current = [];
            }}
          >
            Delete
          </Button>
        )}
      </Box>
      {tableOptions.showErrorAlert && (
        <ErrorAlert scrollToRow={scrollToRow} data={data} />
      )}
      <Box
        ref={viewPortRef}
        style={{
          position: "relative",
          width: "100%",
          height: `calc(100vh - ${itemHeight * 3 + 6}px)`,
          border: "1px solid rgba(224, 224, 224, 1)",
          overflowY: "scroll",
          // overflowX: "scroll",
          fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
        }}
        // sx={{
        //   "&::-webkit-scrollbar": {
        //     width: 10,
        //   },
        //   "&::-webkit-scrollbar-track": {},
        //   "&::-webkit-scrollbar-thumb": {
        //     // backgroundColor: "red",
        //     backgroundColor: "#ccc",
        //     // borderRadius: 6
        //   },
        // }}
        onScroll={scrollPos}
      >
        <TableHeader columns={tableHeaders} />
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
    </Box>
  );
};

export default VirtualTable;
