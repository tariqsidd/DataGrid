import {MenuItem, TextField} from "@material-ui/core";
import React from "react";

const GridSelect = ({header, editingValue, handleBlur, setEditingValue}) => {
  return (
    <TextField
      select
      margin="dense"
      style={{
        width: "90%",
      }}
      value={editingValue}
      onBlur={handleBlur}
      onChange={(e) => {
        setEditingValue(e.target.value);
      }}
      variant="outlined"
    >
      {header.headerOptions.map((option) => (
        <MenuItem key={option.value} value={option.value}>
          {option.label}
        </MenuItem>
      ))}
    </TextField>
  );
};

export default GridSelect
