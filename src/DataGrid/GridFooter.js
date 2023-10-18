import {TableCell, TableRow} from "@material-ui/core";
import IconButton from "@material-ui/core/IconButton";
import AddCircleOutlineIcon from "@material-ui/icons/AddCircleOutline";
import React from "react";

const GridFooter = ({tableOptions={}, tableHeaders=[], addRow=()=>{}}) => {
  return (
    <TableRow style={{ height: tableOptions.columnHeight }}>
      <TableCell
        style={{
          width: "30px",
          maxWidth: "30px",
          padding: "4px",
          fontSize: "0.75em",
          border: "1px solid #8080801a",
          backgroundColor: "#8080801a",
        }}
        align="center"
        onClick={addRow}>
        <IconButton
          style={{ padding: "0px" }}
        >
          <AddCircleOutlineIcon
            style={{ color: "#000000de", height: "25px" }}
          />
        </IconButton>
      </TableCell>
      {Array.from({ length: tableHeaders.length }, (_, index) => (
        <TableCell
          key={index} // Provide a unique key for each cell
          style={{
            padding: "4px",
            fontSize: "0.75em",
            border: "1px solid #8080801a",
            backgroundColor: "#8080801a",
            // width: "100%",
          }}
          align="center"
        />
      ))}
    </TableRow>
  );
};

export default GridFooter
