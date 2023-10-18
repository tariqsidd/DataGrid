import React, { useState, useEffect, useRef } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TextField,
  Menu,
  MenuItem,
  Tooltip,
  Button,
} from "@material-ui/core";
import {
  KeyboardDatePicker,
  MuiPickersUtilsProvider,
} from "@material-ui/pickers";
import DateFnsUtils from "@date-io/date-fns";
import "date-fns";
import ArrowBackIosIcon from "@material-ui/icons/ArrowBackIos";
import ArrowForwardIosIcon from "@material-ui/icons/ArrowForwardIos";
import IconButton from "@material-ui/core/IconButton";
import AddCircleOutlineIcon from "@material-ui/icons/AddCircleOutline";
import GetAppIcon from "@material-ui/icons/GetApp";
import { CSVLink } from "react-csv";

let Ajv = require("ajv");
let ajv = new Ajv({ allErrors: true });
const dateFns = require("date-fns");

const TableComponent = ({ incomingData, tableHeaders, onRowChange }) => {
  const [error, setError] = useState(Math.random());
  const [editingCell, setEditingCell] = useState(null);
  const [editingCellHeader, setEditingCellHeader] = useState(null);
  const [editingValue, setEditingValue] = useState("");
  const [highlightedCell, setHighlightedCell] = useState(null); // { rowIndex, fieldName }
  const [draggingCell, setDraggingCell] = useState(null);
  const [currentErrorIndex, setCurrentErrorIndex] = useState(0);
  const [errorFocusCell, setErrorFocusCell] = useState(null);
  const columnOrder = tableHeaders.map((item) => item.headerFieldName);
  const [data, setData] = useState(incomingData);
  const [tableOptions, setTableOptions] = useState({
    addRow: false,
    deleteRow: false,
    duplicateRow: false,
    tableEditing: true,
    columnHeight: "40px",
  });

  useEffect(() => {
    const contextMenu = tableOptions.deleteRow || tableOptions.duplicateRow;

    setTableOptions({
      ...tableOptions,
      contextMenu: contextMenu,
    });
  }, []);
  console.log(tableOptions);

  const handleHighlight = (rowIndex, header) => {
    setHighlightedCell({ rowIndex, fieldName: header.headerFieldName });
  };

  const handleDragStart = (rowIndex, header) => {
    setDraggingCell({ rowIndex, fieldName: header.headerFieldName });
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDragEnter = (targetRowIndex, header) => {
    setHighlightedCell({
      rowIndex: targetRowIndex,
      fieldName: header.headerFieldName,
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
        // Validate the edited row data cell
        newData[i].errorObj = validateRowData(
          draggingCell.fieldName,
          newData[i],
          header
        );
      }

      setDraggingCell(null);
      setHighlightedCell(null);
      onRowChange(newData);
      setError(Math.random());
    }
  };

  const handleDoubleClick = (rowIndex, header) => {
    setEditingCell({ rowIndex, fieldName: header.headerFieldName });
    setEditingCellHeader(header);
    setEditingValue(data[rowIndex][header.headerFieldName]);
  };

  const validateRowData = (fieldName, rowData, headers) => {
    // console.log("Row Data", rowData);
    // console.log("Field Name", fieldName);
    // console.log("Header", headers);

    const errors = JSON.parse(JSON.stringify(rowData.errorObj));
    // console.log("Errors Initially", errors);
    // console.log(errors.hasOwnProperty(fieldName));
    if (errors.hasOwnProperty(fieldName)) {
      delete errors[fieldName];
    }
    // console.log(" Errors After Removing Existing Error", errors);
    const schema = headers.headerSchema;
    const fieldKey = headers.headerFieldName;
    let valueToValidate = {};
    let value = rowData[fieldKey];
    // console.log("Value length check", value.length > 0);
    // console.log("Value undefined", value != undefined);
    if (headers.headerCellType === "number") {
      if (value != undefined) {
        valueToValidate = { [fieldKey]: value };
      }
    } else if (value.length > 0) {
      valueToValidate = { [fieldKey]: value };
    }
    // console.log("Value to Validate", valueToValidate);
    if (schema) {
      const validate = ajv.compile(schema);
      if (!validate(valueToValidate)) {
        errors[fieldKey] = validate.errors[0].message;
      }
    }

    //Sorting Error
    const sortedError = Object.fromEntries(
      columnOrder
        .filter((key) => errors.hasOwnProperty(key)) // Filter out keys not in the object
        .map((key) => [key, errors[key]])
    );

    return sortedError;
  };

  const handleBlur = () => {
    console.log("On blur called");
    if (editingCell && editingCellHeader) {
      const newData = [...data];
      newData[editingCell.rowIndex][editingCell.fieldName] = editingValue;

      // Validate the edited row data cell
      newData[editingCell.rowIndex].errorObj = validateRowData(
        editingCell.fieldName,
        newData[editingCell.rowIndex],
        editingCellHeader
      );

      onRowChange(newData[editingCell.rowIndex], editingCell.rowIndex);
      setError(Math.random());

      setEditingCell(null);
      setEditingCellHeader(null);
      setEditingValue("");
    }
  };

  const getCellError = (rowIndex, fieldName) => {
    const rowErrorsObj = data[rowIndex].errorObj;
    if (rowErrorsObj && rowErrorsObj[fieldName]) {
      return rowErrorsObj[fieldName];
    }
    return null;
  };

  const errorCells = data.flatMap((row, rowIndex) =>
    Object.keys(row.errorObj).map((cellName) => ({
      rowIndex,
      cellName,
    }))
  );

  const focusOnErrorCell = (index) => {
    if (errorCells[index]) {
      setErrorFocusCell({
        rowIndex: errorCells[index].rowIndex,
        fieldName: errorCells[index].cellName,
      });
      setHighlightedCell({
        rowIndex: errorCells[index].rowIndex,
        fieldName: errorCells[index].cellName,
      });
    }
  };

  useEffect(() => {
    if (errorCells.length > 0) {
      focusOnErrorCell(0);
    } else {
      setErrorFocusCell(null);
      setHighlightedCell(null);
    }
  }, [error]);

  useEffect(() => {}, [data]);

  const handleNextError = (event) => {
    event.stopPropagation(); // Stop event propagation

    if (currentErrorIndex < errorCells.length - 1) {
      setCurrentErrorIndex((prev) => prev + 1);
      focusOnErrorCell(currentErrorIndex + 1);
    } else {
      setCurrentErrorIndex(0);
      focusOnErrorCell(0);
    }
  };

  const handlePrevError = (event) => {
    event.stopPropagation(); // Stop event propagation

    if (currentErrorIndex > 0) {
      setCurrentErrorIndex((prev) => prev - 1);
      focusOnErrorCell(currentErrorIndex - 1);
    } else {
      setCurrentErrorIndex(errorCells.length - 1);
      focusOnErrorCell(errorCells.length - 1);
    }
  };

  const cellHasError = (rowIndex, fieldName) => {
    return !!getCellError(rowIndex, fieldName);
  };

  const cellContent = (row, header, hasError, rowIndex) => (
    <>
      {row[header.headerFieldName]}
      {/* {hasError && (
        <div style={{ color: "red", fontSize: "0.75em" }}>
          {getCellError(rowIndex, header.headerFieldName)}
        </div>
      )} */}
    </>
  );

  const renderErrorCell = (row, header, hasError, rowIndex, isErrorFocused) => {
    return (
      <Tooltip title={getCellError(rowIndex, header.headerFieldName)} arrow>
        <div
          style={{
            minHeight: tableOptions.columnHeight,
            backgroundColor: "#ffe6e6",
            display: "flex",
            flexDirection: "row",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: isErrorFocused ? "space-between" : "space-around",
              width: "100%",
              alignItems: "center",
            }}
          >
            {isErrorFocused && (
              <IconButton
                onClick={(e) => handlePrevError(e)}
                // disabled={currentErrorIndex === 0}
                aria-label="previous error"
                style={{ padding: "4px" }}
              >
                <ArrowBackIosIcon />
              </IconButton>
            )}

            <span>{cellContent(row, header, hasError, rowIndex)}</span>
            {isErrorFocused && (
              <IconButton
                onClick={(e) => handleNextError(e)}
                // disabled={currentErrorIndex === errorCells.length - 1}
                aria-label="next error"
                style={{ padding: "4px", margingTop: "4px" }}
              >
                <ArrowForwardIosIcon />
              </IconButton>
            )}
          </div>
        </div>
      </Tooltip>
    );
  };

  const header = () => {
    return (
      <TableHead>
        <TableRow style={{ height: tableOptions.columnHeight }}>
          <TableCell
            style={{
              width: "30px",
              maxWidth: "30px",
              padding: "4px", // Reduced padding
              fontSize: "0.75em", // Reduced font size if needed
              border: "1px solid #8080801a",
              backgroundColor: "#8080801a",
            }}
            align="center"
          >
            #
          </TableCell>
          {tableHeaders.map((header) => (
            <TableCell
              style={{
                width: "30px",
                maxWidth: "30px",
                padding: "4px", // Reduced padding
                fontSize: "0.75em", // Reduced font size if needed
                border: "1px solid #8080801a",
                backgroundColor: "#8080801a",
              }}
              align="center"
            >
              {header.headerName}
            </TableCell>
          ))}
        </TableRow>
      </TableHead>
    );
  };

  const footer = () => {
    return (
      <TableRow style={{ height: tableOptions.columnHeight }}>
        <TableCell
          style={{
            width: "30px",
            maxWidth: "30px",
            padding: "4px",
            fontSize: "0.75em",
            border: "1px solid #8080801a",
            backgroundColor: "#8080801a",
          }}
          align="center"
          onClick={() => {
            addRow();
          }}
        >
          <IconButton
            onClick={() => {
              // addRow();
            }}
            style={{ padding: "0px" }}
          >
            <AddCircleOutlineIcon
              style={{ color: "#000000de", height: "25px" }}
            />
          </IconButton>
        </TableCell>
        {Array.from({ length: tableHeaders.length }, (_, index) => (
          <TableCell
            key={index} // Provide a unique key for each cell
            style={{
              padding: "4px",
              fontSize: "0.75em",
              border: "1px solid #8080801a",
              backgroundColor: "#8080801a",
              // width: "100%",
            }}
            align="center"
          ></TableCell>
        ))}
      </TableRow>
    );
  };

  function getDefaultForType(type) {
    switch (type) {
      case "string":
        return "";
      case "Date":
        return "";
      case "number":
        return null;
      default:
        return "";
    }
  }

  const addRow = () => {
    const newRow = {};
    tableHeaders.forEach((header) => {
      newRow[header.headerFieldName] = getDefaultForType(
        header.headerFieldType
      );
    });
    newRow["errorObj"] = {};
    const newData = [...data];
    newData.push(newRow);
    console.log(newData);
    setData(newData);
  };

  const customTextField = (header) => {
    return (
      <TextField
        margin="dense"
        style={{
          width: "90%",
        }}
        type={header.headerCellType === "number" ? "number" : "text"}
        variant="outlined"
        value={editingValue}
        onBlur={handleBlur}
        onChange={(e) => {
          header.headerCellType === "number"
            ? e.target.value.length > 0
              ? setEditingValue(parseInt(e.target.value, 10))
              : setEditingValue(null)
            : setEditingValue(e.target.value.toString());
        }}
        autoFocus
      />
    );
  };

  const customSelectField = (header) => {
    return (
      <TextField
        select
        margin="dense"
        style={{
          width: "90%",
        }}
        value={editingValue}
        onBlur={handleBlur}
        onChange={(e) => {
          setEditingValue(e.target.value);
        }}
        variant="outlined"
      >
        {header.headerOptions.map((option) => (
          <MenuItem key={option.value} value={option.value}>
            {option.label}
          </MenuItem>
        ))}
      </TextField>
    );
  };

  const customDateField = (header) => {
    return (
      <MuiPickersUtilsProvider utils={DateFnsUtils}>
        <KeyboardDatePicker
          margin="dense"
          style={{
            width: "90%",
          }}
          error={false}
          helperText={null}
          variant="inline"
          format="dd/MM/yyyy"
          inputVariant="outlined"
          value={dateFns.parse(editingValue, "dd/MM/yyyy", new Date())}
          onChange={(date) => {
            const dateValid = dateFns.isValid(date);
            if (dateValid) {
              const formattedDate = dateFns.format(date, "dd/MM/yyyy");
              setEditingValue(formattedDate);
            } else {
              setEditingValue("");
            }
          }}
          onClose={() => {
            handleBlur();
          }}
          // onBlur={handleBlur}
          minDate={
            header.headerDateProperties && header.headerDateProperties.min
              ? dateFns.parse(
                  header.headerDateProperties.min,
                  "dd/MM/yyyy",
                  new Date()
                )
              : undefined
          }
          maxDate={
            header.headerDateProperties && header.headerDateProperties.max
              ? dateFns.parse(
                  header.headerDateProperties.max,
                  "dd/MM/yyyy",
                  new Date()
                )
              : undefined
          }
          inputProps={{ readOnly: true }}
        />
      </MuiPickersUtilsProvider>
    );
  };

  const getCellType = (header) => {
    switch (header.headerCellType) {
      case "textField":
        return customTextField(header);
      case "number":
        return customTextField(header);
      case "date":
        return customDateField(header);
      case "select":
        return customSelectField(header);
      default:
        return "";
    }
  };

  const prepareCSVData = (data) => {
    const csvData = [];

    // Add the header row
    const headerRow = tableHeaders.map((header) => header.headerName);
    csvData.push(headerRow);

    // Add the data rows
    data.forEach((row) => {
      const rowData = tableHeaders.map((header) => row[header.headerFieldName]);
      csvData.push(rowData);
    });

    return csvData;
  };

  const csvLinkRef = useRef();

  const [contextMenuVisible, setContextMenuVisible] = useState(false);
  const [contextMenuPosition, setContextMenuPosition] = useState({
    top: 0,
    left: 0,
    rowIndex: -1,
  });

  // Function to open the context menu
  const openContextMenu = (event, rowIndex) => {
    event.preventDefault();
    setContextMenuPosition({
      top: event.clientY,
      left: event.clientX,
      rowIndex: rowIndex,
    });
    setContextMenuVisible(true);
  };

  // Function to close the context menu
  const closeContextMenu = () => {
    setContextMenuVisible(false);
  };

  const duplicateRow = (rowIndex) => {
    const newData = [...data];
    const duplicateRow = newData[rowIndex];
    newData.push(duplicateRow);
    setData(newData);
    closeContextMenu();
  };

  const deleteRow = (rowIndex) => {
    const newData = [...data];
    newData.splice(rowIndex, 1);
    setData(newData);
    closeContextMenu();
  };

  // Render the context menu
  const renderContextMenu = (
    <div
      style={{
        position: "fixed",
        top: contextMenuPosition.top,
        left: contextMenuPosition.left,
        background: "white",
        border: "1px solid #ccc",
        boxShadow: "2px 2px 5px #888888",
        zIndex: 1000,
      }}
    >
      <Menu
        keepMounted
        open={contextMenuVisible}
        onClose={closeContextMenu}
        anchorReference="anchorPosition"
        anchorPosition={
          contextMenuVisible
            ? { top: contextMenuPosition.top, left: contextMenuPosition.left }
            : undefined
        }
      >
        {tableOptions.deleteRow && (
          <MenuItem
            onClick={() => {
              deleteRow(contextMenuPosition.rowIndex);
            }}
          >
            Delete Row
          </MenuItem>
        )}
        {tableOptions.duplicateRow && (
          <MenuItem
            onClick={() => {
              duplicateRow(contextMenuPosition.rowIndex);
            }}
          >
            Duplicate Row
          </MenuItem>
        )}
      </Menu>
    </div>
  );

  return (
    <div>
      <div
        style={{
          display: "flex",
          justifyContent: "flex-end",
          padding: "8px",
        }}
      >
        <Button
          variant="contained"
          color="primary"
          onClick={() => {
            if (csvLinkRef.current) {
              csvLinkRef.current.link.click();
            }
          }}
          startIcon={<GetAppIcon />}
        >
          Export CSV
        </Button>
        <CSVLink
          data={prepareCSVData(data)} // Call your data preparation function
          filename="table-data.csv"
          ref={csvLinkRef} // Specify the CSV file name
        />
      </div>
      <Table stickyHeader>
        {header()}
        <TableBody>
          {data.map((row, rowIndex) => (
            <TableRow
              key={rowIndex}
              style={{ height: tableOptions.columnHeight }}
              onContextMenu={(event) =>
                tableOptions.contextMenu
                  ? openContextMenu(event, rowIndex)
                  : null
              }
            >
              <TableCell
                style={{
                  border: "1px solid #8080801a",
                  width: "30px",
                  maxWidth: "30px",
                  overflow: "hidden",
                  padding: "0px",
                  fontSize: "0.75em",
                }}
                align="center"
              >
                {rowIndex}
              </TableCell>
              {tableHeaders.map((header) => {
                const hasError = cellHasError(rowIndex, header.headerFieldName);
                const isHighlighted =
                  highlightedCell &&
                  highlightedCell.rowIndex === rowIndex &&
                  highlightedCell.fieldName === header.headerFieldName;
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
                    key={header.headerName}
                    align="center"
                    onClick={() => {
                      if (!editingCell) handleHighlight(rowIndex, header);
                    }}
                    onDoubleClick={() => handleDoubleClick(rowIndex, header)}
                    draggable={!editingCell}
                    onDragStart={() => handleDragStart(rowIndex, header)}
                    onDragOver={handleDragOver}
                    onDragEnter={() => handleDragEnter(rowIndex, header)}
                    onDragEnd={handleDragEnd}
                    onDrop={() => handleDrop(rowIndex, header)}
                    style={{
                      width: "100px",
                      maxWidth: "100px",
                      overflow: "hidden",
                      ...(isHighlighted
                        ? {
                            border: isEditing ? "" : "2px dotted black",
                            position: "relative",
                          }
                        : {
                            border: "1px solid #8080801a",
                          }),
                      padding: "0px",
                      fontSize: "0.75em",
                      backgroundColor:
                        hasError || isErrorFocused ? "#ffe6e6" : "#fff",
                    }}
                  >
                    {isEditing ? (
                      getCellType(header)
                    ) : (
                      <>
                        {hasError || isErrorFocused
                          ? renderErrorCell(
                              row,
                              header,
                              hasError,
                              rowIndex,
                              isErrorFocused
                            )
                          : cellContent(row, header, hasError, rowIndex)}
                      </>
                    )}
                  </TableCell>
                );
              })}
            </TableRow>
          ))}
          {tableOptions.addRow && footer()}
        </TableBody>
      </Table>
      {renderContextMenu}
    </div>
  );
};

export default TableComponent;
