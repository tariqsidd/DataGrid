import React, { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TextField,
  MenuItem,
} from "@material-ui/core";
import Autocomplete from "@material-ui/lab/Autocomplete";
import ArrowBackIosIcon from "@material-ui/icons/ArrowBackIos";
import ArrowForwardIosIcon from "@material-ui/icons/ArrowForwardIos";
import IconButton from "@material-ui/core/IconButton";
import AddCircleOutlineIcon from "@material-ui/icons/AddCircleOutline";
import { CustomTextField } from "CustomCells/TextField";

let Ajv = require("ajv");
let ajv = new Ajv({ allErrors: true });

const TableComponent = ({ data, tableHeaders, onRowChange }) => {
  const [error, setError] = useState(Math.random());
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
      setError(Math.random());
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

      onRowChange(newData[editingCell.rowIndex], editingCell.rowIndex);
      setError(Math.random());

      setEditingCell(null);
      setEditingValue("");
    }
  };

  const getCellError = (rowIndex, fieldName) => {
    const rowErrorsObj = data[rowIndex].errorObj;
    if (rowErrorsObj && rowErrorsObj[fieldName]) {
      return rowErrorsObj[fieldName];
    }

    // Earlier Working
    // const rowErrors = data[rowIndex].errors;
    // if (rowErrors && rowErrors.length) {
    //   const errorObj = rowErrors.find((e) => e.cellName === fieldName);
    //   if (errorObj) return errorObj.errorMsg;
    // }
    return null;
  };

  //Previous Work
  // const errorCells = data.flatMap((row, rowIndex) =>
  //   row.errors
  //     ? row.errors.map((error) => ({ rowIndex, cellName: error.cellName }))
  //     : []
  // );

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
    }
  }, [error]);

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
          backgroundColor: "#ffe6e6",
          display: "flex",
          flexDirection: "row",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            width: "100%",
          }}
        >
          {isErrorFocused && (
            <IconButton
              onClick={(e) => handlePrevError(e)}
              disabled={currentErrorIndex === 0}
              aria-label="previous error"
              style={{ padding: "2px" }}
            >
              <ArrowBackIosIcon />
            </IconButton>
          )}

          <span style={{ marginBottom: "2px" }}>
            {cellContent(row, header, hasError, rowIndex)}
          </span>
          {isErrorFocused && (
            <IconButton
              onClick={(e) => handleNextError(e)}
              disabled={currentErrorIndex === errorCells.length - 1}
              aria-label="next error"
              style={{ padding: "2px" }}
            >
              <ArrowForwardIosIcon />
            </IconButton>
          )}
        </div>
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
          ></TableCell>
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
          ></TableCell>
        ))}
      </TableRow>
    );
  };

  const validate = (header, rowIndex, value) => {
    const newData = [...data];
    console.log("Initial", newData);
    //Error Obj Handling
    // if (
    //   newData[rowIndex]["errorObj"] &&
    //   newData[rowIndex]["errorObj"].hasOwnProperty(header.headerFieldName)
    // ) {
    //   let error = JSON.parse(JSON.stringify(newData[rowIndex]["errorObj"]));
    //   delete error[header.headerFieldName];
    //   let obj = { ...newData[rowIndex], errorObj: error };
    //   newData[rowIndex] = obj;
    // }

    console.log("Existing Removal", newData);
    let object = {};
    if (value?.length > 0 || value != undefined) {
      let editingValue = value;
      if (header.headerCellType === "number") {
        editingValue = parseInt(editingValue, 10);
      }
      object = { [header.headerFieldName]: editingValue };
    }
    let validate = ajv.compile(header.headerSchema);
    let valid = validate(object);
    if (!valid) {
      const error = ajv.errorsText(validate.errors);
      // const newData = [...data];

      if (
        newData[rowIndex]["errorObj"] &&
        newData[rowIndex]["errorObj"].hasOwnProperty(header.headerFieldName)
      ) {
        let error = JSON.parse(JSON.stringify(newData[rowIndex]["errorObj"]));
        delete error[header.headerFieldName];
        let obj = { ...newData[rowIndex], errorObj: error };
        newData[rowIndex] = obj;
      }

      newData[rowIndex]["errorObj"][header.headerFieldName] = error;
      const obj = newData[rowIndex]["errorObj"];

      const sortedErrorObj = Object.fromEntries(
        columnOrder
          .filter((key) => obj.hasOwnProperty(key)) // Filter out keys not in the object
          .map((key) => [key, obj[key]])
      );
      newData[rowIndex]["errorObj"] = sortedErrorObj;
    }

    console.log("Post Validation", newData);
  };

  const removeExistingError = (header, rowIndex) => {
    const newData = [...data];

    //Error Obj Handling
    if (
      newData[rowIndex]["errorObj"] &&
      newData[rowIndex]["errorObj"].hasOwnProperty(header.headerFieldName)
    ) {
      let error = JSON.parse(JSON.stringify(newData[rowIndex]["errorObj"]));
      delete error[header.headerFieldName];
      let obj = { ...newData[rowIndex], errorObj: error };
      newData[rowIndex] = obj;
    }
  };

  const customTextField = (header, rowIndex) => {
    // removeExistingError(header, rowIndex);
    // validate(header, rowIndex);
    return (
      <TextField
        margin="dense"
        style={{
          margin: "0px",
          padding: "0px",
        }}
        type={header.headerCellType === "number" ? "number" : "text"}
        variant="outlined"
        value={editingValue}
        onBlur={handleBlur}
        onChange={(e) => {
          setEditingValue(e.target.value.toString());
          // removeExistingError(header, rowIndex);
          validate(header, rowIndex, e.target.value.toString());
          // const newData = [...data];
          // console.log("Before", newData);
          // newData[rowIndex][header.headerFieldName] = e.target.value;
          // if (
          //   newData[rowIndex]["errorObj"] &&
          //   newData[rowIndex]["errorObj"].hasOwnProperty(header.headerFieldName)
          // ) {
          //   let error = JSON.parse(
          //     JSON.stringify(newData[rowIndex]["errorObj"])
          //   );
          //   delete error[header.headerFieldName];
          //   let obj = { ...newData[rowIndex], errorObj: error };
          //   newData[rowIndex] = obj;
          //   console.log("After", newData);
          // }
        }}
        // autoFocus
      />
    );
  };

  const customSelectField = (header, rowIndex) => {
    // validate(header, rowIndex);
    return (
      <TextField
        select
        margin="dense"
        style={{
          margin: "0px",
          padding: "0px",
          width: "180px",
        }}
        value={editingValue}
        onChange={(e) => {
          setEditingValue(e.target.value);
          const newData = [...data];
          console.log("Before", newData);
          newData[rowIndex][header.headerFieldName] = e.target.value;
          if (
            newData[rowIndex]["errorObj"] &&
            newData[rowIndex]["errorObj"].hasOwnProperty(header.headerFieldName)
          ) {
            let error = JSON.parse(
              JSON.stringify(newData[rowIndex]["errorObj"])
            );
            delete error[header.headerFieldName];
            let obj = { ...newData[rowIndex], errorObj: error };
            newData[rowIndex] = obj;
            console.log("After", newData);
          }
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

  const getCellType = (header, rowIndex) => {
    switch (header.headerCellType) {
      case "textField":
        return customTextField(header, rowIndex);
      case "number":
        return customTextField(header, rowIndex);
      // case "date":
      //   return customDateField;
      case "select":
        return customSelectField(header, rowIndex);
      default:
        return "";
    }
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
                    // style={{
                    //   ...(isHighlighted
                    //     ? {
                    //         border: isEditing ? "" : "2px dotted black",
                    //         position: "relative",
                    //       }
                    //     : {
                    //         border: "1px solid #8080801a",
                    //       }),
                    //   padding: "0px", // Reduced padding
                    //   fontSize: "0.75em", // Reduced font size if needed
                    //   // border: "1px solid #8080801a",
                    // }}
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
                    {isEditing ? (
                      // <TextField
                      //   style={{
                      //     padding: "0px",
                      //   }}
                      //   type={
                      //     header.headerCellType === "number" ? "number" : "text"
                      //   }
                      //   variant="outlined"
                      //   value={editingValue}
                      //   onBlur={handleBlur}
                      //   onChange={(e) => setEditingValue(e.target.value)}
                      //   autoFocus
                      // />
                      getCellType(header, rowIndex)
                    ) : (
                      // customTextField(header, rowIndex)
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
