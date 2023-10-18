import {TextField} from "@material-ui/core";
import React from "react";

const GridTextField = ({header, editingValue, handleBlur, setEditingValue}) => {
  return (
    <TextField
      autoFocus
      margin="dense"
      style={{
        width: "90%",
      }}
      type={header.headerCellType === "number" ? "number" : "text"}
      variant="outlined"
      value={editingValue}
      onBlur={handleBlur}
      onChange={(e) => {
        header.headerCellType === "number"
          ? e.target.value.length > 0
          ? setEditingValue(parseInt(e.target.value, 10))
          : setEditingValue(null)
          : setEditingValue(e.target.value.toString());
      }}
    />
  );
};
export default GridTextField
