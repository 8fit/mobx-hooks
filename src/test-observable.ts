import { observable, computed } from 'mobx';

type Attributes = { num: number; str: string; arr: number[] };

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

  getSafe<T extends keyof Attributes>(key: T): Attributes[T] | undefined {
    return this.attributes.has(key) ? this.attributes.get(key) : undefined;
  }

  @computed
  get computedSerializedAttributes() {
    return `${this.getSafe('num')}::${this.getSafe('str')}::${JSON.stringify(
      this.getSafe('arr') ?? [],
    )}`;
  }
}
