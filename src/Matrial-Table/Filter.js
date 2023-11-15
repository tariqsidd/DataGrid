import React from 'react';
import { TextField, MenuItem, Select, FormControl } from '@material-ui/core';
import {KeyboardDatePicker, MuiPickersUtilsProvider,} from "@material-ui/pickers";
import DateFnsUtils from "@date-io/date-fns";
const Filter = ({ type, value, onChange, options, label }) => {
  const renderField = () => {
    switch (type) {
      case 'textField':
        return <TextField value={value} onChange={onChange} size="small" fullWidth />;
      case 'numberField':
        return <TextField value={value} onChange={onChange} size="small" type="number" fullWidth />;
      case 'select':
        return (
          <FormControl size="small" fullWidth>
            <Select value={value} onChange={onChange}>
              {options.map(option => (
                <MenuItem key={option.value} value={option.value}>{option.label}</MenuItem>
              ))}
            </Select>
          </FormControl>
        );
      case 'dateSelect':
        return (
          <MuiPickersUtilsProvider utils={DateFnsUtils}>
          <KeyboardDatePicker
            fullWidth
            format="MM/dd/yyyy"
            value={value}
            onChange={onChange}
          />
          </MuiPickersUtilsProvider>
        );
      default:
        return null;
    }
  };

  return renderField();
};

export default Filter;
