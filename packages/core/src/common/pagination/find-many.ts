export type SpecifiedCursor = {
  id?: string | null;
};

export type ConnectionCursor = string;

export interface SpecifiedArguments {
  skip: number;
  first: number;
}

export interface ConnectionArguments {
  limit?: number | null;
  skip?: number | null;
}

export interface PageInfo {
  startCursor?: ConnectionCursor;
  endCursor?: ConnectionCursor;
  totalPages: string;
  hasPreviousPage: boolean;
  hasNextPage: boolean;
}

export interface Edge<T> {
  node: T;
  cursor: ConnectionCursor;
}

export interface Connection<T> {
  edges: Array<Edge<T>>;
  pageInfo: PageInfo;
  totalCount: number;
}

const DEFAULT_LIMIT = 15;
const DEFAULT_SKIP = 0;

export async function findManyOffset<Model extends { id: string }>(
  findMany: (args: SpecifiedArguments) => Promise<Model[]>,
  aggregate: () => Promise<number>,
  args: ConnectionArguments = {} as ConnectionArguments
): Promise<Connection<Model>> {
  const limit = args.limit || DEFAULT_LIMIT;
  const skip = args.skip || DEFAULT_SKIP;

  // Get the total number of items.
  const totalCount = await aggregate();

  // Calculate the total number of pages.
  const totalPages = Math.ceil(totalCount / limit);

  // Execute the underlying findMany operation
  const nodes = await findMany({ skip, first: limit });

  return {
    edges: nodes.map(node => ({
      node,
      cursor: node.id,
    })),
    pageInfo: {
      startCursor: nodes.length ? nodes[0].id : null,
      endCursor: nodes.length ? nodes[nodes.length - 1].id : null,
      hasNextPage: limit + skip < totalCount,
      hasPreviousPage: skip > 0,
      totalPages: totalPages.toString(10),
    },
    totalCount,
  };
}
