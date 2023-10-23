import React, { useState, useCallback, useRef, useEffect } from "react";
import { TableCell, TableRow } from "@material-ui/core";
import { commonStyles } from "./styles";
import { cellContent, cellHasError, getCellType } from "./utils";
import { subscribeToData, unsubscribe } from "./Reactive/subscriber";
import { setSubscribedData } from "./Reactive/subscriber";

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
  const columnOrder = tableHeaders.map((item) => item.headerFieldName);
  const [errorFocusCell, setErrorFocusCell] = useState(null);
  const [editingCell, setEditingCell] = useState(null);
  const [editingCellHeader, setEditingCellHeader] = useState(null);
  const [editingValue, setEditingValue] = useState("");
  const [draggingCell, setDraggingCell] = useState(null);

  const highlightedCell = useRef(null);
  const setHighlightedCell = (value) => {
    highlightedCell.current = value;
  };

  useEffect(() => {
    subscribeToData("draggingCell", getDraggingCell);
    return () => {
      // Run on unmount
      unsubscribe("draggingCell");
    };
  }, []);

  const getDraggingCell = (value) => {
    setDraggingCell(value);
  };
  //   useEffect(() => {
  //     if (errorFocusCell !== null && rowRefs[errorFocusCell.rowIndex].current) {
  //       const targetRowRef = rowRefs[errorFocusCell.rowIndex].current;
  //       const parentContainer = targetRowRef.closest(".table-container");

  //       if (parentContainer) {
  //         targetRowRef.scrollIntoView({ behavior: "smooth", block: "center" });
  //       }
  //     }
  //   }, [errorFocusCell]);

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

  const handleHighlight = useCallback((rowIndex, headerFieldName) => {
    // Clear previously highlighted cell
    console.log("Handle Highlight");
    if (highlightedCell.current) {
      const prevCell = document.getElementById(highlightedCell.current);
      clearHighlightedStyle(prevCell);
    }
    if (rowIndex != null && headerFieldName != null) {
      // Highlight the new cell
      const cellId = `cell-${rowIndex}-${headerFieldName}`;
      const newCell = document.getElementById(cellId);
      applyHighlightedStyle(newCell);
      setHighlightedCell(cellId);
    }
  }, []);

  const handleDoubleClick = (rowIndex, header) => {
    if (tableOptions.editing) {
      const cell = document.getElementById(highlightedCell.current);
      clearHighlightedStyle(cell);
      setEditingCell({ rowIndex, fieldName: header.headerFieldName });
      setEditingCellHeader(header);
      setEditingValue(data[rowIndex][header.headerFieldName]);
    }
  };

  const handleDragStart = useCallback((rowIndex, header) => {
    console.log("Handle Drag Start");
    setSubscribedData("draggingCell", {
      rowIndex,
      fieldName: header.headerFieldName,
    });
  }, []);

  const handleDragOver = useCallback((e) => {
    e.preventDefault();
  }, []);

  const handleDragEnter = (targetRowIndex, header) => {
    setHighlightedCell({
      rowIndex: targetRowIndex,
      headerFieldName: header.headerFieldName,
    });
  };

  const handleDragEnd = () => {
    setHighlightedCell(null);
  };

  const handleDrop = (targetRowIndex, header) => {
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
      }
      setSubscribedData("draggingCell", null);
      setHighlightedCell(null);
      //   setData(newData);
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

      setEditingCell(null);
      setEditingCellHeader(null);
      setEditingValue("");
    }
  };

  const getCellStyle = (rowIndex, header) => {
    const isHighlighted =
      highlightedCell.current &&
      highlightedCell.current.rowIndex === rowIndex &&
      highlightedCell.current.fieldName === header.headerFieldName;

    const hasError = tableOptions.showErrors
      ? cellHasError(rowIndex, header.headerFieldName, data)
      : false;
    const isErrorFocused =
      errorFocusCell &&
      errorFocusCell.rowIndex === rowIndex &&
      errorFocusCell.fieldName === header.headerFieldName;
    const isEditing =
      editingCell &&
      editingCell.rowIndex === rowIndex &&
      editingCell.fieldName === header.headerFieldName;

    return {
      width: "100px",
      maxWidth: "100px",
      overflow: "hidden",
      border: isHighlighted
        ? isEditing
          ? ""
          : "2px dotted black"
        : "1px solid #8080801a",
      position: isHighlighted ? "relative" : undefined,
      padding: "0px",
      fontSize: "0.75em",
      backgroundColor: hasError || isErrorFocused ? "#ffe6e6" : "#fff",
    };
  };

  const classes = commonStyles();
  return (
    <TableRow
      key={rowIndex}
      style={{ height: tableOptions.columnHeight }}
      onContextMenu={(event) =>
        tableOptions.contextMenu ? openContextMenu(event, rowIndex) : null
      }
    >
      <TableCell className={classes.smallCell} align="center">
        {rowIndex}
      </TableCell>
      {tableHeaders.map((header) => {
        const hasError = tableOptions.showErrors
          ? cellHasError(rowIndex, header.headerFieldName, data)
          : false;
        const isErrorFocused =
          errorFocusCell &&
          errorFocusCell.rowIndex === rowIndex &&
          errorFocusCell.fieldName === header.headerFieldName;
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
            onDragEnter={() => handleDragEnter(rowIndex, header)}
            onDragEnd={handleDragEnd}
            onDrop={() => handleDrop(rowIndex, header)}
            style={getCellStyle(rowIndex, header)}
          >
            {tableOptions.editing && isEditing ? (
              getCellType(header, editingValue, handleBlur, setEditingValue)
            ) : (
              <>
                {tableOptions.showErrors && (hasError || isErrorFocused) ? (
                  //   <ErrorCell
                  //     tableOptions={tableOptions}
                  //     data={data}
                  //     row={row}
                  //     header={header}
                  //     hasError={hasError}
                  //     rowIndex={rowIndex}
                  //     isErrorFocused={isErrorFocused}
                  //     errorCells={errorCells}
                  //     currentErrorIndex={currentErrorIndex}
                  //     setCurrentErrorIndex={setCurrentErrorIndex}
                  //     setErrorFocusCell={setErrorFocusCell}
                  //     setHighlightedCell={setHighlightedCell}
                  //     handleHighlight={handleHighlight}
                  //   />
                  <></>
                ) : (
                  cellContent(row, header, hasError, rowIndex)
                )}
              </>
            )}
          </TableCell>
        );
      })}
    </TableRow>
  );
};

export default GridRow;
