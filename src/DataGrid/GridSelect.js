import { MenuItem, TextField } from "@material-ui/core";
import React from "react";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
  selectField: {
    width: "90%",
  },
}));

const GridSelect = ({ header, editingValue, handleBlur, setEditingValue }) => {
  const classes = useStyles();
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
