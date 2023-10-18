import {KeyboardDatePicker, MuiPickersUtilsProvider} from "@material-ui/pickers";
import DateFnsUtils from "@date-io/date-fns";
import React from "react";
const dateFns = require("date-fns");
const GridDateField = ({header, editingValue, setEditingValue, handleBlur}) => {
  return (
    <MuiPickersUtilsProvider utils={DateFnsUtils}>
      <KeyboardDatePicker
        margin="dense"
        style={{
          width: "90%",
        }}
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
        inputProps={{readOnly: true}}
      />
    </MuiPickersUtilsProvider>
  );
};

export default GridDateField
