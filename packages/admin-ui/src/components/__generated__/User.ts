/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { Role } from "./../../__generated__/globalTypes";

// ====================================================
// GraphQL query operation: User
// ====================================================

export interface User_me {
  id: string;
  firstname: string | null;
  lastname: string | null;
  email: string;
  registeredAt: any;
  updatedAt: any;
  role: Role;
}

export interface User {
  me: User_me;
}
