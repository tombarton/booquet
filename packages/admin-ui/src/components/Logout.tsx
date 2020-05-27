import React, { useCallback } from 'react';
import { LogOut as LogOutIcon } from 'react-feather';
import { IconButton, SvgIcon } from '@material-ui/core';
import gql from 'graphql-tag';
import { useMutation, useApolloClient } from '@apollo/react-hooks';
import { useHistory } from 'react-router';
import { Logout as LogoutGQL } from './__generated__/Logout';

const LOGOUT = gql`
  mutation Logout {
    logout
  }
`;

export const Logout = () => {
  const [logout] = useMutation<LogoutGQL>(LOGOUT);
  const client = useApolloClient();
  const history = useHistory();

  const onLogout = useCallback(async () => {
    await logout();
    await client.resetStore();
    history.push('/login');
  }, [client, history, logout]);

  return (
    <IconButton onClick={onLogout}>
      <SvgIcon color="secondary">
        <LogOutIcon />
      </SvgIcon>
    </IconButton>
  );
};
