import React, { useState, useContext, useEffect } from 'react';
import PropTypes from 'prop-types';
import {
  Button,
  Card,
  CardContent,
  CardHeader,
  Divider,
  Grid,
  makeStyles,
  TextField,
  Typography,
  Box,
  Paper
} from '@material-ui/core';
import axios from 'axios';
import moment from 'moment';
import Snackbar from '../../components/NotifyBar';

import { TicketContext } from 'src/contextApi/TicketContext';

import Input from '../../components/Input';
import AvailableTickets from './AvailableTickets';

const WinningNumber = ({ className, ...rest }) => {
  const ticketWinningNumbers = {};
  const [ticketList] = useContext(TicketContext);
  const [ticketsData, setTicketsData] = useState({ tickets: [] });
  const [date, setDate] = useState(moment().format('YYYY/MM/DD'));
  const [winningNumber, setWinningNumber] = useState('');

  const [winningNumberConfirm, setWinningNumberConfirm] = useState(false);
  const [snackBarState, setSnackBarState] = useState(false);
  const [snackBarMessage, setSnackBarMessage] = useState('');
  const [severity, setSeverity] = useState('');
  const token = localStorage.getItem('token');

  useEffect(() => {
    ticketList.forEach((ticket) => {
      const newArr = {...ticketsData};
      ticket.winningNumber = '';
      newArr.tickets.push(ticket);
      setTicketsData(newArr);
    });
  }, [ticketList]);

  const handleSubmit = () => {
    axios.post(
      `${process.env.REACT_APP_API}/winningnumber`,
      {
        date: date,
        ticketWinningNumbers: ticketWinningNumbers
      },
      { headers: { 'Bearer-Token': token } }
    )
      .then(() => {
        setSnackBarState(true);
        setSeverity('success');
        setSnackBarMessage('Winning numbers added successfully');
      })
      .catch((error) => {
        const { response } = error;
        console.log(response);
        if (response.data.message === 'SequelizeUniqueConstraintError') {
          setSnackBarMessage('Winning numbers for today already added.');
          setSeverity('error');
          setSnackBarState(true);
        }
      });

    ticketWinningNumbers({});
    setDate('');
    setWinningNumber('');
  };

  const handleWinningNumberChange = (e) => {
    setWinningNumber(e.target.value);
  };

  const handlePopulateWinningNumber = () => {
    for (let i = 0; i < ticketsData.tickets.length; i++) {
      const ticket = ticketsData.tickets[i];
      const ticketBoard = ticket.ticketBoard.split(',');

      const newArr = {...ticketsData};
      newArr.tickets[i].winningNumber = winningNumber.slice(winningNumber.length - ticketBoard.length);
      setTicketsData(newArr);
    }
    setWinningNumberConfirm(true);
  };

  return (
    <>
      <Snackbar
        snackBarState={snackBarState}
        setState={setSnackBarState}
        message={snackBarMessage}
        severity={severity}
      />
      <Card>
        <CardHeader title="Winning Number" />
        <Divider />
        <CardContent>
          <Grid container spacing={3}>
            <Grid item md={2} xs={12}>
              <Input
                label="Date"
                setState={setDate}
                disabled
                type="text"
                value={date}
              />
            </Grid>
            <Grid item md={4} xs={12}>
              <TextField
                label="Winning Number"
                value={winningNumber}
                onChange={handleWinningNumberChange}
                variant="outlined"
                margin="dense"
                fullWidth
              />
            </Grid>
            <Grid item md={3} xs={12}>
              <Box mt={1}>
                <Button variant="contained" color="primary" onClick={handlePopulateWinningNumber}>Populate</Button>
              </Box>
            </Grid>
          </Grid>
          <Box mt={4}>
            <Typography variant="h4" component="h4">
              Available Tickets
            </Typography>
            <br />
            {ticketsData.tickets.length > 0 &&
              <AvailableTickets
                value={ticketsData}
                ticketWinningNumbers={ticketWinningNumbers}
                handleWinningFormSubmit={handleSubmit}
                numberConfirmation={winningNumberConfirm}
              />
            }
          </Box>
        </CardContent>
        <Divider />
      </Card>
      <br />
      {/* <Card>
        <CardHeader title="Available Tickets" />
        <Divider />
        <CardContent>
          {ticketsData.tickets.length > 0 &&
            <AvailableTickets
              value={ticketsData}
              ticketWinningNumbers={ticketWinningNumbers}
              handleWinningFormSubmit={handleSubmit}
            />
          }
        </CardContent>
        <Divider />
      </Card> */}
    </>
  );
};

WinningNumber.propTypes = {
  className: PropTypes.string
};

export default WinningNumber;
