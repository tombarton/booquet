import { createAction } from '@reduxjs/toolkit';
import { Login_login as Login } from '../views/Login/__generated__/Login';

export const loginSuccess = createAction<Login>('auth/login-success');
export const logout = createAction('auth/logout');
