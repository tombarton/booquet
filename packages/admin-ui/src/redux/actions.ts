import { createAction } from '@reduxjs/toolkit';
import { Login_login_user as Login } from '../views/Login/__generated__/Login';
import { User_me as Me } from '../components/__generated__/User';

export type User = Login | Me;

export interface LoginSuccessPayload {
  accessToken: string;
  user: Login | User;
}

export const loginSuccess = createAction<LoginSuccessPayload>(
  'auth/login-success'
);
export const logout = createAction('auth/logout');
