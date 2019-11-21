import { observable, computed } from 'mobx';

type Attributes = { a: number; b: string };

export default class TestObservable {
  private attributes = observable.map<keyof Attributes>({});

  @observable observableProp = 'value';

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
  get computedContent() {
    return `${this.observableProp}::${this.getSafe('a')}::${this.getSafe('b')}`;
  }
}
