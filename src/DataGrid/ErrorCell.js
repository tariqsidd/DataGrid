import { cellContent, getCellError } from "./utils";
import { Tooltip, IconButton } from "@material-ui/core";
import React from "react";
import ArrowBackIosIcon from "@material-ui/icons/ArrowBackIos";
import ArrowForwardIosIcon from "@material-ui/icons/ArrowForwardIos";
import { commonStyles } from "./styles";

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
  const classes = commonStyles();

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
              style={{ padding: "4px" }}
            >
              <ArrowBackIosIcon />
            </IconButton>
          )}

          <span>{cellContent(row, header, hasError, rowIndex)}</span>
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
