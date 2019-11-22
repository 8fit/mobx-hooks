import { valueEq } from './util';

describe('util', () => {
  it('Should check that inputs are equal by value', () => {
    const sameRef = {};

    expect(valueEq(undefined, undefined)).toBe(true);
    expect(valueEq(undefined, null)).toBe(false);
    expect(valueEq(NaN, null)).toBe(false);
    expect(valueEq(null, null)).toBe(true);
    expect(valueEq(NaN, NaN)).toBe(true);
    expect(valueEq(Infinity, Infinity)).toBe(true);
    expect(valueEq(-Infinity, -Infinity)).toBe(true);
    expect(valueEq(Infinity, -Infinity)).toBe(false);
    expect(valueEq(+0, -0)).toBe(true);
    expect(valueEq(1, '1')).toBe(false);
    expect(valueEq(1, null)).toBe(false);
    expect(valueEq(1, undefined)).toBe(false);
    expect(valueEq(1, NaN)).toBe(false);
    expect(valueEq(1, 1)).toBe(true);
    expect(valueEq('1', '1')).toBe(true);
    expect(valueEq(sameRef, sameRef)).toBe(true);
    expect(valueEq([], [])).toBe(true);
    expect(valueEq([1, 2], [1, 2])).toBe(true);
    expect(valueEq([2, 1], [1, 2])).toBe(false);
    expect(valueEq([1, 2, 3], [1, 2])).toBe(false);
    expect(valueEq({ a: 1, b: 2 }, { b: 2, a: 1 })).toBe(true);
    expect(valueEq({ a: 1, b: 2 }, { b: 2, c: 3, a: 1 })).toBe(false);
    expect(
      valueEq({ a: 1, b: [1, { c: 2 }] }, { b: [1, { c: 2 }], a: 1 }),
    ).toBe(true);
  });
});
