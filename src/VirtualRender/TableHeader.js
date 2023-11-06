import { Box } from "@material-ui/core";
import React from "react";
// import ErrorAlert from "../DataGrid/ErrorAlert";
import ErrorAlert from "./ErrorAlert";
const TableHeader = ({ columns, scrollToRow, data }) => {
  return (
    <Box
      style={{
        display: "flex",
        flexDirection: "column",
        position: "sticky",
        top: 0,
        zIndex: 1,
      }}
    >
      <ErrorAlert scrollToRow={scrollToRow} data={data} />
      <Box
        style={{
          display: "flex",
          flexDirection: "row",
          backgroundColor: "#f5f5f5",
          borderBottom: "2px solid rgba(224, 224, 224, 1)",
          fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
          fontWeight: 500,
          fontSize: "0.875rem",
          lineHeight: 1.5,
          letterSpacing: "0.01071em",
          color: "rgba(0, 0, 0, 0.87)",
        }}
      >
        <Box style={fixedTableCellStyles.cellStyle(columns, 15)}>{`#`}</Box>
        {columns.map((header) => (
          <Box style={tableCellStyles.cellStyle(columns)}>
            {header.headerName}
          </Box>
        ))}
      </Box>
    </Box>
  );
};

export const tableCellStyles = {
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

export const fixedTableCellStyles = {
  cellStyle: (columns, p = 100) => {
    return {
      display: "inline-flex",
      alignItems: "center",
      justifyContent: "center",
      width: `${p / columns.length}%`,
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
