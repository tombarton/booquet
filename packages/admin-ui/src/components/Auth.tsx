import React, { useState, useEffect, FC } from 'react';
import { useDispatch } from 'react-redux';
import { useApolloClient } from '@apollo/react-hooks';
import gql from 'graphql-tag';

import AuthService from '../services/auth';
import { loginSuccess } from '../redux/actions';
import { SplashScreen } from './Splash';
import { User } from './__generated__/User';

const USER = gql`
  query User {
    me {
      id
      firstname
      lastname
      email
      registeredAt
      updatedAt
      role
    }
  }
`;

export const Auth: FC = ({ children }) => {
  const dispatch = useDispatch();
  const [isLoading, setLoading] = useState(true);
  const accessToken = AuthService.handleAuthentication();
  const client = useApolloClient();

  useEffect(() => {
    const initAuth = async () => {
      if (accessToken) {
        const { data: userData } = await client.query<User>({ query: USER });
        if (userData) {
          dispatch(loginSuccess({ accessToken, user: userData.me }));
        }
      }

      setLoading(false);
    };

    initAuth();
  }, [accessToken, client, dispatch]);

  if (isLoading) {
    return <SplashScreen />;
  }

  return <>{children}</>;
};
