import {CancelableResult} from "../../CancelableResult";

export const sleep = (millis: number): CancelableResult<void> => {
  let onCancel: () => void;
  const promise = new Promise<void>(resolve => {
    onCancel = (): void => {
      clearTimeout(timeoutId);
      setImmediate(resolve);
    };
    const timeoutId: NodeJS.Timeout = setTimeout(resolve, millis);
  });
  return {
    cancel: onCancel,
    promise,
  };
};
