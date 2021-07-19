/* eslint-disable */
import React, { useState, useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { Container, Grid, makeStyles, Button } from '@material-ui/core';
import { v4 as uuidv4 } from 'uuid';
import Page from 'src/components/Page';
import axios from 'axios';

import TicketDetailsForm from './TicketDetailsForm';

const useStyles = makeStyles((theme) => ({
  root: {
    backgroundColor: theme.palette.background.dark,
    minHeight: '100%',
    paddingBottom: theme.spacing(3),
    paddingTop: theme.spacing(3)
  }
}));

const SettingsView = () => {
  const classes = useStyles();
  const token = localStorage.getItem('token');

  const [ticketDetails, setTicketDetails] = useState({
    user: '',
    newuser: '',
    ticket: '',
    board: '',
    sellingprice: '',
    tickets: [{ id: uuidv4(), ticketNumber: '', ticketQty: 1, ticketDiasbled: true }]
  });

  const handleSubmit = async (values) => {
    let data = {
      ticketprice: values.ticket,
      ticketboard: values.board,
      sellingprice: values.sellingprice,
      ticketnumbers: []
    };

    if (values.newuser) {
      data['newuser'] = values.newuser;
    } else {
      data['user'] = values.user;
    }

    values.tickets.map((ticket) => {
      for (let i = 0; i < ticket.ticketQty; i++) {
        data.ticketnumbers.push(ticket.ticketNumber);
      }
    });

    await axios
      .post(`${process.env.REACT_APP_API}/purchaseticket`, data, {
        headers: { 'Bearer-Token': token }
      })
      .then((response) => {
        window.location.reload();
      })
      .catch((err) => {
        console.log(err.response);
      });
  };

  return (
    <Page className={classes.root} title="Purchase Ticket">
      {token ? (
        <Container maxWidth={false}>
          <TicketDetailsForm
            value={ticketDetails}
            setValue={setTicketDetails}
            handleTicketFormSubmit={handleSubmit}
          />
        </Container>
      ) : (
        <Navigate to="/login" />
      )}
    </Page>
  );
};

export default SettingsView;
