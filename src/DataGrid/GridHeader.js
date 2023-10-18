import {TableCell, TableHead, TableRow} from "@material-ui/core";
import React from "react";

const GridHeader = ({tableOptions={}, tableHeaders=[]}) => {
  return (
    <TableHead>
      <TableRow style={{ height: tableOptions.columnHeight }}>
        <TableCell
          style={{
            width: "30px",
            maxWidth: "30px",
            padding: "4px", // Reduced padding
            fontSize: "0.75em", // Reduced font size if needed
            border: "1px solid #8080801a",
            backgroundColor: "#8080801a",
          }}
          align="center">
          #
        </TableCell>
        {tableHeaders.map((header) => (
          <TableCell
            style={{
              width: "30px",
              maxWidth: "30px",
              padding: "4px", // Reduced padding
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
export default GridHeader
