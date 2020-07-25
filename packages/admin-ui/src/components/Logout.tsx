import React, { useCallback, memo } from 'react';
import { useDispatch } from 'react-redux';
import { LogOut as LogOutIcon } from 'react-feather';
import { IconButton, SvgIcon } from '@material-ui/core';
import { useMutation, useApolloClient } from '@apollo/react-hooks';
import gql from 'graphql-tag';
import { useHistory } from 'react-router';
import { logout as logoutAction } from '../redux/actions';
import { Logout as LogoutGQL } from './__generated__/Logout';
import AuthService from '../services/auth';

const LOGOUT = gql`
  mutation Logout {
    logout
  }
`;

export const Logout = memo(() => {
  const [logout] = useMutation<LogoutGQL>(LOGOUT);
  const client = useApolloClient();
  const history = useHistory();
  const dispatch = useDispatch();

  const onLogout = useCallback(async () => {
    // Delete server side cookie.
    await logout();
    // Remove token from local storage.
    AuthService.removeAccessToken();
    // Reset Redux store.
    dispatch(logoutAction());
    // Reset GraphQL store.
    await client.resetStore();
    // Redirect to login page.
    history.push('/login');
  }, [client, history, logout, dispatch]);

  return (
    <IconButton onClick={onLogout}>
      <SvgIcon color="secondary">
        <LogOutIcon />
      </SvgIcon>
    </IconButton>
  );
});
