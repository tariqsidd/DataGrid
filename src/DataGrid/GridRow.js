import React, { useState, useCallback, useRef, useEffect } from "react";
import { TableCell, TableRow } from "@material-ui/core";
import { commonStyles } from "./styles";
import { cellContent, cellHasError, getCellType } from "./utils";
import {
  subscribeToData,
  unsubscribe,
  setSubscribedData,
  getSubscribedData,
} from "./Reactive/subscriber";
import ErrorCellCopy from "./ErrorCell2";

let Ajv = require("ajv");
let ajv = new Ajv({ allErrors: true });

const GridRow = ({
  tableOptions = {},
  tableHeaders = [],
  rowIndex,
  row,
  data = [],
  openContextMenu,
}) => {
  console.log("Table Row Rendered");
  const columnOrder = tableHeaders.map((item) => item.headerFieldName);
  const [editingCell, setEditingCell] = useState(null);
  const [editingCellHeader, setEditingCellHeader] = useState(null);
  const [editingValue, setEditingValue] = useState("");
  const [draggingCell, setDraggingCell] = useState(null);

  const highlightedCell = useRef(null);
  const setHighlightedCell = (value) => {
    highlightedCell.current = value;
  };

  const errorFocusedCellRef = useRef(null);
  const setErrorFocusedCellRef = (value) => {
    errorFocusedCellRef.current = value;
  };

  useEffect(() => {
    subscribeToData("highlightedCell", getHighlightedCell);
    subscribeToData("errorFocusCell", getErrorFocusCell);
    subscribeToData("errorFocusedCellRef", getErrorFocusedCellRef);
    subscribeToData("dropCell", getDropCell);
    const errorFocusCell = getSubscribedData("errorFocusCell");
    if (errorFocusCell) {
      if (
        rowIndex === errorFocusCell.current.rowIndex ||
        rowIndex === errorFocusCell.next.rowIndex
      ) {
        handleErrorFocus(
          errorFocusCell.next.rowIndex,
          errorFocusCell.next.fieldName
        );
      }
    }

    return () => {
      // Run on unmount
      unsubscribe("highlightedCell");
      unsubscribe("errorFocusCell");
      unsubscribe("dropCell");
      unsubscribe("errorFocusedCellRef");
    };
  }, []);

  const getDropCell = (value) => {
    const draggingCell = getSubscribedData("draggingCell");
    const dropCell = value;
    if (
      rowIndex > draggingCell.rowIndex &&
      rowIndex <= dropCell.targetRowIndex
    ) {
      setDraggingCell(value);
      setOnDrop(dropCell.targetRowIndex, dropCell.header, draggingCell);
    }
  };

  const getHighlightedCell = (value) => {
    setHighlightedCell(value);
  };

  const getErrorFocusedCellRef = (value) => {
    setErrorFocusedCellRef(value);
  };

  const getErrorFocusCell = (value) => {
    if (value) {
      if (
        rowIndex === value.current.rowIndex ||
        rowIndex === value.next.rowIndex
      ) {
        handleErrorFocus(value.next.rowIndex, value.next.fieldName);
      }
    }
  };

  const applyErrorFocusStyle = (cell) => {
    if (cell) {
      cell.style.border = "2px solid #f44336";
    }
  };

  const clearErrorFocusStyle = (cell) => {
    if (cell) {
      cell.style.border = "1px solid #8080801a";
    }
  };

  const handleErrorFocus = (rowIndex, headerFieldName) => {
    if (errorFocusedCellRef.current) {
      const prevCell = document.getElementById(errorFocusedCellRef.current);
      clearErrorFocusStyle(prevCell);
    }
    if (rowIndex != null && headerFieldName != null) {
      // Error Focus the new cell
      const cellId = `cell-${rowIndex}-${headerFieldName}`;
      const newCell = document.getElementById(cellId);
      applyErrorFocusStyle(newCell);
      setSubscribedData("errorFocusedCellRef", cellId);
    }
  };

  const applyHighlightedStyle = (cell) => {
    if (cell) {
      cell.style.border = "2px dotted black";
      cell.style.position = "relative";
    }
  };

  const clearHighlightedStyle = (cell) => {
    if (cell) {
      cell.style.border = "1px solid #8080801a";
      cell.style.position = "";
    }
  };

  const handleHighlight = (rowIndex, headerFieldName) => {
    // Clear previously highlighted cell
    if (highlightedCell.current) {
      const prevCell = document.getElementById(highlightedCell.current);
      clearHighlightedStyle(prevCell);
    }
    if (rowIndex != null && headerFieldName != null) {
      // Highlight the new cell
      const cellId = `cell-${rowIndex}-${headerFieldName}`;
      const newCell = document.getElementById(cellId);
      applyHighlightedStyle(newCell);
      setSubscribedData("highlightedCell", cellId);
    }
  };

  const handleDoubleClick = (rowIndex, header) => {
    if (tableOptions.editing) {
      const cell = document.getElementById(highlightedCell.current);
      clearHighlightedStyle(cell);
      setEditingCell({ rowIndex, fieldName: header.headerFieldName });
      setEditingCellHeader(header);
      setEditingValue(data[rowIndex][header.headerFieldName]);
    }
  };

  const handleDragStart = (rowIndex, header) => {
    setSubscribedData("draggingCell", {
      rowIndex,
      fieldName: header.headerFieldName,
    });
  };

  const handleDragOver = useCallback((e) => {
    e.preventDefault();
  }, []);

  const handleDrop = (targetRowIndex, header) => {
    setSubscribedData("dropCell", { targetRowIndex, header });
  };

  const setOnDrop = (targetRowIndex, header, draggingCell) => {
    if (draggingCell && draggingCell.fieldName === header.headerFieldName) {
      const newData = [...data];
      for (let i = draggingCell.rowIndex; i <= targetRowIndex; i++) {
        newData[i][header.headerFieldName] =
          data[draggingCell.rowIndex][header.headerFieldName];
        newData[i]["errorObj"] = validateRowData(
          draggingCell.fieldName,
          newData[i],
          header
        );
        setSubscribedData("gridData", newData);
      }
      handleHighlight(targetRowIndex, header.headerFieldName);
    }
  };

  const validateRowData = useCallback((fieldName, rowData, headers) => {
    const errors = rowData.errorObj
      ? JSON.parse(JSON.stringify(rowData.errorObj))
      : {};
    if (errors.hasOwnProperty(fieldName)) {
      delete errors[fieldName];
    }
    const schema = headers.headerSchema;
    const fieldKey = headers.headerFieldName;
    let valueToValidate = {};
    let value = rowData[fieldKey];
    if (headers.headerCellType === "number") {
      if (value !== undefined) {
        valueToValidate = { [fieldKey]: value };
      }
    } else if (value.length > 0) {
      valueToValidate = { [fieldKey]: value };
    }
    if (schema) {
      const validate = ajv.compile(schema);
      if (!validate(valueToValidate)) {
        errors[fieldKey] = validate.errors[0].message;
      }
    }
    if (headers.headerCellType === "select") {
      const options = headers.headerOptions.map((option) => option.value);
      let valid = options.includes(value);
      if (!valid) {
        let error = `"${value}" is not a valid selection. Please choose from the available options in the dropdown`;
        errors[fieldKey] = error;
      }
    }

    //Sorting Error
    return Object.fromEntries(
      columnOrder
        .filter((key) => errors.hasOwnProperty(key))
        .map((key) => [key, errors[key]])
    );
  }, []);

  const handleBlur = () => {
    if (editingCell && editingCellHeader) {
      const newData = [...data];
      newData[editingCell.rowIndex][editingCell.fieldName] = editingValue;

      // Validate the edited row data cell
      newData[editingCell.rowIndex].errorObj = validateRowData(
        editingCell.fieldName,
        newData[editingCell.rowIndex],
        editingCellHeader
      );

      setSubscribedData("gridData", newData);
      setEditingCell(null);
      setEditingCellHeader(null);
      setEditingValue("");
    }
  };

  const getCellStyle = (rowIndex, header) => {
    const hasError = tableOptions.showErrors
      ? cellHasError(rowIndex, header.headerFieldName, data)
      : false;
    return {
      height: tableOptions.columnHeight,
      width: "100px",
      maxWidth: "100px",
      overflow: "hidden",
      border: "1px solid #8080801a",
      padding: "0px",
      fontSize: "0.75em",
      backgroundColor: hasError ? "#ffe6e6" : "#fff",
    };
  };

  const classes = commonStyles();
  return (
    <>
      {/* //<TableRow
    //   key={rowIndex}
    //   style={{ height: tableOptions.columnHeight }}
    //   onContextMenu={(event) =>
    //     tableOptions.contextMenu ? openContextMenu(event, rowIndex) : null
    //   }
    // > */}
      <TableCell
        className={classes.smallCell}
        style={{ height: tableOptions.columnHeight }}
        align="center"
      >
        {rowIndex}
      </TableCell>
      {tableHeaders.map((header) => {
        const hasError = tableOptions.showErrors
          ? cellHasError(rowIndex, header.headerFieldName, data)
          : false;
        const isEditing =
          editingCell &&
          editingCell.rowIndex === rowIndex &&
          editingCell.fieldName === header.headerFieldName;

        return (
          <TableCell
            id={`cell-${rowIndex}-${header.headerFieldName}`}
            key={header.headerName}
            align="center"
            onClick={() => {
              if (!editingCell)
                handleHighlight(rowIndex, header.headerFieldName);
            }}
            onDoubleClick={() => handleDoubleClick(rowIndex, header)}
            draggable={tableOptions.editing ? !editingCell : false}
            onDragStart={() => handleDragStart(rowIndex, header)}
            onDragOver={handleDragOver}
            onDrop={() => handleDrop(rowIndex, header)}
            style={getCellStyle(rowIndex, header)}
          >
            {tableOptions.editing && isEditing ? (
              getCellType(header, editingValue, handleBlur, setEditingValue)
            ) : (
              <>
                {tableOptions.showErrors && hasError ? (
                  <ErrorCellCopy
                    tableOptions={tableOptions}
                    data={data}
                    row={row}
                    header={header}
                    hasError={hasError}
                    rowIndex={rowIndex}
                  />
                ) : (
                  cellContent(row, header, hasError, rowIndex)
                )}
              </>
            )}
          </TableCell>
        );
      })}
    </>
    // </TableRow>
  );
};

export default GridRow;
