import {
  KeyboardDatePicker,
  MuiPickersUtilsProvider,
} from "@material-ui/pickers";
import DateFnsUtils from "@date-io/date-fns";
import React from "react";
import { commonStyles } from "./styles";

const dateFns = require("date-fns");
const GridDateField = ({
  header,
  editingValue,
  setEditingValue,
  handleBlur,
}) => {
  const classes = commonStyles();
  return (
    <MuiPickersUtilsProvider utils={DateFnsUtils}>
      <KeyboardDatePicker
        className={classes.dateField}
        margin="dense"
        error={false}
        helperText={null}
        variant="inline"
        format="dd/MM/yyyy"
        inputVariant="outlined"
        value={dateFns.parse(editingValue, "dd/MM/yyyy", new Date())}
        onChange={(date) => {
          const dateValid = dateFns.isValid(date);
          if (dateValid) {
            const formattedDate = dateFns.format(date, "dd/MM/yyyy");
            setEditingValue(formattedDate);
          } else {
            setEditingValue("");
          }
        }}
        onClose={handleBlur}
        minDate={
          header.headerDateProperties && header.headerDateProperties.min
            ? dateFns.parse(
                header.headerDateProperties.min,
                "dd/MM/yyyy",
                new Date()
              )
            : undefined
        }
        maxDate={
          header.headerDateProperties && header.headerDateProperties.max
            ? dateFns.parse(
                header.headerDateProperties.max,
                "dd/MM/yyyy",
                new Date()
              )
            : undefined
        }
        inputProps={{ readOnly: true }}
      />
    </MuiPickersUtilsProvider>
  );
};

export default GridDateField;
