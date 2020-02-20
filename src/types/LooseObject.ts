export interface LooseObject {
  [key: string]: any;
}

export interface TypedLooseObject<T> {
  [key: string]: T;
}
