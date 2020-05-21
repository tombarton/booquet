export class TimeoutError extends Error {}

export const promiseTimeout = <T>(
  ms: number,
  promise: Promise<T>
): Promise<T | TimeoutError> => {
  const timeout = new Promise<TimeoutError>((_, reject) => {
    const id = setTimeout(() => {
      clearTimeout(id);
      return reject(new TimeoutError(`Timed out in ${ms} ms.`));
    }, ms);
  });

  return Promise.race([promise, timeout]);
};
