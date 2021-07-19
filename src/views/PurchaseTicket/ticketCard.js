import React from 'react';
import { Grid, Typography } from '@material-ui/core';
import PropTypes from 'prop-types';

import Input from '../../components/Input';

const TicketCard = ({ value, setState, ticketName, sellingPrice }) => {
  const label = `${ticketName} Rs Ticket`;
  return (
    <Grid item xs={3}>
      <Input
        label={label}
        value={value}
        setState={setState}
        variant="outlined"
        name={ticketName}
        fullWidth
        required
        dynamic
        margin="dense"
        defaultValue={sellingPrice}
        style={{ margin: 0 }}
      />
    </Grid>
  );
};

TicketCard.propTypes = {
  value: PropTypes.object,
  setState: PropTypes.any,
  ticketName: PropTypes.string,
  sellingPrice: PropTypes.string
};

export default TicketCard;
