import { cellContent, getCellError } from "./utils";
import { Tooltip } from "@material-ui/core";
import React from "react";
import { commonStyles } from "./styles";

const ErrorCellCopy = ({
  tableOptions = {},
  data = [],
  row,
  header,
  hasError,
  rowIndex,
}) => {
  const classes = commonStyles();

  return (
    <Tooltip title={getCellError(rowIndex, header.headerFieldName, data)} arrow>
      <div
        className={classes.errorCell}
        style={{ height: tableOptions.columnHeight }}
      >
        <span className={classes.cellValue}>
          {cellContent(row, header, hasError, rowIndex)}
        </span>
      </div>
    </Tooltip>
  );
};

export default ErrorCellCopy;
