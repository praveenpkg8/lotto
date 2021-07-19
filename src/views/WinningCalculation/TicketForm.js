import React, { useState, useContext } from 'react';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import {
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Divider,
  Grid,
  makeStyles,
  Typography
} from '@material-ui/core';
import Axios from 'src/config/axios';
import { v4 as uuidv4 } from 'uuid';
import { UserContext } from 'src/contextApi/UserContext';
import MenuItem from '@material-ui/core/MenuItem';
import InputLabel from '@material-ui/core/InputLabel';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';

const useStyles = makeStyles(() => ({
  root: {}
}));

const TicketForm = ({ className, setValue, ...rest }) => {
  const classes = useStyles();

  const [userList] = useContext(UserContext);
  const [user, setUser] = useState('');

  const token = localStorage.getItem('token');

  const handleChange = (event) => {
    setUser(event.target.value);
  };

  const handleSubmit = () => {
    Axios.get(`${process.env.REACT_APP_API}/pricecalculation?user=${user}`, {
      headers: { 'Bearer-Token': token }
    })
      .then((response) => {
        const { message } = response.data;
        setValue(message);
      })
      .catch((err) => {
        console.log(err.response);
      });
    setUser('');
  };

  return (
    <form
      autoComplete="off"
      noValidate
      className={clsx(classes.root, className)}
      {...rest}
    >
      <Card>
        <CardHeader title="Winning Calculation" />
        <Divider />
        <CardContent>
          <Grid container spacing={3}>
            <Grid item md={12} xs={12}>
              <Typography>Select a user to see their summary</Typography>
            </Grid>
            <Grid item md={12} xs={12}>
              <FormControl variant="outlined" className={classes.formControl}>
                <InputLabel id="demo-simple-select-outlined-label">
                  User
                </InputLabel>
                <Select
                  labelId="demo-simple-select-outlined-label"
                  id="demo-simple-select-outlined"
                  value={user}
                  onChange={handleChange}
                  label="UserName"
                  style={{ width: '400px' }}
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
        </CardContent>
        <Box display="flex" p={2}>
          <Button color="primary" variant="contained" onClick={handleSubmit}>
            Calculate
          </Button>
        </Box>
      </Card>
    </form>
  );
};

TicketForm.propTypes = {
  className: PropTypes.string,
  setValue: PropTypes.func
};

export default TicketForm;
