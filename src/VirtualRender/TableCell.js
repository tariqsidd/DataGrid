import React, { useState, useRef, useCallback, useEffect } from "react";
import { Box, Tooltip } from "@material-ui/core";
import { DataGridOptions } from "./index";
import GenericTextField from "./GenericTextField";
import {
  clearOrdinates,
  getEndCellOrdinate,
  getStartCellOrdinate,
  setEndCellOrdinate,
  setStartCellOrdinate,
  findIndexById,
} from "./utils";
import {
  getSubscribedData,
  setSubscribedData,
  subscribeToData,
} from "./Reactive/subscriber";

const TableCell = React.memo(
  ({ children, width, column, onChangeCell, rowId, isError }) => {
    // console.log("Table Cell rendered");
    const [validCell, setValidCell] = useState(true);
    const [editMode, setEditMode] = useState(false);
    const cellValue = useRef(null);
    const cellRef = useRef(null);

    const errorFocusedCellRef = useRef(null);
    const setErrorFocusedCellRef = (value) => {
      errorFocusedCellRef.current = value;
    };

    useEffect(() => {
      subscribeToData("errorFocusCell", getErrorFocusCell);
      subscribeToData("errorFocusedCellRef", getErrorFocusedCellRef);
    }, []);

    useEffect(() => {
      const keys = Object.keys(isError);
      if (
        keys.some((key) => key === column.headerFieldName) &&
        isError[column.headerFieldName] !== null
      ) {
        isError[column.headerFieldName].length && setValidCell(false);
      } else {
        setValidCell(true);
      }
    }, [isError]);

    useEffect(() => {
      cellValue.current = children;
    }, [children]);

    useEffect(() => {
      let value = getSubscribedData("errorFocusCell");
      getErrorFocusCell(value);
    }, []);

    let extraProps = {
      ...(column?.headerOptions && { options: column.headerOptions }),
    };
    const getErrorFocusedCellRef = (value) => {
      setErrorFocusedCellRef(value);
    };

    const getErrorFocusCell = (value) => {
      if (value) {
        const currentRowIndex = findIndexById(value.current.rowId);
        const nextRowIndex = findIndexById(value.next.rowId);
        const selfRowIndex = findIndexById(rowId);
        if (
          (selfRowIndex === currentRowIndex || selfRowIndex === nextRowIndex) &&
          (column.headerFieldName === value.current.fieldName ||
            column.headerFieldName === value.next.fieldName)
        ) {
          // console.log("Handle Error Focus Called");
          handleErrorFocus(
            nextRowIndex,
            value.next.fieldName,
            value.next.rowId
          );
        }
      }
    };

    const applyErrorFocusStyle = (cell) => {
      if (cell) {
        cell.style.padding = "15.5px";
        cell.style.border = "2px solid #f44336";
      }
    };

    const clearErrorFocusStyle = (cell) => {
      if (cell) {
        cell.style.border = "1px solid #8080801a";
      }
    };

    const handleErrorFocus = (rowIndex, headerFieldName, rowId) => {
      if (errorFocusedCellRef.current) {
        const prevCell = document.getElementById(errorFocusedCellRef.current);
        clearErrorFocusStyle(prevCell);
      }
      if (rowIndex != null && headerFieldName != null) {
        // Error Focus the new cell
        const cellId = `cell-${rowId}-${headerFieldName}`;
        setTimeout(() => {
          const newCell = document.getElementById(cellId);
          applyErrorFocusStyle(newCell);
        }, 100);
        setSubscribedData("errorFocusedCellRef", cellId);
      }
    };

    const renderInputField = () => {
      if (editMode) {
        return (
          <GenericTextField
            type={column.headerCellType}
            isError={validCell}
            errorObj={isError}
            label={column.headerName}
            schema={column.headerSchema ? column.headerSchema : null}
            validationKey={column.headerFieldName}
            value={cellValue.current}
            onChange={(updatedCell, isValid, error) => {
              cellValue.current = updatedCell;
              onChangeCell(updatedCell, error);
              setEditMode(false);
              setValidCell(isValid);
            }}
            {...extraProps}
          />
        );
      }
      return children;
    };

    const onDoubleClick = () => {
      if (DataGridOptions.editing) {
        setEditMode(true);
      }
    };

    const onDragOver = useCallback((e) => {
      e.preventDefault();
    }, []);

    const onDragStart = (cellValue, column, key, rowId) => {
      setStartCellOrdinate(cellValue, column, key, rowId);
    };

    const onDrop = (cellValue, key, rowId) => {
      setEndCellOrdinate(cellValue, key, rowId);
      const startCellValues = getStartCellOrdinate();
      const endCellValues = getEndCellOrdinate();
      const CellOrdinates = { startCellValues, endCellValues };
      if (startCellValues.key === endCellValues.key) {
        setSubscribedData("willRowMutate", CellOrdinates);
      }
    };

    const BoxWithToolTip = () => {
      if (!validCell) {
        return (
          <Tooltip
            arrow
            title={isError[column.headerFieldName]}
            placement="bottom"
            style={{ color: "red" }}
          >
            <Box
              id={`cell-${rowId}-${column.headerFieldName}`}
              ref={cellRef}
              draggable={true}
              onDragOver={onDragOver}
              onDrop={() => {
                onDrop(children, column.headerFieldName, rowId);
              }}
              style={tableCellStyles.cellStyle(width, validCell)}
              onDragStart={() => {
                onDragStart(children, column, column.headerFieldName, rowId);
              }}
              onDoubleClick={() => onDoubleClick(cellValue.current)}
              onDragEnd={clearOrdinates}
            >
              {renderInputField()}
            </Box>
          </Tooltip>
        );
      } else {
        return (
          <Box
            ref={cellRef}
            id={`cell-${rowId}-${column.headerFieldName}`}
            draggable={true}
            onDragOver={onDragOver}
            onDrop={() => {
              onDrop(children, column.headerFieldName, rowId);
            }}
            style={tableCellStyles.cellStyle(width, validCell)}
            onDragStart={() => {
              onDragStart(children, column, column.headerFieldName, rowId);
            }}
            onDoubleClick={() => onDoubleClick(cellValue.current)}
            onDragEnd={clearOrdinates}
          >
            {renderInputField()}
          </Box>
        );
      }
    };

    return <BoxWithToolTip />;
  }
);

export const tableCellStyles = {
  cellStyle: (width, validCell) => {
    return {
      display: "inline-flex",
      alignItems: "center",
      justifyContent: "center",
      width: width,
      minWidth: "150px",
      textAlign: "left",
      padding: "16px",
      borderLeft: `1px solid rgba(224, 224, 224, 1)`,
      borderBottom: `1px solid rgba(224, 224, 224, 1)`,
      fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
      fontSize: "0.875rem",
      lineHeight: 1.5,
      letterSpacing: "0.01071em",
      ...(!validCell && { backgroundColor: "#ffe6e6" }),
    };
  },
};

export default TableCell;
