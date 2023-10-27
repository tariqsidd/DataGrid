import { cellContent, getCellError } from "./utils";
import { Tooltip } from "@material-ui/core";
import React from "react";
import { commonStyles } from "./styles";

const ErrorCell = ({ tableOptions = {}, row, header }) => {
  const classes = commonStyles();

  return (
    <Tooltip title={getCellError(row, header.headerFieldName)} arrow>
      <div
        className={classes.errorCell}
        style={{ height: tableOptions.columnHeight }}
      >
        <span className={classes.cellValue}>{cellContent(row, header)}</span>
      </div>
    </Tooltip>
  );
};

export default ErrorCell;
