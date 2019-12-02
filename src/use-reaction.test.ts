import { renderHook, act } from '@testing-library/react-hooks';

import TestObservable from './test-observable';
import useReaction from './use-reaction';

describe('useReaction', () => {
  it('sets up a reaction and cleans up on unmount', () => {
    const obs = new TestObservable();
    const sideEffect = jest.fn();
    const sideEffectCalls = sideEffect.mock.calls;
    const reactionObject = expect.objectContaining({
      dispose: expect.any(Function),
    });

    const { unmount } = renderHook(() =>
      useReaction(() => obs.observablePrimitive, sideEffect, {
        fireImmediately: true,
      }),
    );

    expect(sideEffectCalls).toEqual([['primitive', reactionObject]]);

    act(() => {
      obs.observablePrimitive = 'value1';
    });

    expect(sideEffectCalls).toEqual([
      ['primitive', reactionObject],
      ['value1', reactionObject],
    ]);

    act(() => {
      obs.observablePrimitive = 'value2';
    });

    expect(sideEffectCalls).toEqual([
      ['primitive', reactionObject],
      ['value1', reactionObject],
      ['value2', reactionObject],
    ]);

    unmount();

    act(() => {
      obs.observablePrimitive = 'value2';
    });

    expect(sideEffectCalls).toEqual([
      ['primitive', reactionObject],
      ['value1', reactionObject],
      ['value2', reactionObject],
    ]);
  });
});
