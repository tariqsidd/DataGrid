import { cellContent, getCellError } from "./utils";
import { Tooltip, IconButton } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import React from "react";
import { DataGridOptions as tableOptions } from "./Constants";
import ArrowBackIosIcon from "@material-ui/icons/ArrowBackIos";
import ArrowForwardIosIcon from "@material-ui/icons/ArrowForwardIos";

const useStyles = makeStyles((theme) => ({
  errorCell: {
    minHeight: tableOptions.columnHeight,
    backgroundColor: "#ffe6e6",
    display: "flex",
    flexDirection: "row",
  },
  errorCellContentFocused: {
    display: "flex",
    width: "100%",
    alignItems: "center",
    justifyContent: "space-between",
  },
  errorCellContentUnFocused: {
    display: "flex",
    width: "100%",
    alignItems: "center",
    justifyContent: "space-around",
  },
  errorButton: {
    padding: "4px",
  },
}));

const ErrorCell = ({
  data = [],
  row,
  header,
  hasError,
  rowIndex,
  isErrorFocused,
  handlePrevError = () => {},
  handleNextError = () => {},
}) => {
  const classes = useStyles();

  return (
    <Tooltip title={getCellError(rowIndex, header.headerFieldName, data)} arrow>
      <div className={classes.errorCell}>
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
              className={classes.errorButton}
            >
              <ArrowBackIosIcon />
            </IconButton>
          )}

          <span>{cellContent(row, header, hasError, rowIndex)}</span>
          {isErrorFocused && (
            <IconButton
              onClick={handleNextError}
              aria-label="next error"
              className={classes.errorButton}
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
