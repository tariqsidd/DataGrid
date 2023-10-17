import React, {useEffect, useState} from "react";
import {Table, TableBody, TableCell, TableHead, TableRow, TextField,} from "@material-ui/core";
import ArrowBackIosIcon from "@material-ui/icons/ArrowBackIos";
import ArrowForwardIosIcon from "@material-ui/icons/ArrowForwardIos";
import IconButton from "@material-ui/core/IconButton";
import AddCircleOutlineIcon from "@material-ui/icons/AddCircleOutline";

let Ajv = require("ajv");
let ajv = new Ajv({ allErrors: true });

const TableComponent = ({ data, tableHeaders, onRowChange }) => {
  const [editingCell, setEditingCell] = useState(null);
  const [editingValue, setEditingValue] = useState("");
  const [highlightedCell, setHighlightedCell] = useState(null); // { rowIndex, fieldName }
  const [draggingCell, setDraggingCell] = useState(null);
  const [currentErrorIndex, setCurrentErrorIndex] = useState(0);
  const [errorFocusCell, setErrorFocusCell] = useState(null);
  const columnOrder = tableHeaders.map((item) => item.headerFieldName);

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
      }

      setDraggingCell(null);
      setHighlightedCell(null);
      onRowChange(newData);
      // setData(newData);
    }
  };

  const handleDoubleClick = (rowIndex, header) => {
    setEditingCell({ rowIndex, fieldName: header.headerFieldName });
    setEditingValue(data[rowIndex][header.headerFieldName]);
  };

  const handleBlur = () => {
    if (editingCell) {
      const newData = [...data];
      newData[editingCell.rowIndex][editingCell.fieldName] = editingValue;

      // Validate the edited row data
      newData[editingCell.rowIndex].errorObj = validateRowData(newData[editingCell.rowIndex], tableHeaders);

      onRowChange(newData[editingCell.rowIndex], editingCell.rowIndex);

      setEditingCell(null);
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
    // Validate each row of data when the component mounts
    const newData = [...data];
    newData.forEach((row, index) => {
      row.errorObj = validateRowData(row, tableHeaders);
    });

    onRowChange(newData);

    // If there are errors, focus on the first one
    if (errorCells.length > 0) {
      focusOnErrorCell(0);
    }
  }, [editingCell]);

  const handleNextError = (event) => {
    event.stopPropagation(); // Stop event propagation

    if (currentErrorIndex < errorCells.length - 1) {
      setCurrentErrorIndex((prev) => prev + 1);
      focusOnErrorCell(currentErrorIndex + 1);
    }
  };

  const handlePrevError = (event) => {
    event.stopPropagation(); // Stop event propagation

    if (currentErrorIndex > 0) {
      setCurrentErrorIndex((prev) => prev - 1);
      focusOnErrorCell(currentErrorIndex - 1);
    }
  };

  const cellHasError = (rowIndex, fieldName) => {
    return !!getCellError(rowIndex, fieldName);
  };

  const cellContent = (row, header, hasError, rowIndex) => (
    <>
      {row[header.headerFieldName]}
      {hasError && (
        <div style={{ color: "red", fontSize: "0.75em" }}>
          {getCellError(rowIndex, header.headerFieldName)}
        </div>
      )}
    </>
  );

  const renderErrorCell = (row, header, hasError, rowIndex, isErrorFocused) => {
    return (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            width: "100%",
          }}
        >
          {isErrorFocused && (
            <IconButton
              onClick={(e) => handlePrevError(e)}
              disabled={currentErrorIndex === 0}
              aria-label="previous error"
              disableRipple
              style={{
                backgroundColor: "transparent", // To ensure no background appears
                '&:hover': {
                  backgroundColor: "transparent"  // Override hover style
                }
              }}
            >
              <ArrowBackIosIcon fontSize="small" />
            </IconButton>
          )}

          <span style={{ marginBottom: "2px"}}>
            {cellContent(row, header, hasError, rowIndex)}
          </span>
          {isErrorFocused && (
            <IconButton
              onClick={(e) => handleNextError(e)}
              disabled={currentErrorIndex === errorCells.length - 1}
              aria-label="next error"
              disableRipple
              style={{
                backgroundColor: "transparent", // To ensure no background appears
                '&:hover': {
                  backgroundColor: "transparent"  // Override hover style
                }
              }}
            >
              <ArrowForwardIosIcon fontSize="small"/>
            </IconButton>
          )}
        </div>
    );
  };

  const header = () => {
    return (
      <TableHead>
        <TableRow>
          <TableCell
            style={{
              padding: "8px", // Reduced padding
              fontSize: "0.75em", // Reduced font size if needed
              border: "1px solid #8080801a",
              backgroundColor: "#8080801a",
            }}
            align="center"
          />
          {tableHeaders.map((header) => (
            <TableCell
              style={{
                padding: "8px", // Reduced padding
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
      <TableRow>
        <TableCell
          style={{
            padding: "0px",
            fontSize: "0.75em",
            border: "1px solid #8080801a",
            backgroundColor: "#8080801a",
          }}
          align="center"
        >
          <IconButton onClick={() => {}} size="large">
            <AddCircleOutlineIcon style={{ color: "#000000de" }} />
          </IconButton>
        </TableCell>
        {Array.from({ length: tableHeaders.length }, (_, index) => (
          <TableCell
            key={index} // Provide a unique key for each cell
            style={{
              padding: "8px",
              fontSize: "0.75em",
              border: "1px solid #8080801a",
              backgroundColor: "#8080801a",
              // width: "100%",
            }}
            align="center"
          />
        ))}
      </TableRow>
    );
  };

  const customDateField = (header, rowIndex) => {
    return (
      <TextField
        type="date"
        value={editingValue}
        onBlur={handleBlur}
        onChange={(e) => setEditingValue(e.target.value)}
        InputLabelProps={{
          shrink: true,
        }}
        autoFocus
      />
    );
  };

  const customSelectField = (header, rowIndex) => {
    return (
      <TextField
        select
        value={editingValue}
        onChange={(e) => setEditingValue(e.target.value)}
        onBlur={handleBlur}
        variant="outlined"
        SelectProps={{
          native: true,
        }}
      >
        {header.headerOptions.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </TextField>
    );
  };

  const customComponent = () => {
    // Implement your custom component here
    return <div>Custom Component</div>;
  };

  const customTextField = (header) => {
    return(
      <TextField
        style={{
          padding: "0px",
        }}
        type={header.headerFieldType === "number" ? "number" : "text"}
        value={editingValue}
        onBlur={handleBlur}
        onChange={(e) => setEditingValue(e.target.value)}
        autoFocus
      />
    )
  };

  const getCellType = (header, rowIndex) => {
    switch (header.headerCellType) {
      case "textField":
        return customTextField(header, rowIndex);
      case "date":
        return customDateField(header, rowIndex);
      case "select":
        return customSelectField(header, rowIndex);
      default:
        return customComponent();
    }
  };

  const validateRowData = (rowData, headers) => {
    const errors = {};
    headers.forEach(header => {
      const schema = header.headerSchema;
      const fieldKey = header.headerFieldName;
      const valueToValidate = { [fieldKey]: rowData[fieldKey] };
      if (schema) {
        const validate = ajv.compile(schema);
        if (!validate(valueToValidate)) {
          errors[fieldKey] = validate.errors[0].message;
        }
      }
    });
    return errors;
  };


  return (
    <div>
      <Table stickyHeader>
         {header()}
        <TableBody>
          {data.map((row, rowIndex) => (
            <TableRow key={rowIndex} style={{ height: "60px" }}>
              <TableCell
                style={{
                  border: "1px solid #8080801a",
                  width: "100px",
                  height: "50px",
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
                      height: "50px",
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
                    {isEditing ? getCellType(header, rowIndex) : (
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
           {footer()}
        </TableBody>
      </Table>
    </div>
  );
};

export default TableComponent;
