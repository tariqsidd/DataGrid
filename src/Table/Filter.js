import React from "react";
import {
  Box,
  FormControl,
  IconButton,
  MenuItem,
  Select,
  TextField,
} from "@mui/material";
import ClearIcon from '@mui/icons-material/Clear';
import FilterListIcon from '@mui/icons-material/FilterList';
import InputAdornment from '@mui/material/InputAdornment';

import { DatePicker, LocalizationProvider, MobileDatePicker } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
const dateFns = require("date-fns");

export const Filter = ({
  type,
  value,
  onChange,
  options,
  label,
  handleDateChange,
}) => {
  const renderField = () => {
    switch (type) {
      case "textField":
        return (
          <TextField
            variant="outlined"
            value={value}
            onChange={onChange}
            size="small"
            fullWidth
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <FilterListIcon />
                </InputAdornment>
              ),
            }}
          />
        );
      case "numberField":
        return (
          <TextField
            variant="outlined"
            value={value}
            onChange={onChange}
            size="small"
            type="number"
            fullWidth
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <FilterListIcon />
                </InputAdornment>
              ),
            }}
          />
        );
      case "select":
        return (
          <FormControl variant="outlined" size="small" fullWidth>
            <Select
              displayEmpty
              value={value}
              onChange={onChange}
              renderValue={value !== "" ? undefined : () => null}
            >
              <MenuItem value="">
                <em>All</em>
              </MenuItem>
              {options.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        );
        case "dateSelect":
            const clearDate = () => handleDateChange(null, "date");

            return (
                <LocalizationProvider dateAdapter={AdapterDateFns}>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <MobileDatePicker
                            fullWidth
                            slotProps={{ textField: { size: 'small' } }}
                            format="dd/MM/yyyy"
                            value={value || null}
                            onChange={(date) => {
                                handleDateChange(date, "date");
                            }}
                        />
                        {value && (
                            <IconButton style={{position:'absolute', right:20}} onClick={clearDate} size="small">
                                <ClearIcon />
                            </IconButton>
                        )}
                    </Box>
                </LocalizationProvider>
            );



        default:
        return null;
    }
  };

  return renderField();
};
