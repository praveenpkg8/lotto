import React, { useState, useContext, useEffect } from 'react';
import _, { drop } from 'lodash';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import { v4 as uuidv4 } from 'uuid';
import {
  Button,
  Card,
  CardHeader,
  Divider,
  Grid,
  makeStyles,
  Box,
  MenuItem,
  FormControl,
  Select,
  Typography,
  InputLabel
} from '@material-ui/core';
import Axios from 'axios';

import { UserContext } from '../../contextApi/UserContext';

import Snackbar from '../../components/NotifyBar';
import TicketCard from './ticketCard';

const useStyles = makeStyles(() => ({
  root: {}
}));

const Settings = ({ className, ...rest }) => {
  const classes = useStyles();
  const [ticketSettingsList, setTicketSettingsList] = useState({});
  const [userList] = useContext(UserContext);
  const [snackBarState, setSnackBarState] = useState(false);
  const [snackBarMessage, setSnackBarMessage] = useState('');
  const [severity, setSeverity] = useState('');
  const token = localStorage.getItem('token');

  const [user, setUser] = useState('');
  const [ticketWinningNumbers, setTicketWinningNumbers] = useState({});

  const getTicketSettings = async (userName) => {
    Axios.get(`${process.env.REACT_APP_API}/userticketsettings?user=${userName}`, {
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

  const handleUserChange = (event) => {
    setUser(event.target.value);
    setTicketSettingsList({});
    getTicketSettings(event.target.value);
  };

  useEffect(() => {
    getTicketSettings(user);
  }, []);

  const handleSubmit = () => {
    Axios.post(
      `${process.env.REACT_APP_API}/updateticketsettings`,
      {
        user: user,
        sellingPrices: ticketWinningNumbers
      },
      { headers: { 'Bearer-Token': token } }
    )
      .then(() => {
        setSnackBarState(true);
        setSeverity('success');
        setSnackBarMessage('Ticket settings successfully');
      })
      .catch((error) => {
        const { response } = error;
        if (response.data.message === 'SequelizeUniqueConstraintError') {
          setSnackBarMessage('Ticket settings not updated.');
          setSeverity('error');
          setSnackBarState(true);
        }
      });

    setTicketWinningNumbers({});
  };

  return (
    <Card style={{ marginBottom: '5%' }}>
      <CardHeader title="Ticket Settings" />
      <Divider />
      <form
        autoComplete="off"
        noValidate
        className={clsx(classes.root, className)}
        {...rest}
      >
        <Snackbar
          snackBarState={snackBarState}
          setState={setSnackBarState}
          message={snackBarMessage}
          severity={severity}
        />
        <Grid container spacing={3} style={{ padding: '10px' }} >
          <Grid item md={12} xs={12}>
            <Typography>Select a user to set the selling price</Typography>
          </Grid>
          <Grid item>
            <FormControl variant="outlined" className={classes.formControl}>
              <InputLabel id="demo-simple-select-outlined-label">
                User
              </InputLabel>
              <Select
                labelId="demo-simple-select-outlined-label"
                id="demo-simple-select-outlined"
                value={user}
                onChange={handleUserChange}
                label="UserName"
                style={{ width: '300px' }}
                variant="outlined"
                margin="dense"
              >
                {userList.map((element) => (
                  <MenuItem key={uuidv4()} value={element.customerName}>
                    {element.customerName}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
        </Grid>
        <Grid container spacing={3} style={{ padding: '10px' }} >
          {ticketSettingsList.length > 0 && ticketSettingsList.map((ticket, index) => {
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
        <Box my={2}>
          <Button
            style={{
              float: 'left',
              marginBottom: '10px',
              marginLeft: '10px'
            }}
            color="primary"
            variant="contained"
            onClick={handleSubmit}
          >
            Save
          </Button>
        </Box>
      </form>
    </Card>
  );
};

Settings.propTypes = {
  className: PropTypes.string
};

export default Settings;
