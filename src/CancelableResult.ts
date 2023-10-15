export type CancelableResult<T> = {
  cancel: () => void;
  promise: Promise<T>;
};