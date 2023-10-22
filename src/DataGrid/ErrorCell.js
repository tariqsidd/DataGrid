import { cellContent, getCellError } from "./utils";
import { Tooltip, IconButton } from "@material-ui/core";
import React, { useEffect } from "react";
import ArrowBackIosIcon from "@material-ui/icons/ArrowBackIos";
import ArrowForwardIosIcon from "@material-ui/icons/ArrowForwardIos";
import { commonStyles } from "./styles";

const ErrorCell = ({
  tableOptions = {},
  // data = [],
  // row,
  // header,
  // hasError,
  // rowIndex,
  // isErrorFocused,
  // errorCells,
  // currentErrorIndex,
  // setCurrentErrorIndex,
  // setErrorFocusCell,
  // setHighlightedCell,
  data = [],
  row,
  header,
  hasError,
  rowIndex,
  isErrorFocused,
  handlePrevError = () => {},
  handleNextError = () => {},
}) => {
  // const focusOnErrorCell = (index) => {
  //   if (errorCells[index]) {
  //     setErrorFocusCell({
  //       rowIndex: errorCells[index].rowIndex,
  //       fieldName: errorCells[index].cellName,
  //     });
  //     setHighlightedCell({
  //       rowIndex: errorCells[index].rowIndex,
  //       fieldName: errorCells[index].cellName,
  //     });
  //   }
  // };

  // const handleNextError = (event) => {
  //   event.stopPropagation();

  //   if (currentErrorIndex < errorCells.length - 1) {
  //     setCurrentErrorIndex((prev) => prev + 1);
  //     focusOnErrorCell(currentErrorIndex + 1);
  //   } else {
  //     setCurrentErrorIndex(0);
  //     focusOnErrorCell(0);
  //   }
  // };

  // const handlePrevError = (event) => {
  //   event.stopPropagation();

  //   if (currentErrorIndex > 0) {
  //     setCurrentErrorIndex((prev) => prev - 1);
  //     focusOnErrorCell(currentErrorIndex - 1);
  //   } else {
  //     setCurrentErrorIndex(errorCells.length - 1);
  //     focusOnErrorCell(errorCells.length - 1);
  //   }
  // };

  // useEffect(() => {
  //   if (errorCells.length > 0) {
  //     focusOnErrorCell(0);
  //   } else {
  //     setErrorFocusCell(null);
  //     setHighlightedCell(null);
  //   }
  // }, []);

  const classes = commonStyles();

  return (
    <Tooltip title={getCellError(rowIndex, header.headerFieldName, data)} arrow>
      <div
        className={classes.errorCell}
        style={{ height: tableOptions.columnHeight }}
      >
        <div
          className={
            isErrorFocused
              ? classes.errorCellContentFocused
              : classes.errorCellContentUnFocused
          }
        >
          {isErrorFocused && (
            <IconButton
              onClick={handlePrevError}
              aria-label="previous error"
              style={{ padding: "4px" }}
            >
              <ArrowBackIosIcon />
            </IconButton>
          )}

          <span className={classes.cellValue}>
            {cellContent(row, header, hasError, rowIndex)}
          </span>
          {isErrorFocused && (
            <IconButton
              onClick={handleNextError}
              aria-label="next error"
              style={{ padding: "4px" }}
            >
              <ArrowForwardIosIcon />
            </IconButton>
          )}
        </div>
      </div>
    </Tooltip>
  );
};

export default ErrorCell;
