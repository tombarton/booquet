import { Request, Response } from 'express';

export interface GraphQLContext {
  req: Request;
  res: Response;
}

export interface ContentfulProduct {
  title: string;
  price: number;
  description: string;
}
