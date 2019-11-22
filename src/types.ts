export type EqualityComp<T> = <K extends keyof T>(
  currentValue: T[K],
  nextValue: T[K],
  key: K,
) => boolean;

export interface Options<T> {
  equalityComparator?: EqualityComp<T>;
}

export type PropsMap<T> = { [K in keyof T]: () => T[K] };

export type PropsMapWithSource<S, T> = { [K in keyof T]: (source: S) => T[K] };
