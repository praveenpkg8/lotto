import React from 'react';
import { Navigate } from 'react-router-dom';
import { Container, makeStyles } from '@material-ui/core';
import Page from 'src/components/Page';
import Settings from './Settings';

const useStyles = makeStyles((theme) => ({
  root: {
    backgroundColor: theme.palette.background.dark,
    minHeight: '100%',
    paddingBottom: theme.spacing(3),
    paddingTop: theme.spacing(3)
  }
}));

const CustomerListView = () => {
  const classes = useStyles();
  const token = localStorage.getItem('token');

  return (
    <Page className={classes.root} title="Ticket Settings">
      {token ? (
        <Container maxWidth={false}>
          <Settings />
        </Container>
      ) : (
        <Navigate to="/login" />
      )}
    </Page>
  );
};

export default CustomerListView;
