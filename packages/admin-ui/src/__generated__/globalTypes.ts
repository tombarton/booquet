/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

//==============================================================
// START Enums and Input Objects
//==============================================================

export enum OrderSortField {
  createdAt = "createdAt",
  id = "id",
  updatedAt = "updatedAt",
}

/**
 * Order Status
 */
export enum OrderStatus {
  AWAITING_CONFIRMATION = "AWAITING_CONFIRMATION",
  AWAITING_FULFILLMENT = "AWAITING_FULFILLMENT",
  FULFILLED = "FULFILLED",
}

/**
 * User role
 */
export enum Role {
  ADMIN = "ADMIN",
  USER = "USER",
}

export enum SortDirection {
  asc = "asc",
  desc = "desc",
}

export interface LoginInput {
  email: string;
  password: string;
}

export interface OrderSort {
  direction: SortDirection;
  field: OrderSortField;
}

//==============================================================
// END Enums and Input Objects
//==============================================================
