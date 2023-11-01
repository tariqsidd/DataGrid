import { Box } from "@material-ui/core";
import React from "react";
import TableCell from "./TableCell";
import ErrorAlert from "../DataGrid/ErrorAlert";

const TableHeader = ({ columns }) => {
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
      <ErrorAlert />
      <Box
        style={{
          display: "flex",
          flexDirection: "row",
          // position: 'sticky',
          // top: 0,
          // zIndex: 1,
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
        <TableCell key="header" header width={`${15 / columns.length}%`}>
          {`#`}
        </TableCell>
        {columns.map((header, index) => (
          <TableCell key={index} header width={`${100 / columns.length}%`}>
            {header.headerName}
          </TableCell>
        ))}
      </Box>
    </Box>
  );
};

export default TableHeader;