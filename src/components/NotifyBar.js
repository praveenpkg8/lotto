import React from 'react';
import { v4 as uuidv4 } from 'uuid';
import Alert from '@material-ui/lab/Alert';
import PropTypes from 'prop-types';
import MdClose from '@material-ui/icons/Close';
import { Snackbar, IconButton } from '@material-ui/core';

const NotifyBar = ({ snackBarState, setState, message, severity }) => {
  return (
    <Snackbar
      anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      open={snackBarState}
      autoHideDuration={3500}
      onClose={() => {
        setState(false);
      }}
      key={uuidv4()}
      action={
        <>
          <IconButton
            size="small"
            aria-label="close"
            color="inherit"
            onClick={() => {
              setState(false);
            }}
          >
            <MdClose />
          </IconButton>
        </>
      }
    >
      <Alert
        onClose={() => {
          setState(false);
        }}
        severity={severity}
        elevation={6}
        variant="filled"
      >
        {message}
      </Alert>
    </Snackbar>
  );
};

NotifyBar.propTypes = {
  snackBarState: PropTypes.bool,
  setState: PropTypes.any,
  message: PropTypes.string,
  severity: PropTypes.string
};

export default NotifyBar;
