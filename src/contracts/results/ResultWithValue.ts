export interface Result {
  isSuccess: boolean;
  statusCode?: number;
  errorMessage: string;
}

export interface ResultWithValue<T> extends Result {
  value: T;
}
