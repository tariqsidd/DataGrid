import { Box } from "@material-ui/core";
import React from "react";
import { commonStyles } from "./styles";

const TableHeader = ({ columns }) => {
  const classes = commonStyles();
  return (
    <Box className={classes.stickyHeaderBox}>
      <Box className={classes.columnHeader}>
        <Box
          style={fixedTableHeaderCellStyles.cellStyle(columns, 40)}
        >{`#`}</Box>
        {columns.map((header) => (
          <Box style={tableHeaderStyles.cellStyle(columns)}>
            {header.headerName}
          </Box>
        ))}
      </Box>
    </Box>
  );
};

const tableHeaderStyles = {
  cellStyle: (columns, p = 100) => {
    return {
      display: "inline-flex",
      alignItems: "center",
      justifyContent: "center",
      width: `${p / columns.length}%`,
      minWidth: "150px",
      textAlign: "left",
      padding: "16px",
      fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
      fontSize: "0.875rem",
      lineHeight: 1.5,
      letterSpacing: "0.01071em",
    };
  },
};

const fixedTableHeaderCellStyles = {
  cellStyle: (columns, p = 100) => {
    return {
      display: "inline-flex",
      alignItems: "center",
      justifyContent: "center",
      width: `${p / columns.length}%`,
      minWidth: "60px",
      textAlign: "left",
      padding: "16px",
      fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
      fontSize: "0.875rem",
      lineHeight: 1.5,
      letterSpacing: "0.01071em",
    };
  },
};

export default TableHeader;
