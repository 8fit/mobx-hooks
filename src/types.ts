import { IEqualsComparer } from 'mobx';

export interface Options<T> {
  jsConvert?: boolean;
  stateComparer?: IEqualsComparer<T>;
}

export type Selector<T> = () => T;

export type SelectorFromSource<S, T> = (source: S) => T;
