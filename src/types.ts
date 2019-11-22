import { IEqualsComparer } from 'mobx';

export interface Options<T> {
  jsConvert?: boolean;
  stateComparer?: IEqualsComparer<T>;
}
