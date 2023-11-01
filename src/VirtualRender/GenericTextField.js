import React, { useRef, useEffect, useState } from "react";
import {
  KeyboardDatePicker,
  MuiPickersUtilsProvider,
} from "@material-ui/pickers";
import DateFnsUtils from "@date-io/date-fns";
import { TextField, MenuItem } from "@material-ui/core";
import { commonStyles } from "../DataGrid/styles";
import Ajv from "ajv";

const ajv = new Ajv();
const dateFns = require("date-fns");
const GenericTextField = ({
  type,
  label,
  value,
  onChange,
  options,
  schema,
  validationKey,
}) => {
  const inputRef = useRef(value);
  const [selectedValue, setSelectedValue] = useState(null);
  const [isValid, setIsValid] = useState(true);
  const classes = commonStyles();

  useEffect(() => {
    if (type === "select" || type === "date") {
      setSelectedValue(value);
    } else {
      setValue(value);
    }
  }, []);

  const handleValidation = (val) => {
    let valueToValidate = {};
    if (type === "number") {
      if (val !== undefined) {
        valueToValidate = { [validationKey]: val };
      }
    } else if (type === "text") {
      if (val.length) {
        valueToValidate = { [validationKey]: val };
      }
    }
    const validate = ajv.compile(schema);
    // const valid = validate({ [validationKey]: val });
    const valid = validate(valueToValidate);
    setIsValid(valid);
  };

  const setValue = (newValue) => {
    if (inputRef.current) {
      inputRef.current.value = newValue;
    }
  };

  if (type === "select") {
    return (
      <TextField
        select
        placeholder={label}
        margin="dense"
        variant="outlined"
        error={!isValid}
        inputRef={inputRef}
        value={selectedValue}
        className={classes.textField}
        onChange={(e) => {
          console.log(typeof e.target.value);
          setValue(e.target.value);
          setSelectedValue(e.target.value);
          // con
          handleValidation(inputRef.current.value);
          onChange(inputRef.current.value, isValid);
        }}
      >
        {options.map((option) => (
          <MenuItem key={option.value} value={option.value}>
            {option.label}
          </MenuItem>
        ))}
      </TextField>
    );
  }

  if (type === "date") {
    return (
      <MuiPickersUtilsProvider utils={DateFnsUtils}>
        <KeyboardDatePicker
          className={classes.dateField}
          margin="dense"
          error={!isValid}
          helperText={null}
          ref={inputRef}
          variant="inline"
          format="dd/MM/yyyy"
          inputVariant="outlined"
          value={dateFns.parse(selectedValue, "dd/MM/yyyy", new Date())}
          onChange={(date) => {
            const dateValid = dateFns.isValid(date);
            if (dateValid) {
              const formattedDate = dateFns.format(date, "dd/MM/yyyy");
              setValue(formattedDate);
              setSelectedValue(formattedDate);
              handleValidation(inputRef.current.value);

              //setEditingValue(formattedDate);
            } else {
              setValue("");
              setSelectedValue("");
              handleValidation(inputRef.current.value);
              // setEditingValue("");
            }
          }}
          onClose={() => {
            // onChange(inputRef.current.value, isValid);
          }}
          // minDate={
          //   header.headerDateProperties && header.headerDateProperties.min
          //     ? dateFns.parse(
          //         header.headerDateProperties.min,
          //         "dd/MM/yyyy",
          //         new Date()
          //       )
          //     : undefined
          // }
          // maxDate={
          //   header.headerDateProperties && header.headerDateProperties.max
          //     ? dateFns.parse(
          //         header.headerDateProperties.max,
          //         "dd/MM/yyyy",
          //         new Date()
          //       )
          //     : undefined
          // }
          inputProps={{ readOnly: true }}
        />
      </MuiPickersUtilsProvider>
    );
  }

  return (
    <TextField
      autoFocus
      type={type}
      error={!isValid}
      placeholder={label}
      onChange={(e) => {
        setValue(e.target.value);
        handleValidation(e.target.value);
      }}
      onBlur={() => {
        onChange(inputRef.current.value, isValid);
      }}
      margin="dense"
      variant="outlined"
      inputRef={inputRef}
    />
  );
};

export default GenericTextField;
