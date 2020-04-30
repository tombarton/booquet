export const asyncForEach = async <T>(
  array: T[],
  callback: (item: T, index: number, allItems: T[]) => Promise<any>
) => {
  for (let i = 0; i < array.length; i++) {
    // eslint-disable-next-line security/detect-object-injection
    await callback(array[i], i, array);
  }
};
