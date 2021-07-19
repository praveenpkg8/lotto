import React, { useEffect } from 'react';
import { Grid, Typography, TextField } from '@material-ui/core';
import PropTypes from 'prop-types';
import { v4 as uuidv4 } from 'uuid';

import Input from '../../components/Input';

const WinningNumberCard = ({ value, setState, ticketName, winningNumber }) => {
  return (
    <Grid container spacing={3}>
      <Grid item md={6} xs={12}>
        <Typography variant="h4" style={{ marginTop: '3%' }}>
          {ticketName}
        </Typography>
      </Grid>
      <Grid item md={6} xs={12}>
        <Input
          key={uuidv4()}
          label="Winning Number"
          value={value}
          setState={setState}
          variant="outlined"
          name={ticketName}
          fullWidth
          required
          dynamic
          margin="dense"
        />
      </Grid>
    </Grid>
  );
};

WinningNumberCard.propTypes = {
  value: PropTypes.object,
  setState: PropTypes.any,
  ticketName: PropTypes.string,
  winningNumber: PropTypes.any
};

export default WinningNumberCard;
