import React, { useRef, useEffect, useState } from "react";
import {
  KeyboardDatePicker,
  MuiPickersUtilsProvider,
} from "@material-ui/pickers";
import DateFnsUtils from "@date-io/date-fns";
import { TextField, MenuItem } from "@material-ui/core";
import { commonStyles } from "../DataGrid/styles";
import { getColumnOrder } from "./utils";
import Ajv from "ajv";

const ajv = new Ajv();
const dateFns = require("date-fns");
const GenericTextField = ({
  errorObj,
  type,
  isError,
  label,
  value,
  onChange,
  options,
  schema,
  validationKey,
}) => {
  const inputRef = useRef(value);
  const datePickerRef = useRef(value);
  const [selectedValue, setSelectedValue] = useState(null);
  const [error, setError] = useState(errorObj);
  const [isValid, setIsValid] = useState(isError);
  const classes = commonStyles();

  useEffect(() => {
    switch (type) {
      case "text":
        setValue(value);
        break;
      case "number":
        setValue(value);
        break;
      case "select":
        setSelectedValue(value);
        break;
      case "date":
        setDate(value);
        break;
      default:
        setValue(value);
    }
  }, []);

  const handleValidation = (val) => {
    let errors = JSON.parse(JSON.stringify(errorObj));
    if (errors.hasOwnProperty(validationKey)) {
      delete errors[validationKey];
    }
    let valueToValidate = {};
    if (type === "number") {
      if (val !== null) {
        valueToValidate = { [validationKey]: val };
      }
    } else if (type === "select") {
      const validOptions = options.map((option) => option.value);
      let valid = validOptions.includes(val);
      if (!valid) {
        let error = `"${val}" is not a valid selection. Please choose from the available options in the dropdown`;
        errors[validationKey] = error;
      }
      if (val.length > 0) {
        valueToValidate = { [validationKey]: val };
      }
    } else {
      if (val.length > 0) {
        valueToValidate = { [validationKey]: val };
      }
    }
    let valid;
    if (schema) {
      const validate = ajv.compile(schema);
      valid = validate(valueToValidate);
      setIsValid(valid);
      if (!valid) {
        errors[validationKey] = validate.errors[0].message;
      }
    }
    //Sorting Error
    errors = Object.fromEntries(
      getColumnOrder()
        .filter((key) => errors.hasOwnProperty(key))
        .map((key) => [key, errors[key]])
    );
    setError(errors);
    return { errors, valid };
  };

  const setValue = (newValue) => {
    if (inputRef.current) {
      inputRef.current.value = newValue;
    }
  };

  const setDate = (date) => {
    if (datePickerRef.current) {
      datePickerRef.current = date;
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
          setValue(e.target.value);
          setSelectedValue(e.target.value);
          let { errors, valid } = handleValidation(inputRef.current.value);
          onChange(inputRef.current.value, valid, errors);
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
          inputRef={datePickerRef}
          variant="inline"
          format="dd/MM/yyyy"
          inputVariant="outlined"
          value={dateFns.parse(datePickerRef.current, "dd/MM/yyyy", new Date())}
          onChange={(date) => {
            const dateValid = dateFns.isValid(date);
            if (dateValid) {
              const formattedDate = dateFns.format(date, "dd/MM/yyyy");
              setDate(formattedDate);
              onChange(formattedDate, true, error);
            } else {
              setDate("");
              onChange("", true, error);
            }
          }}
          onClose={() => {
            // onChange(inputRef.current.value, isValid);
          }}
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
        if (type === "number") {
          if (e.target.value.length > 0) {
            setValue(parseInt(e.target.value, 10));
            handleValidation(parseInt(e.target.value, 10));
          } else {
            setValue(null);
            handleValidation(null);
          }
        } else {
          setValue(e.target.value);
          handleValidation(e.target.value);
        }
      }}
      onBlur={() => {
        onChange(inputRef.current.value, isValid, error);
      }}
      margin="dense"
      variant="outlined"
      inputRef={inputRef}
    />
  );
};

export default GenericTextField;
