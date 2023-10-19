import { TableCell, TableHead, TableRow } from "@material-ui/core";
import React from "react";
import { commonStyles } from "./styles";

const GridHeader = ({ tableOptions = {}, tableHeaders = [] }) => {
  const classes = commonStyles();

  return (
    <TableHead>
      <TableRow style={{ height: tableOptions.columnHeight }}>
        <TableCell className={classes.highlightedSmallCell} align="center">
          #
        </TableCell>
        {tableHeaders.map((header) => (
          <TableCell className={classes.highlightedCell} align="center">
            {header.headerName}
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
};
export default GridHeader;
