/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { OrderSort, OrderStatus } from "./../../../__generated__/globalTypes";

// ====================================================
// GraphQL query operation: GetAllOrders
// ====================================================

export interface GetAllOrders_getAllOrders_pageInfo {
  __typename: "PageInfo";
  totalPages: string;
}

export interface GetAllOrders_getAllOrders_edges_node_user {
  __typename: "User";
  firstname: string | null;
  lastname: string | null;
}

export interface GetAllOrders_getAllOrders_edges_node {
  __typename: "Order";
  id: string;
  status: OrderStatus;
  total: number;
  createdAt: any;
  user: GetAllOrders_getAllOrders_edges_node_user | null;
}

export interface GetAllOrders_getAllOrders_edges {
  __typename: "OrderEdge";
  node: GetAllOrders_getAllOrders_edges_node;
}

export interface GetAllOrders_getAllOrders {
  __typename: "OrderConnection";
  pageInfo: GetAllOrders_getAllOrders_pageInfo;
  totalCount: number;
  edges: GetAllOrders_getAllOrders_edges[] | null;
}

export interface GetAllOrders {
  getAllOrders: GetAllOrders_getAllOrders;
}

export interface GetAllOrdersVariables {
  limit?: number | null;
  skip?: number | null;
  sortBy?: OrderSort | null;
}
