import { Request, Response } from 'express';

export interface GraphQLContext {
  req: Request;
  res: Response;
}

export interface InternalProduct {
  id: string;
  title: string;
  price: number;
}

export interface ContentfulEvent {
  title: string;
  price: number;
  description: string;
  date: string;
  availableSpaces: number;
}

export type NestGraphQLConnectionParams = Record<string, any>;
export type NestGraphQLWebSocket = Record<string, any>;
