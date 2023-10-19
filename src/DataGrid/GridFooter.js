import React from "react";
import { TableCell, TableRow, IconButton } from "@material-ui/core";
import AddCircleOutlineIcon from "@material-ui/icons/AddCircleOutline";
import { commonStyles } from "./styles";

const GridFooter = ({
  tableOptions = {},
  tableHeaders = [],
  addRow = () => {},
}) => {
  const classes = commonStyles();

  return (
    <TableRow style={{ height: tableOptions.columnHeight }}>
      <TableCell
        className={classes.highlightedSmallCell}
        align="center"
        onClick={addRow}
      >
        <IconButton style={{ padding: "0px" }}>
          <AddCircleOutlineIcon className={classes.footerAddIcon} />
        </IconButton>
      </TableCell>
      {Array.from({ length: tableHeaders.length }, (_, index) => (
        <TableCell
          key={index}
          className={classes.highlightedCell}
          align="center"
        />
      ))}
    </TableRow>
  );
};

export default GridFooter;
