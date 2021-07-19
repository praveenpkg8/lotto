import React from 'react';
import PropTypes from 'prop-types';

import TextField from '@material-ui/core/TextField';
import MenuItem from '@material-ui/core/MenuItem';

const Input = ({
  label,
  value,
  setState,
  variant,
  disabled,
  helperText,
  options,
  fullWidth,
  required
}) => {
  const handleChange = (e) => {
    setState(e.target.value);
  };
  return (
    <TextField
      label={label}
      value={value}
      onChange={handleChange}
      variant={variant}
      disabled={disabled}
      helperText={helperText}
      required={required}
      fullWidth={fullWidth}
      select
    >
      {options.map((option) => (
        <MenuItem key={option.value} value={option.value}>
          {option.label}
        </MenuItem>
      ))}
    </TextField>
  );
};

Input.propTypes = {
  label: PropTypes.string,
  value: PropTypes.any,
  variant: PropTypes.string,
  setState: PropTypes.any,
  disabled: PropTypes.bool,
  helperText: PropTypes.string,
  options: PropTypes.array,
  required: PropTypes.bool,
  fullWidth: PropTypes.bool
};

export default Input;
