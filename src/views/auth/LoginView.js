import React, { useState } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import * as Yup from 'yup';
import { Formik } from 'formik';
import {
  Box,
  Button,
  Container,
  Link,
  TextField,
  Typography,
  makeStyles
} from '@material-ui/core';
import Axios from 'src/config/axios';
import Page from 'src/components/Page';
import Snackbar from 'src/components/NotifyBar';

const useStyles = makeStyles((theme) => ({
  root: {
    backgroundColor: theme.palette.background.dark,
    height: '100%',
    paddingBottom: theme.spacing(3),
    paddingTop: theme.spacing(3)
  }
}));

const LoginView = () => {
  const classes = useStyles();
  const navigate = useNavigate();
  const [snackBarState, setSnackBarState] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const Login = (username, password) => {
    Axios.post(`${process.env.REACT_APP_API}/auth/login`, {
      username: username,
      password: password
    })
      .then((response) => {
        localStorage.setItem('token', response.data.token);
        navigate('/app/purchaseticket', { replace: true });
      })
      .catch((error) => {
        const { response } = error;
        setSnackBarState(true);
        console.log(response);
        setErrorMessage(response.data.message);
      });
  };

  return (
    <Page className={classes.root} title="Login">
      <Snackbar
        snackBarState={snackBarState}
        setState={setSnackBarState}
        message={errorMessage}
        severity="error"
      />
      <Box
        display="flex"
        flexDirection="column"
        height="100%"
        justifyContent="center"
      >
        <Container maxWidth="sm">
          <Formik
            initialValues={{
              username: '',
              password: ''
            }}
            validationSchema={Yup.object().shape({
              username: Yup.string()
                .max(255)
                .required('Username is required'),
              password: Yup.string()
                .max(255)
                .required('Password is required')
            })}
            onSubmit={(values) => {
              Login(values.username, values.password);
            }}
          >
            {({
              errors,
              handleBlur,
              handleChange,
              handleSubmit,
              touched,
              values
            }) => (
              <form onSubmit={handleSubmit}>
                <Box mb={3}>
                  <Typography color="textPrimary" variant="h2">
                    Sign in
                  </Typography>
                  <Typography
                    color="textSecondary"
                    gutterBottom
                    variant="body2"
                  >
                    Sign in on the internal platform
                  </Typography>
                </Box>

                <TextField
                  error={Boolean(touched.email && errors.email)}
                  fullWidth
                  helperText={touched.email && errors.email}
                  label="Username"
                  margin="normal"
                  name="username"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  value={values.username}
                  variant="outlined"
                />
                <TextField
                  error={Boolean(touched.password && errors.password)}
                  fullWidth
                  helperText={touched.password && errors.password}
                  label="Password"
                  margin="normal"
                  name="password"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  type="password"
                  value={values.password}
                  variant="outlined"
                />
                <Box my={2}>
                  <Button
                    color="primary"
                    fullWidth
                    size="large"
                    type="submit"
                    variant="contained"
                  >
                    Sign in now
                  </Button>
                </Box>
                <Typography color="textSecondary" variant="body1">
                  Don&apos;t have an account?
                  <Link component={RouterLink} to="/register" variant="h6">
                    Sign up
                  </Link>
                </Typography>
              </form>
            )}
          </Formik>
        </Container>
      </Box>
    </Page>
  );
};

export default LoginView;
