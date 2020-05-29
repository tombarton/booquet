import React from 'react';
import { makeStyles, Theme, Container, Box } from '@material-ui/core';
import Page from '../../components/Page';
import { Header } from './Header';
import { Orders } from './Orders';

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    backgroundColor: theme.palette.background.default,
    minHeight: '100%',
    paddingTop: theme.spacing(3),
    paddingBottom: theme.spacing(3),
  },
}));

export const OrderListView = () => {
  const classes = useStyles();

  return (
    <Page className={classes.root} title="Order List">
      <Container maxWidth={false}>
        <Header />
        <Box mt={3}>
          <Orders />
        </Box>
      </Container>
    </Page>
  );
};

export default OrderListView;
