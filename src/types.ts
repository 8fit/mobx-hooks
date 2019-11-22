export type EqualityComp<T> = <K extends keyof T>(
  currentValue: T[K],
  nextValue: T[K],
  key: K,
) => boolean;

export interface Options<T> {
  deepJsConversion?: boolean;
  equalityComparator?: EqualityComp<T>;
}
