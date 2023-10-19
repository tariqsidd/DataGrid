import { TextField } from "@material-ui/core";
import React from "react";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
  textField: {
    width: "90%",
  },
}));

const GridTextField = ({
  header,
  editingValue,
  handleBlur,
  setEditingValue,
}) => {
  const classes = useStyles();
  return (
    <TextField
      autoFocus
      className={classes.textField}
      margin="dense"
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
export default GridTextField;
