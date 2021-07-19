import React from 'react';
import { Button, TextField, Grid, Typography } from '@material-ui/core';
import PropTypes from 'prop-types';
import { Formik, FieldArray } from 'formik';

const AvailableTickets = ({ value, ticketWinningNumbers, handleWinningFormSubmit, numberConfirmation }) => {
  return (
    <>
      <Formik
        initialValues={value}
        onSubmit={(values, onSubmitProps) => {
          values.tickets.forEach((ticket) => {
            const ticketPrice = ticket.price;
            ticketWinningNumbers[ticketPrice] = ticket.winningNumber;
          });
          handleWinningFormSubmit(ticketWinningNumbers);
          
          onSubmitProps.setSubmitting(false);
          onSubmitProps.resetForm();
        }}
      >
        {({ values, handleChange, handleSubmit, errors }) => (
          <form onSubmit={handleSubmit}>
            <FieldArray name="tickets">
              <Grid container spacing={3}>
                {values.tickets.map((ticket, index) => {
                  const label = `${ticket.price} Rs Ticket`;
                  const name = `tickets[${index}].winningNumber`;
                  return (
                    <Grid item xs={3} key={ticket.id}>
                      <TextField
                        label={label}
                        name={name}
                        value={ticket.winningNumber}
                        onChange={handleChange}
                        variant="outlined"
                        margin="dense"
                      />                        
                    </Grid>
                  );
                })}
              </Grid>
            </FieldArray>
            <div>
              <Button
                type="submit"
                color="primary"
                variant="contained"
                disabled={!numberConfirmation}
                style={{ marginTop: '30px' }}
              >
                Submit
              </Button>
            </div>
          </form>
        )}
      </Formik>
    </>
  );
};

AvailableTickets.propTypes = {
  value: PropTypes.object,
  ticketWinningNumbers: PropTypes.object,
  handleWinningFormSubmit: PropTypes.func,
  numberConfirmation: PropTypes.bool,
};

export default AvailableTickets;
