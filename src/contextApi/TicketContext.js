import React, { createContext, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import Axios from 'axios';

export const TicketContext = createContext();

export const TicketProvider = ({ children }) => {
  const [ticketList, setTicketList] = useState([]);
  const [refresh, setRefresh] = useState(true);
  const token = localStorage.getItem('token');

  useEffect(() => {
    Axios.get(`${process.env.REACT_APP_API}/ticket/getallticket`, {
      headers: { 'Bearer-Token': token }
    })
      .then((response) => {
        const { message } = response.data;
        setTicketList(message);
      })
      .catch((err) => {
        console.log(err.response);
      });
  }, [refresh]);

  return (
    <TicketContext.Provider
      value={[ticketList, setTicketList, refresh, setRefresh]}
    >
      {children}
    </TicketContext.Provider>
  );
};

TicketProvider.propTypes = {
  children: PropTypes.any
};
