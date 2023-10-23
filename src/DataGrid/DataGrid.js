import React, { useEffect, useState, useCallback, useRef } from "react";
import { Table, TableBody, TableCell, TableRow } from "@material-ui/core";
import GridHeader from "./GridHeader";
import GridFooter from "./GridFooter";
import { DataGridOptions } from "./Constants";
import {
  addNewRow,
  cellContent,
  cellHasError,
  errorIdentifier,
  getCellType,
} from "./utils";
import ContextMenu from "./ContextMenu";
import ErrorCell from "./ErrorCell";
import { commonStyles } from "./styles";
import ExportCSVButton from "./ExportCSVButton";
import ErrorAlert from "./ErrorAlert";

let Ajv = require("ajv");
let ajv = new Ajv({ allErrors: true });

const DataGrid = ({
  incomingData,
  tableHeaders,
  incomingTableOptions,
  itemHeight = 40,
  buffer = 15,
}) => {
  console.log("RE-Render");
  const [editingCell, setEditingCell] = useState(null);
  const [editingCellHeader, setEditingCellHeader] = useState(null);
  const [editingValue, setEditingValue] = useState("");
  // const [highlightedCell, setHighlightedCell] = useState(null);
  const [draggingCell, setDraggingCell] = useState(null);
  const [currentErrorIndex, setCurrentErrorIndex] = useState(0);
  const [errorFocusCell, setErrorFocusCell] = useState(null);
  const columnOrder = tableHeaders.map((item) => item.headerFieldName);
  const [data, setData] = useState(incomingData);
  const [tableOptions, setTableOptions] = useState(DataGridOptions);
  const [contextMenuVisible, setContextMenuVisible] = useState(false);
  const [contextMenuPosition, setContextMenuPosition] = useState({
    top: 0,
    left: 0,
    rowIndex: -1,
  });
  const containerRef = useRef(null);
  const visibleRangeRef = useRef([0, 0]);
  const highlightedCell = useRef(null);
  const setHighlightedCell = (value) => {
    highlightedCell.current = value;
  };
  const errorCells = tableOptions.showErrors ? errorIdentifier(data) : [];

  useEffect(() => {
    function updateVisibleItems() {
      if (containerRef.current) {
        const scrollTop = containerRef.current.scrollTop;
        const startIndex = Math.max(
          0,
          Math.floor(scrollTop / itemHeight) - buffer
        );
        const endIndex = Math.min(
          data.length,
          startIndex +
            Math.ceil(containerRef.current.clientHeight / itemHeight) +
            2 * buffer
        );
        visibleRangeRef.current = [startIndex, endIndex];
        // setVisibleRange([startIndex, endIndex]);
      }
    }

    updateVisibleItems();
    window.addEventListener("scroll", updateVisibleItems);

    return () => {
      window.removeEventListener("scroll", updateVisibleItems);
    };
  }, [itemHeight, buffer, data.length]);

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

  const _handleHighlight = useCallback((rowIndex, header) => {
    setHighlightedCell({ rowIndex, fieldName: header.headerFieldName });
  }, []);

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

  const handleHighlight = useCallback((rowIndex, header) => {
    // Clear previously highlighted cell
    if (highlightedCell.current) {
      const prevCell = document.getElementById(highlightedCell.current);
      clearHighlightedStyle(prevCell);
    }

    // Highlight the new cell
    const cellId = `cell-${rowIndex}-${header.headerFieldName}`;
    const newCell = document.getElementById(cellId);
    applyHighlightedStyle(newCell);

    setHighlightedCell(cellId);
  }, []);

  const handleDragStart = useCallback((rowIndex, header) => {
    setDraggingCell({ rowIndex, fieldName: header.headerFieldName });
  }, []);

  const handleDragOver = useCallback((e) => {
    e.preventDefault();
  }, []);

  const handleDragEnter = (targetRowIndex, header) => {
    setHighlightedCell({
      rowIndex: targetRowIndex,
      fieldName: header.headerFieldName,
    });
  };

  const handleDragEnd = () => {
    setHighlightedCell(null);
  };

  const handleDrop = useCallback(
    (targetRowIndex, header) => {
      if (draggingCell && draggingCell.fieldName === header.headerFieldName) {
        const valueToSet = data[draggingCell.rowIndex][header.headerFieldName];
        const newData = data.map((row, index) => {
          if (index >= draggingCell.rowIndex && index <= targetRowIndex) {
            const updatedRow = { ...row };
            updatedRow[header.headerFieldName] = valueToSet;
            updatedRow.errorObj = validateRowData(
              draggingCell.fieldName,
              updatedRow,
              header
            );
            return updatedRow;
          }
          return row;
        });

        setDraggingCell(null);
        setHighlightedCell(null);
        setData(newData);
      }
    },
    [draggingCell, data]
  );

  const _handleDoubleClick = useCallback(
    (rowIndex, header) => {
      setEditingCell({ rowIndex, fieldName: header.headerFieldName });
      setEditingCellHeader(header);
      setEditingValue(data[rowIndex][header.headerFieldName]);
    },
    [editingCell, editingCellHeader, editingValue]
  );

  const handleDoubleClick = (rowIndex, header) => {
    if (tableOptions.editing) {
      const cell = document.getElementById(highlightedCell.current);
      clearHighlightedStyle(cell);
      setEditingCell({ rowIndex, fieldName: header.headerFieldName });
      setEditingCellHeader(header);
      setEditingValue(data[rowIndex][header.headerFieldName]);
    }
  };

  const validateRowData = useCallback((fieldName, rowData, headers) => {
    const errors = JSON.parse(JSON.stringify(rowData.errorObj));
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
    <div>
      <ExportCSVButton data={data} tableHeaders={tableHeaders} />
      {tableOptions.showErrorAlert && tableOptions.showErrors && (
        <ErrorAlert error={errorCells.length} />
      )}
      <Table
        stickyHeader
        ref={containerRef}
        style={{ overflowY: "auto", height: "100%" }}
      >
        <GridHeader tableOptions={tableOptions} tableHeaders={tableHeaders} />
        <TableBody style={{ height: data.length * itemHeight }}>
          {data
            .slice(visibleRangeRef.current[0], visibleRangeRef.current[1])
            .map((row, rowIndex) => (
              <TableRow
                key={rowIndex}
                style={{ height: tableOptions.columnHeight }}
                onContextMenu={(event) =>
                  tableOptions.contextMenu
                    ? openContextMenu(event, rowIndex)
                    : null
                }
              >
                <TableCell className={classes.smallCell} align="center">
                  {rowIndex}
                </TableCell>
                {tableHeaders.map((header) => {
                  const hasError = tableOptions.showErrors
                    ? cellHasError(rowIndex, header.headerFieldName, data)
                    : false;
                  // const isHighlighted =
                  //   highlightedCell &&
                  //   highlightedCell.rowIndex === rowIndex &&
                  //   highlightedCell.fieldName === header.headerFieldName;
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
                        if (!editingCell) handleHighlight(rowIndex, header);
                      }}
                      onDoubleClick={() => handleDoubleClick(rowIndex, header)}
                      draggable={tableOptions.editing ? !editingCell : false}
                      onDragStart={() => handleDragStart(rowIndex, header)}
                      onDragOver={handleDragOver}
                      onDragEnter={() => handleDragEnter(rowIndex, header)}
                      onDragEnd={handleDragEnd}
                      onDrop={() => handleDrop(rowIndex, header)}
                      style={getCellStyle(rowIndex, header)}
                      // style={{
                      //   width: "100px",
                      //   maxWidth: "100px",
                      //   overflow: "hidden",
                      //   ...(isHighlighted
                      //     ? {
                      //         border: isEditing ? "" : "2px dotted black",
                      //         position: "relative",
                      //       }
                      //     : {
                      //         border: "1px solid #8080801a",
                      //       }),
                      //   padding: "0px",
                      //   fontSize: "0.75em",
                      //   backgroundColor:
                      //     hasError || isErrorFocused ? "#ffe6e6" : "#fff",
                      // }}
                    >
                      {tableOptions.editing && isEditing ? (
                        getCellType(
                          header,
                          editingValue,
                          handleBlur,
                          setEditingValue
                        )
                      ) : (
                        <>
                          {tableOptions.showErrors &&
                          (hasError || isErrorFocused) ? (
                            <ErrorCell
                              data={data}
                              row={row}
                              header={header}
                              hasError={hasError}
                              rowIndex={rowIndex}
                              isErrorFocused={isErrorFocused}
                              errorCells={errorCells}
                              currentErrorIndex={currentErrorIndex}
                              setCurrentErrorIndex={setCurrentErrorIndex}
                              setErrorFocusCell={setErrorFocusCell}
                              setHighlightedCell={setHighlightedCell}
                            />
                          ) : (
                            cellContent(row, header, hasError, rowIndex)
                          )}
                        </>
                      )}
                    </TableCell>
                  );
                })}
              </TableRow>
            ))}
          {tableOptions.addRow && (
            <GridFooter
              addRow={() => setData(addNewRow(tableHeaders, data))}
              tableHeaders={tableHeaders}
              tableOptions={tableOptions}
            />
          )}
        </TableBody>
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
