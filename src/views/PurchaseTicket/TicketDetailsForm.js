import React, { useContext, useEffect, useState, useRef } from 'react';
import PropTypes from 'prop-types';
import * as Yup from 'yup';
import { Formik, FieldArray, getIn, ErrorMessage } from 'formik';
import { v4 as uuidv4 } from 'uuid';
import axios from 'axios';
import {
  Container,
  TextField,
  Grid,
  Button,
  Card,
  CardHeader,
  CardContent,
  MenuItem,
  Typography,
  Link,
  IconButton,
  Box,
  Divider
} from '@material-ui/core';
import { Delete } from '@material-ui/icons';

import { makeStyles } from '@material-ui/core/styles';
import Modal from '@material-ui/core/Modal';
import Backdrop from '@material-ui/core/Backdrop';
import Fade from '@material-ui/core/Fade';
import {
  PlusSquare,
} from 'react-feather';

import { TicketContext } from 'src/contextApi/TicketContext';
import { UserContext } from 'src/contextApi/UserContext';
import DataTable from '../../components/DataTable';

import Snackbar from '../../components/NotifyBar';
import TicketCard from './ticketCard';
import AvailableTickets from '../WinningNumber/AvailableTickets';

const useStyles = makeStyles((theme) => ({
  modal: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  paper: {
    backgroundColor: theme.palette.background.paper,
    border: '2px solid #000',
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
    maxWidth: '700px',
    maxHeight: '500px',
    overflow: 'auto'
  },
}));

