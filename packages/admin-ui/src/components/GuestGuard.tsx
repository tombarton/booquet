import React from 'react';
import { Redirect } from 'react-router';
import { Role } from '../__generated__/globalTypes';
import { useAuthSelector } from '../redux/reducers';

interface AuthGuardProps {
  children: React.ReactNode;
}

export const GuestGuard: React.FC<AuthGuardProps> = ({ children }) => {
  const { accessToken, user } = useAuthSelector();

  if (!accessToken || user?.role !== Role.ADMIN) {
    return <>{children}</>;
  }

  return <Redirect to={{ pathname: '/' }} />;
};
