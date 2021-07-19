import React from 'react';
import PropTypes from 'prop-types';
import { Formik, Form, FieldArray, getIn } from 'formik';
import { TextField, Button, IconButton, Card } from '@material-ui/core';
import { Delete } from '@material-ui/icons';
import { v4 as uuidv4 } from 'uuid';
import * as Yup from 'yup';

const validationSchema = (validation) => Yup.object().shape({
  tickets: Yup.array().of(
    Yup.object().shape({
      id: Yup.string().required('Unique key is a must'),
      ticketNumber: Yup.string()
        .required()
        .min(validation.maxTicketNumber)
        .max(validation.maxTicketNumber),
      ticketQty: Yup.string()
        .required()
        // .test('Is positive?', 'ERROR: The number must be greater than 0!', (value) => value > 0)
        .min(1)
    })
  )
});

const DynamicForm = ({ value, setValue, verification, ticketDetails, handleSubmit }) => {
  const maxTicketNumber = ticketDetails.board ? ticketDetails.board.length : '';
  return (
    <div>
      <Formik
        initialValues={value}
        onSubmit={(values) => {
          setValue(values);
          handleSubmit(values);
        }}
        validationSchema={() => validationSchema({ maxTicketNumber })}
      >
        {({ values, handleChange, errors }) => (
          <Form>
            <Card
              style={{
                maxHeight: '625px',
                overflowY: 'scroll',
                padding: '10px'
              }}
            >
              <FieldArray name="tickets">
                {({ push, remove }) => (
                  <div
                    onKeyPress={(target) => {
                      if (target.charCode === 13) {
                        push({ id: uuidv4(), ticketNumber: '', ticketQty: 1 });
                      }
                    }}
                  >
                    {values.tickets.map((ticket, index) => {
                      const name = `tickets[${index}].ticketNumber`;
                      const qty = `tickets[${index}].ticketQty`;
                      const errorMessage = getIn(errors, name)
                        ? `Ticket number must be a max of ${maxTicketNumber}`
                        : '';
                      const errorMessages = getIn(errors, qty)
                        ? 'Ticket number must be a max of 5'
                        : '';
                      return (
                        <div
                          key={ticket.id}
                          style={{ display: 'flex', alignItems: 'center' }}
                        >
                          <TextField
                            label="Ticket Number"
                            name={name}
                            value={ticket.ticketNumber}
                            onChange={handleChange}
                            helperText={errorMessage}
                            error={Boolean(errorMessage)}
                            variant="outlined"
                            margin="dense"
                          />
                          <TextField
                            style={{ width: '100px', marginLeft: '10%' }}
                            label="Quantity"
                            name={qty}
                            value={ticket.ticketQty}
                            onChange={handleChange}
                            helperText={errorMessages}
                            error={Boolean(errorMessages)}
                            variant="outlined"
                            margin="dense"
                          />
                          <IconButton onClick={() => remove(index)}>
                            <Delete />
                          </IconButton>
                        </div>
                      );
                    })}
                  </div>
                )}
              </FieldArray>
            </Card>
            <div>
              <Button
                type="submit"
                color="primary"
                variant="contained"
                disabled={!verification}
                style={{ float: 'left', marginTop: '10px' }}
              >
                Submit
              </Button>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
};

DynamicForm.propTypes = {
  value: PropTypes.object,
  verification: PropTypes.bool,
  setValue: PropTypes.func,
  ticketDetails: PropTypes.object,
  handleSubmit: PropTypes.func,
};

export default DynamicForm;
