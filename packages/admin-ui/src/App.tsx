import React from 'react';
import { ApolloProvider } from '@apollo/react-hooks';
import { ThemeProvider, makeStyles, createStyles } from '@material-ui/core';
import { Provider } from 'react-redux';

import { createApolloClient } from './apollo/client';
import { createTheme } from './theme';
import { Routes } from './Routes';
import { store } from './redux/store';
import { Auth } from './components/Auth';

const client = createApolloClient();
const theme = createTheme();

const useStyles = makeStyles(() =>
  createStyles({
    '@global': {
      '*': {
        boxSizing: 'border-box',
        margin: 0,
        padding: 0,
      },
      html: {
        '-webkit-font-smoothing': 'antialiased',
        '-moz-osx-font-smoothing': 'grayscale',
        height: '100%',
        width: '100%',
      },
      body: {
        height: '100%',
        width: '100%',
      },
      '#root': {
        height: '100%',
        width: '100%',
      },
    },
  })
);

export const App: React.FC = () => {
  useStyles();

  return (
    <Provider store={store}>
      <ApolloProvider client={client}>
        <ThemeProvider theme={theme}>
          <Auth>
            <Routes />
          </Auth>
        </ThemeProvider>
      </ApolloProvider>
    </Provider>
  );
};
