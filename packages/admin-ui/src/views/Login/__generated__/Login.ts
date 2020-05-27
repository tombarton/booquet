/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { LoginInput, Role } from "./../../../__generated__/globalTypes";

// ====================================================
// GraphQL mutation operation: Login
// ====================================================

export interface Login_login {
  __typename: "User";
  id: string;
  role: Role;
}

export interface Login {
  login: Login_login;
}

export interface LoginVariables {
  data: LoginInput;
}
