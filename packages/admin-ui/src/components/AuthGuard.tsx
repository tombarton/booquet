import React from 'react';
import { Redirect as RouterRedirect } from 'react-router';
import { useAuthSelector } from '../redux/reducers';
import { Role } from '../__generated__/globalTypes';

interface AuthGuardProps {
  children: React.ReactNode;
}

export const AuthGuard: React.FC<AuthGuardProps> = ({ children }) => {
  const { accessToken, user } = useAuthSelector();

  if (!accessToken || user?.role !== Role.ADMIN) {
    return <RouterRedirect to={{ pathname: '/login' }} />;
  }

  return <>{children}</>;
};
