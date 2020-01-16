import { isObservable, toJS } from 'mobx';
import { renderHook, act } from '@testing-library/react-hooks';

import TestObservable from './__fixtures__/test-observable';
import useStateFromReaction from './use-state-from-reaction';

describe('useStateFromReaction', () => {
  it('reacts to observable changes and cleans up on unmount', () => {
    const subject = new TestObservable();
    const rendered = renderHook(() =>
      useStateFromReaction(() => ({
        primitive: subject.observablePrimitive,
        num: subject.get('num'),
        str: subject.get('str'),
        serialized: subject.computedSerializedAttributes,
      })),
    );

    expect(rendered.result.current.primitive).toBe('primitive');
    expect(rendered.result.current.num).toBeUndefined();
    expect(rendered.result.current.str).toBeUndefined();
    expect(rendered.result.current.serialized).toBe('undefined::undefined::[]');

    act(() => {
      subject.observablePrimitive = 'nextvalue';
    });

    expect(rendered.result.current.primitive).toBe('nextvalue');
    expect(rendered.result.current.num).toBeUndefined();
    expect(rendered.result.current.str).toBeUndefined();
    expect(rendered.result.current.serialized).toBe('undefined::undefined::[]');

    act(() => {
      subject.set({ num: 4 });
    });

    expect(rendered.result.current.primitive).toBe('nextvalue');
    expect(rendered.result.current.num).toBe(4);
    expect(rendered.result.current.str).toBeUndefined();
    expect(rendered.result.current.serialized).toBe('4::undefined::[]');

    rendered.unmount();

    act(() => {
      subject.set({ str: 'defined' });
    });

    expect(rendered.result.current.primitive).toBe('nextvalue');
    expect(rendered.result.current.num).toBe(4);
    expect(rendered.result.current.str).toBeUndefined();
    expect(rendered.result.current.serialized).toBe('4::undefined::[]');
  });

  it('provides stable state', () => {
    const subject = new TestObservable({ num: 1, arr: [1, 2] });
    const rendered = renderHook(() =>
      useStateFromReaction(() => ({
        primitive: subject.observablePrimitive,
        num: subject.get('num'),
        str: subject.get('str'),
        arr: subject.get('arr'),
        serialized: subject.computedSerializedAttributes,
      })),
    );

    const firstResultState = rendered.result.current;

    act(() => {
      subject.set({ num: 2 });
    });

    const secondResultState = rendered.result.current;

    expect(secondResultState).not.toBe(firstResultState);

    act(() => {
      subject.set({ num: 2 });
    });

    expect(rendered.result.current).toBe(secondResultState);

    act(() => {
      subject.set({ arr: [1, 2] });
    });

    expect(rendered.result.current).toBe(secondResultState);

    act(() => {
      subject.set({ arr: [2, 1] });
    });

    expect(rendered.result.current).not.toBe(secondResultState);
  });

  describe('options', () => {
    it('respects stateEquals option', () => {
      const subject = new TestObservable({ num: 2 });
      const rendered = renderHook(() =>
        useStateFromReaction(() => ({ num: subject.get('num') || 1 }), {
          stateEquals: (state, nextState) => nextState.num % state.num === 0,
        }),
      );

      const firstResultState = rendered.result.current;

      act(() => {
        subject.set({ num: 3 });
      });

      const secondResultState = rendered.result.current;

      expect(secondResultState).not.toBe(firstResultState);

      act(() => {
        subject.set({ num: 6 });
      });

      expect(rendered.result.current).toBe(secondResultState);
    });

    it('respects stateToJs option', () => {
      const subject = new TestObservable({ obj: { inner: { e: 5 } } });
      const expression = () => ({ obj: subject.get('obj') });
      const noConvert = renderHook(() => useStateFromReaction(expression));
      const convert = renderHook(() =>
        useStateFromReaction(expression, {
          stateToJS: result => toJS(result, { recurseEverything: true }),
        }),
      );

      expect(isObservable(convert.result.current.obj?.inner)).toBe(false);
      expect(isObservable(noConvert.result.current.obj?.inner)).toBe(true);

      const convertResultOne = convert.result.current;
      const noConvertResultOne = noConvert.result.current;

      act(() => {
        subject.set({ obj: { inner: { e: 5 } } });
      });

      expect(convert.result.current).toBe(convertResultOne);
      expect(noConvert.result.current).toBe(noConvertResultOne);
    });
  });
});
