import React from 'react';
import PropTypes from 'prop-types';

import TextField from '@material-ui/core/TextField';

const Input = ({
  label,
  value,
  type,
  setState,
  variant,
  multiline,
  helperText,
  disabled,
  required,
  fullWidth,
  name,
  dynamic,
  margin,
  defaultValue
}) => {
  const handleChange = (e) => {
    if (dynamic) {
      value[name] = e.target.value;
      setState(value);
    } else {
      setState(e.target.value);
    }
  };
  return (
    <TextField
      label={label}
      value={dynamic ? value[name] : value}
      onChange={handleChange}
      type={type}
      variant={variant}
      multiline={multiline}
      helperText={helperText}
      disabled={disabled}
      required={required}
      fullWidth={fullWidth}
      margin={margin}
      defaultValue={defaultValue}
    />
  );
};

Input.propTypes = {
  label: PropTypes.string,
  value: PropTypes.any,
  type: PropTypes.string,
  variant: PropTypes.string,
  helperText: PropTypes.string,
  multiline: PropTypes.bool,
  setState: PropTypes.any,
  disabled: PropTypes.bool,
  required: PropTypes.bool,
  fullWidth: PropTypes.bool,
  name: PropTypes.string,
  dynamic: PropTypes.bool,
  margin: PropTypes.string,
  defaultValue: PropTypes.string
};

export default Input;
