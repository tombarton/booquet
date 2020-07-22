/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { LoginInput, Role } from "./../../../__generated__/globalTypes";

// ====================================================
// GraphQL mutation operation: Login
// ====================================================

export interface Login_login_user {
  id: string;
  registeredAt: any;
  updatedAt: any;
  email: string;
  firstname: string | null;
  lastname: string | null;
  role: Role;
}

export interface Login_login {
  /**
   * JWT access token
   */
  accessToken: string;
  /**
   * User details
   */
  user: Login_login_user;
}

export interface Login {
  login: Login_login;
}

export interface LoginVariables {
  data: LoginInput;
}
