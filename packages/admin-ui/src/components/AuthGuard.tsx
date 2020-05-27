import React from 'react';
import { Redirect as RouterRedirect } from 'react-router';
import { getJWT } from '../utils/getJWT';
import { Role } from '../__generated__/globalTypes';

interface AuthGuardProps {
  children: React.ReactNode;
}

export const AuthGuard: React.FC<AuthGuardProps> = ({ children }) => {
  const jwtPayload = getJWT();

  if (!jwtPayload || jwtPayload.role !== Role.ADMIN) {
    return <RouterRedirect to={{ pathname: '/login' }} />;
  }

  return <>{children}</>;
};
