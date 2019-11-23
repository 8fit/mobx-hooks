import { renderHook, act } from '@testing-library/react-hooks';

import TestObservable from './test-observable';
import useReaction from './use-reaction';

describe('useReaction', () => {
  it('reacts to observable changes and cleans up on unmount', () => {
    const subject = new TestObservable();
    const rendered = renderHook(() =>
      useReaction(() => ({
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
      useReaction(() => ({
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
});
