import React, { useState, useCallback, useRef, useEffect, memo } from "react";
import { TableCell, TableRow, Checkbox, Tooltip } from "@material-ui/core";
import { commonStyles } from "./styles";
import { cellContent, cellHasError, getCellType } from "./utils";
import {
  subscribeToData,
  setSubscribedData,
  getSubscribedData,
} from "./Reactive/subscriber";
import ErrorCell from "./ErrorCell";
import isEqual from "lodash.isequal";

let Ajv = require("ajv");
let ajv = new Ajv({ allErrors: true });

const GridRow = ({
  tableOptions = {},
  tableHeaders = [],
  rowIndex,
  row,
  openContextMenu,
  onRowChange,
}) => {
  console.log("Table Row Rendered");
  const columnOrder = tableHeaders.map((item) => item.headerFieldName);
  const [rowData, setRowData] = useState(row);
  const [editingCell, setEditingCell] = useState(null);
  const [editingCellHeader, setEditingCellHeader] = useState(null);
  const [editingValue, setEditingValue] = useState("");
  const [draggingCell, setDraggingCell] = useState(null);
  const [selected, setSelected] = useState(false);

  const data = useRef(null);
  const setData = (value) => {
    data.current = value;
  };

  const highlightedCell = useRef(null);
  const setHighlightedCell = (value) => {
    highlightedCell.current = value;
  };

  const errorFocusedCellRef = useRef(null);
  const setErrorFocusedCellRef = (value) => {
    errorFocusedCellRef.current = value;
  };

  useEffect(() => {
    subscribeToData("gridData", getGridData);
    subscribeToData("highlightedCell", getHighlightedCell);
    subscribeToData("errorFocusCell", getErrorFocusCell);
    subscribeToData("errorFocusedCellRef", getErrorFocusedCellRef);
    subscribeToData("dropCell", getDropCell);
    setData(getSubscribedData("gridData"));
  }, []);

  const getGridData = (value) => {
    setData([...value]);
  };

  const getDropCell = (value) => {
    const draggingCell = getSubscribedData("draggingCell");
    const dropCell = value;
    if (draggingCell && dropCell) {
      const draggingCellIndex = data.current.findIndex(
        (x) => x.id === draggingCell.id
      );
      const dropCellIndex = data.current.findIndex((x) => x.id === dropCell.id);
      const currentRowIndex = data.current.findIndex(
        (x) => x.id === rowData.id
      );
      if (
        currentRowIndex > draggingCellIndex &&
        currentRowIndex <= dropCellIndex
      ) {
        setDraggingCell(value);
        setOnDrop(
          dropCellIndex,
          dropCell.header,
          draggingCellIndex,
          draggingCell
        );
      }
    }
  };

  const setOnDrop = (
    dropCellIndex,
    dropCellHeader,
    draggingCellIndex,
    draggingCell
  ) => {
    if (draggingCell.fieldName === dropCellHeader.headerFieldName) {
      for (let i = draggingCellIndex; i <= dropCellIndex; i++) {
        rowData[dropCellHeader.headerFieldName] = draggingCell.value;
        rowData["error"] = validateRowData(
          draggingCell.fieldName,
          rowData,
          dropCellHeader
        );
      }
      handleHighlight(dropCellIndex, dropCellHeader.headerFieldName);
      onRowChange(rowData, rowIndex);
    }
  };

  const getHighlightedCell = (value) => {
    setHighlightedCell(value);
  };

  const getErrorFocusedCellRef = (value) => {
    setErrorFocusedCellRef(value);
  };

  const getErrorFocusCell = (value) => {
    if (value && data.current) {
      const currentRowIndex = data.current.findIndex(
        (x) => x.id === value.current.rowId
      );
      const nextRowIndex = data.current.findIndex(
        (x) => x.id === value.next.rowId
      );
      const selfRowIndex = data.current.findIndex((x) => x.id === rowData.id);
      if (selfRowIndex === currentRowIndex || selfRowIndex === nextRowIndex) {
        handleErrorFocus(nextRowIndex, value.next.fieldName, value.next.rowId);
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

  const handleErrorFocus = (rowIndex, headerFieldName, rowId) => {
    if (errorFocusedCellRef.current) {
      const prevCell = document.getElementById(errorFocusedCellRef.current);
      clearErrorFocusStyle(prevCell);
    }
    if (rowIndex != null && headerFieldName != null) {
      // Error Focus the new cell
      const cellId = `cell-${rowId}-${headerFieldName}`;
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
      const cellId = `cell-${rowData.id}-${headerFieldName}`;
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
      setEditingValue(rowData[header.headerFieldName]);
    }
  };

  const handleDragStart = (rowIndex, header) => {
    setSubscribedData("draggingCell", {
      id: rowData.id,
      value: rowData[header.headerFieldName],
      fieldName: header.headerFieldName,
    });
  };

  const handleDragOver = useCallback((e) => {
    e.preventDefault();
  }, []);

  const handleDrop = (targetRowIndex, header) => {
    setSubscribedData("dropCell", {
      id: rowData.id,
      header: header,
    });
  };

  const validateRowData = useCallback((fieldName, rowData, headers) => {
    const errors = rowData.error
      ? JSON.parse(JSON.stringify(rowData.error))
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
      rowData[editingCell.fieldName] = editingValue;

      // Validate the edited row data cell
      rowData.error = validateRowData(
        editingCell.fieldName,
        rowData,
        editingCellHeader
      );
      setEditingCell(null);
      setEditingCellHeader(null);
      setEditingValue("");
    }
    console.log("Row changed in Grid Row", rowData);
    setRowData(rowData);
    onRowChange(rowData, rowIndex);
  };

  const getCellStyle = (header) => {
    const hasError = tableOptions.showErrors
      ? cellHasError(rowData, header.headerFieldName)
      : false;
    return {
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
    <TableRow
      key={rowData.id}
      style={{ height: tableOptions.columnHeight }}
      // onContextMenu={(event) =>
      //   tableOptions.contextMenu
      //     ? openContextMenu(event, rowIndex, rowData.id)
      //     : null
      // }
    >
      <TableCell className={classes.smallCell} align="center">
        <Tooltip title={"Select to Delete Row"} arrow>
          <Checkbox
            color="default"
            checked={selected}
            onChange={(event) => {
              const array = getSubscribedData("selectedRows");
              const index = array.indexOf(rowData.id);
              if (index === -1) {
                array.push(rowData.id);
              } else {
                array.splice(index, 1);
              }
              setSubscribedData("selectedRows", array);
              setSelected(!selected);
            }}
          />
        </Tooltip>
        {/* {rowIndex} */}
      </TableCell>
      {tableHeaders.map((header) => {
        const hasError = tableOptions.showErrors
          ? cellHasError(rowData, header.headerFieldName)
          : false;
        const isEditing =
          editingCell &&
          editingCell.rowIndex === rowIndex &&
          editingCell.fieldName === header.headerFieldName;

        return (
          <TableCell
            id={`cell-${rowData.id}-${header.headerFieldName}`}
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
            style={getCellStyle(header)}
          >
            {tableOptions.editing && isEditing ? (
              getCellType(header, editingValue, handleBlur, setEditingValue)
            ) : (
              <>
                {tableOptions.showErrors && hasError ? (
                  <ErrorCell
                    tableOptions={tableOptions}
                    row={rowData}
                    header={header}
                    rowIndex={rowIndex}
                  />
                ) : (
                  cellContent(rowData, header)
                )}
              </>
            )}
          </TableCell>
        );
      })}
    </TableRow>
  );
};

export default memo(GridRow, (p, n) => {
  // console.log('PREVIOUS',p.id)
  // console.log('NEXT', n.id)
  // console.log(p.id !== n.id)
  return p.row.id === n.row.id;
});
