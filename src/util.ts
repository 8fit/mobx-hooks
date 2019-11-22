const isValueNaN = (value: unknown): value is number =>
  Number.isNaN(value as number);

const isTypeofObject = (value: unknown): value is { [key: string]: unknown } =>
  typeof value === 'object';

export const valueEq = (a: unknown, b: unknown): boolean => {
  if (a === b) return true;

  if (isValueNaN(a) && isValueNaN(b)) return true;

  if (isTypeofObject(a) && isTypeofObject(b)) {
    const [aKeys, bKeys] = [a, b].map(Object.keys);

    return aKeys.length !== bKeys.length
      ? false
      : aKeys.every(key => valueEq(a[key], b[key]));
  }

  return false;
};
