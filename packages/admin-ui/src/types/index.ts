type Primitive =
  | string
  | Function
  | number
  | boolean
  | Symbol
  | undefined
  | null;

type DeepOmitHelper<T, K extends keyof T> = {
  [P in K]: T[P] extends infer TP
    ? TP extends Primitive
      ? TP
      : TP extends any[]
      ? DeepOmitArray<TP, K>
      : DeepOmit<TP, K>
    : never;
};

type DeepOmitArray<T extends any[], K> = {
  [P in keyof T]: DeepOmit<T[P], K>;
};

export type DeepOmit<T, K> = T extends Primitive
  ? T
  : DeepOmitHelper<T, Exclude<keyof T, K>>;

export type DeepUndefined<T> = {
  [P in keyof T]: DeepUndefined<T[P]> | undefined;
};
