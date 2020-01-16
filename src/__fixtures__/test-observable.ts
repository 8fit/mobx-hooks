import { observable, computed } from 'mobx';

type Attributes = {
  num: number;
  str: string;
  arr: unknown[];
  obj: { [key: string]: unknown };
};

export default class TestObservable {
  private attributes = observable.map<keyof Attributes>({});

  @observable observablePrimitive = 'primitive';
  @observable observableNonPrimitive: number[] = [];

  constructor(initialAttributes: Partial<Attributes> = {}) {
    this.attributes.merge(initialAttributes);
  }

  set(attributes: Partial<Attributes>) {
    this.attributes.merge(attributes);
  }

  get<T extends keyof Attributes>(key: T): Attributes[T] | undefined {
    return this.attributes.get(key);
  }

  @computed
  get computedSerializedAttributes() {
    return `${this.get('num')}::${this.get('str')}::${JSON.stringify(
      this.get('arr') ?? [],
    )}`;
  }
}
