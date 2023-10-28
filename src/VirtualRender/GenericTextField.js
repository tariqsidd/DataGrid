import React,{useRef, useEffect, useState} from 'react';
import { TextField, MenuItem } from "@material-ui/core";
import {commonStyles} from "../DataGrid/styles";

const GenericTextField = ({ type, label, value, onChange, options }) => {
  const inputRef = useRef(value);
  const [selectedValue, setSelectedValue] = useState(null);
  const classes = commonStyles();

  useEffect(()=>{
    if(type === 'select'){
      setSelectedValue(value)
    }
    else {
      setValue(value)
    }
  },[]);

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
        inputRef={inputRef}
        value={selectedValue}
        className={classes.textField}
        onChange={(e)=>{
          setValue(e.target.value);
          setSelectedValue(e.target.value)
          onChange(inputRef.current.value)
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
      placeholder={label}
      onChange={(e)=>{
        setValue(e.target.value);
      }}
      onBlur={()=>{
        onChange(inputRef.current.value)
      }}
      margin="dense"
      variant="outlined"
      inputRef={inputRef}
    />
  );
};

export default GenericTextField;
