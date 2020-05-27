import React from 'react';
import { Redirect } from 'react-router';
import { getJWT } from '../utils/getJWT';
import { Role } from '../__generated__/globalTypes';

interface AuthGuardProps {
  children: React.ReactNode;
}

export const GuestGuard: React.FC<AuthGuardProps> = ({ children }) => {
  const jwtPayload = getJWT();

  if (!jwtPayload || jwtPayload.role !== Role.ADMIN) {
    return <>{children}</>;
  }

  return <Redirect to={{ pathname: '/' }} />;
};
