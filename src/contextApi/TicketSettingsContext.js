import React, { createContext, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import Axios from 'axios';

export const TicketSettingsContext = createContext();

export const TicketSettingsProvider = ({ children }) => {
  const [ticketSettingsList, setTicketSettingsList] = useState([]);
  const [refresh, setRefresh] = useState(true);
  const token = localStorage.getItem('token');

  useEffect(() => {
    Axios.get(`${process.env.REACT_APP_API}/allticketsettings`, {
      headers: { 'Bearer-Token': token }
    })
      .then((response) => {
        const { message } = response.data;
        setTicketSettingsList(message);
      })
      .catch((err) => {
        console.log(err.response);
      });
  }, [refresh]);

  return (
    <TicketSettingsContext.Provider
      value={[ticketSettingsList, setTicketSettingsList, refresh, setRefresh]}
    >
      {children}
    </TicketSettingsContext.Provider>
  );
};

TicketSettingsProvider.propTypes = {
  children: PropTypes.any
};