const TicketDetailsForm = ({ value, setValue, handleTicketFormSubmit }) => {
  const token = localStorage.getItem('token');
  const formikRef = useRef();

  const classes = useStyles();
  const [open, setOpen] = React.useState(false);
  const [ticketSettingsList, setTicketSettingsList] = useState({ tickets: [] });
  const [ticketWinningNumbers, setTicketWinningNumbers] = useState({});
  const [snackBarState, setSnackBarState] = useState(false);
  const [snackBarMessage, setSnackBarMessage] = useState('');
  const [severity, setSeverity] = useState('');

  const [ticketList] = useContext(TicketContext);
  const [userList] = useContext(UserContext);

  const tableColumn = [
    { id: 'customer', label: 'Customer Name', minWidth: 150 },
    { id: 'ticketPrice', label: 'Ticket Price', minWidth: 100 },
    { id: 'ticketNumber', label: 'Ticket Number', minWidth: 170 },
    {
      id: 'count',
      label: 'Count',
      align: 'center'
    }
  ];
  const [tableData, setTableData] = useState([]);
  const [boardList, setBoardList] = useState([]);
  const [selectedUser, setSelectedUser] = useState('');
  const [selectedTicket, setSelectedTicket] = useState('');
  const [selectedBoard, setSelectedBoard] = useState('');

  useEffect(() => {
    axios
      .get(`${process.env.REACT_APP_API}/purchaseticket/ticketchancecount`, {
        headers: { 'Bearer-Token': token }
      })
      .then((response) => {
        const obj = response.data;
        setTableData(obj.data);
      })
      .catch((err) => {
        console.log(err.response);
      });
  }, []);

  useEffect(() => {
    if (selectedTicket) {
      axios.post(
        `${process.env.REACT_APP_API}/findticketsettings`,
        {
          user: selectedUser,
          ticketname: selectedTicket
        },
        { headers: { 'Bearer-Token': token } }
      )
        .then((response) => {
          const { message } = response.data;
          formikRef.current.setFieldValue(
            'sellingprice',
            message
          );
        })
        .catch((error) => {
          console.log(error.response);
        });
    }
  }, [selectedUser, selectedTicket]);

  function findArrayElementByPrice(array, price) {
    return array.find((element) => {
      return element.price === price;
    });
  }

  const handleOpen = () => {
    setOpen(true);
    axios.get(`${process.env.REACT_APP_API}/userticketsettings?user=`, {
      headers: { 'Bearer-Token': token }
    })
      .then((response) => {
        const { message } = response.data;
        setTicketSettingsList(message);
      })
      .catch((err) => {
        console.log(err.response);
      });
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleTicketChange = (e, setFieldValue) => {
    const board = findArrayElementByPrice(ticketList, e.target.value);
    const ticketBoard = board.ticketBoard.split(',');
    setBoardList(ticketBoard);
    setSelectedTicket(board.ticketName);
    setFieldValue(e.target.name, e.target.value);
  };

  const handleBoardChange = (e, setFieldValue, values, setValues) => {
    const tickets = [...values.tickets];
    tickets[0].ticketDiasbled = false;

    setValues({ ...values, tickets });
    setSelectedBoard(e.target.value);
    setFieldValue(e.target.name, e.target.value);
  };

  const handleUserChange = (e, setFieldValue) => {
    setSelectedUser(e.target.value);
    setFieldValue(e.target.name, e.target.value);
  };

  const handleNewUserCreate = (formData) => {
    axios.post(
      `${process.env.REACT_APP_API}/updateticketsettings`,
      {
        newuser: formData.newuser,
        user: formData.newuser,
        sellingPrices: ticketWinningNumbers
      },
      { headers: { 'Bearer-Token': token } }
    )
      .then(() => {
        window.location.reload();
      })
      .catch((error) => {
        const { response } = error;
        console.log(response);
      });
    setTicketWinningNumbers({});
  };

  function handleTicketNumber(e, values, setValues) {
    if (e.charCode === 13 && Object.keys(formikRef.current.errors).length === 0) {
      const tickets = [...values.tickets];
      tickets.push({ id: uuidv4(), ticketNumber: '', ticketQty: 1 });
      setValues({ ...values, tickets });
    }
  }

  return (
    <>
      <Card>
        <CardHeader title="Purchase Ticket" />
        <Divider />
        <Formik
          innerRef={formikRef}
          initialValues={value}
          validationSchema={Yup.object().shape({
            newuser: Yup.string().max(255),
            user: Yup.string().required(),
            ticket: Yup.string().required(),
            board: Yup.string().required(),
            sellingprice: Yup.string().required(),
            tickets: Yup.array().of(
              Yup.object().shape({
                id: Yup.string().required('Unique key is a must'),
                ticketNumber: Yup.string()
                  .required('Ticket number is required')
                  .when('board', (board) => {
                    const boardLength = selectedBoard.length;
                    if (selectedBoard && boardLength > 0) {
                      const minErr = `Min, ${boardLength} chars`;
                      const maxErr = `Max, ${boardLength} chars`;
                      return Yup.string().required('Ticket number is required').min(boardLength, minErr).max(boardLength, maxErr);
                    }
                  }),
                ticketQty: Yup.string()
                  .required('Ticket quantity is required')
                  .min(1, 'Min 1 chars')
              })
            )
          })}
          onSubmit={(values, onSubmitProps) => {
            setValue(values);
            handleTicketFormSubmit(values);

            onSubmitProps.setSubmitting(false);
            onSubmitProps.resetForm();
          }}
        >
          {({
            errors,
            handleBlur,
            handleChange,
            handleSubmit,
            touched,
            values,
            setFieldValue,
            setValues
          }) => (
            <form onSubmit={handleSubmit}>
              <Grid container spacing={2} style={{ padding: '10px' }}>
                <Grid item>
                  <TextField
                    style={{ width: '170px' }}
                    error={Boolean(touched.user && errors.user)}
                    helperText={touched.user && errors.user}
                    label="User"
                    name="user"
                    margin="dense"
                    onBlur={handleBlur}
                    value={values.user}
                    onChange={(e) => handleUserChange((e), setFieldValue)}
                    variant="outlined"
                    fullWidth
                    select
                  >
                    {userList.map((user) => (
                      <MenuItem key={uuidv4()} value={user.customerName}>
                        {user.customerName}
                      </MenuItem>
                    ))}
                  </TextField>
                </Grid>
                <Grid item>
                  <Typography
                    style={{
                      marginTop: '15px',
                      paddingRight: '5px',
                      paddingLeft: '5px'
                    }}
                  >
                    <Link onClick={handleOpen} title="Add new user">
                      <PlusSquare />
                    </Link>
                  </Typography>
                </Grid>
                <Grid item>
                  <TextField
                    style={{ width: '170px' }}
                    error={Boolean(touched.ticket && errors.ticket)}
                    helperText={touched.ticket && errors.ticket}
                    label="Ticket"
                    name="ticket"
                    margin="dense"
                    onBlur={handleBlur}
                    value={values.ticket}
                    onChange={(e) => handleTicketChange((e), setFieldValue)}
                    variant="outlined"
                    select
                  >
                    {ticketList.map((ticket) => (
                      <MenuItem key={uuidv4()} value={ticket.price}>
                        {`${ticket.ticketName}-${ticket.price}`}
                      </MenuItem>
                    ))}
                  </TextField>
                </Grid>
                <Grid item>
                  <TextField
                    style={{ width: '170px' }}
                    error={Boolean(touched.board && errors.board)}
                    helperText={touched.board && errors.board}
                    label="Board"
                    name="board"
                    margin="dense"
                    onBlur={handleBlur}
                    value={values.board}
                    onChange={(e) => handleBoardChange((e), setFieldValue, values, setValues)}
                    variant="outlined"
                    select
                  >
                    {boardList.length === 0 &&
                      <MenuItem value="">Select board</MenuItem>}
                    {boardList.length > 0 && boardList.map((board) => (
                      <MenuItem key={uuidv4()} value={board}>
                        {board}
                      </MenuItem>
                    ))}
                  </TextField>
                </Grid>
                <Grid item>
                  <TextField
                    style={{ width: '200px' }}
                    error={Boolean(touched.sellingprice && errors.sellingprice)}
                    fullWidth
                    helperText={touched.sellingprice && errors.sellingprice}
                    label="Selling Price"
                    margin="dense"
                    name="sellingprice"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    value={values.sellingprice}
                    variant="outlined"
                  />
                </Grid>
                <FieldArray name="tickets">
                  {({ push, remove }) => (
                    <div>
                      {values.tickets.map((ticket, index) => {
                        const ticketNameError = getIn(errors, `tickets[${index}].ticketNumber`);
                        const ticketNameTouch = getIn(touched, `tickets[${index}].ticketNumber`);
                        return (
                          <div
                            key={ticket.id}
                            style={{ display: 'flex', alignItems: 'center', padding: '10px' }}
                          >
                            <TextField
                              label="Ticket Number"
                              name={`tickets[${index}].ticketNumber`}
                              value={ticket.ticketNumber}
                              onChange={handleChange}
                              onBlur={handleBlur}
                              helperText={ticketNameTouch && ticketNameError}
                              error={Boolean(ticketNameTouch && ticketNameError)}
                              variant="outlined"
                              margin="dense"
                              onKeyPress={(e) => handleTicketNumber(e, values, setValues)}
                              disabled={ticket.ticketDiasbled}
                              autoFocus
                            />
                            <TextField
                              style={{ width: '200px', marginLeft: '2%' }}
                              label="Quantity"
                              name={`tickets[${index}].ticketQty`}
                              value={ticket.ticketQty}
                              onChange={handleChange}
                              onBlur={handleBlur}
                              helperText={
                                getIn(errors, `tickets[${index}].ticketQty`)
                              }
                              error={
                                Boolean(getIn(errors, `tickets[${index}].ticketQty`))
                              }
                              variant="outlined"
                              margin="dense"
                              onKeyPress={(e) => handleTicketNumber(e, values, setValues)}
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
                <Grid container style={{ padding: '10px' }}>
                  <Button
                    color="primary"
                    type="submit"
                    variant="contained"
                  >
                    Submit
                  </Button>
                </Grid>
              </Grid>
            </form>
          )}
        </Formik>
        <Modal
          aria-labelledby="transition-modal-title"
          aria-describedby="transition-modal-description"
          className={classes.modal}
          open={open}
          onClose={handleClose}
          closeAfterTransition
          disableBackdropClick
          BackdropComponent={Backdrop}
          BackdropProps={{
            timeout: 500,
          }}
        >
          <Fade in={open}>
            <div className={classes.paper}>
              <h2 id="transition-modal-title">Add New User</h2>
              <Divider style={{ marginTop: '10px', marginBottom: '10px' }} />
              <Snackbar
                snackBarState={snackBarState}
                setState={setSnackBarState}
                message={snackBarMessage}
                severity={severity}
              />
              <Formik
                initialValues={value}
                validationSchema={Yup.object().shape({
                  newuser: Yup.string().required(),
                })}
                onSubmit={(values, onSubmitProps) => {
                  handleNewUserCreate(values);

                  onSubmitProps.setSubmitting(false);
                  onSubmitProps.resetForm();
                }}
              >
                {({
                  errors,
                  handleBlur,
                  handleChange,
                  handleSubmit,
                  touched,
                  values,
                }) => (
                  <form onSubmit={handleSubmit}>
                    <Grid container>
                      <Grid item>
                        <TextField
                          error={Boolean(touched.newuser && errors.newuser)}
                          fullWidth
                          helperText={touched.newuser && errors.newuser}
                          label="New User"
                          name="newuser"
                          onBlur={handleBlur}
                          onChange={handleChange}
                          value={values.newuser}
                          variant="outlined"
                          margin="dense"
                          style={{ marginBottom: '20px' }}
                        />
                      </Grid>
                      <Grid container spacing={3}>
                        { ticketSettingsList.length > 0 && ticketSettingsList.map((ticket, index) => {
                          return (
                            <TicketCard
                              key={index}
                              setState={setTicketWinningNumbers}
                              value={ticketWinningNumbers}
                              ticketName={ticket.price}
                              sellingPrice={ticket.sellingPrice}
                              index={index}
                            />
                          );
                        })}
                      </Grid>
                      <Box mt={2}>
                        <Grid item>
                          <Button
                            color="primary"
                            type="submit"
                            variant="contained"
                          >
                            Confirm
                          </Button>
                        </Grid>
                      </Box>
                    </Grid>
                  </form>
                )}
              </Formik>
            </div>
          </Fade>
        </Modal>
      </Card>

      <Box mt={2}>
        <Card>
          <DataTable columns={tableColumn} rows={tableData} />
        </Card>
      </Box>
    </>
  );
};

TicketDetailsForm.propTypes = {
  value: PropTypes.object,
  setValue: PropTypes.func,
  handleTicketFormSubmit: PropTypes.func,
};

export default TicketDetailsForm;
