import React, { useCallback, memo } from 'react';
import { useDispatch } from 'react-redux';
import { LogOut as LogOutIcon } from 'react-feather';
import { IconButton, SvgIcon } from '@material-ui/core';
import { useMutation, useApolloClient } from '@apollo/react-hooks';
import gql from 'graphql-tag';
import { useHistory } from 'react-router';
import { logout as logoutAction } from '../redux/actions';
import { Logout as LogoutGQL } from './__generated__/Logout';

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
    await logout();
    await client.resetStore();
    dispatch(logoutAction());
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
