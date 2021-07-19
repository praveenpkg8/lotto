import React, { createContext, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import Axios from 'src/config/axios';

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [userList, setUserList] = useState([]);
  const [refresh, setRefresh] = useState(true);
  const token = localStorage.getItem('token');

  useEffect(() => {
    Axios.get(`${process.env.REACT_APP_API}/users/getallusers`, {
      headers: { 'Bearer-Token': token }
    })
      .then((response) => {
        const { message } = response.data;
        setUserList(message);
      })
      .catch((err) => {
        console.log(err.response);
      });
  }, [refresh]);

  return (
    <UserContext.Provider value={[userList, setUserList, refresh, setRefresh]}>
      {children}
    </UserContext.Provider>
  );
};

UserProvider.propTypes = {
  children: PropTypes.any
};
