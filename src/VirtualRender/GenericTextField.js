import React,{useRef, useEffect, useState} from 'react';
import { TextField, MenuItem } from "@material-ui/core";
import {commonStyles} from "../DataGrid/styles";
import Ajv from 'ajv';

const ajv = new Ajv();
const GenericTextField = ({ type, label, value, onChange, options, schema, validationKey }) => {
  const inputRef = useRef(value);
  const [selectedValue, setSelectedValue] = useState(null);
  const [isValid, setIsValid] = useState(true);
  const classes = commonStyles();

  useEffect(()=>{
    if(type === 'select'){
      setSelectedValue(value)
    }
    else {
      setValue(value)
    }
  },[]);

  const handleValidation = (val) => {
    const validate = ajv.compile(schema);
    const valid = validate({ [validationKey]: val });
    setIsValid(valid);
  };

  const setValue = (newValue) => {
    if (inputRef.current) {
      inputRef.current.value = newValue;
    }
  };

  if (type === 'select') {
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
        onChange={(e)=>{
          setValue(e.target.value);
          setSelectedValue(e.target.value);
          handleValidation(inputRef.current.value);
          onChange(inputRef.current.value, isValid);
        }}>
        {options.map((option) => (
          <MenuItem key={option.value} value={option.value}>
            {option.label}
          </MenuItem>
        ))}
      </TextField>
    );
  }

  return (
    <TextField
      autoFocus
      type={type}
      error={!isValid}
      placeholder={label}
      onChange={(e)=>{
        setValue(e.target.value);
        handleValidation(e.target.value);
      }}
      onBlur={()=>{
        onChange(inputRef.current.value, isValid)
      }}
      margin="dense"
      variant="outlined"
      inputRef={inputRef}
    />
  );
};

export default GenericTextField;
