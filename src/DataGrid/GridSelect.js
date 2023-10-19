import { MenuItem, TextField } from "@material-ui/core";
import React from "react";
import { commonStyles } from "./styles";

const GridSelect = ({ header, editingValue, handleBlur, setEditingValue }) => {
  const classes = commonStyles();
  return (
    <TextField
      select
      className={classes.selectField}
      margin="dense"
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

export default GridSelect;
