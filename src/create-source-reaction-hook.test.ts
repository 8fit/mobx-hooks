import { renderHook, act } from '@testing-library/react-hooks';

import TestObservable from './test-observable';
import createSourceReactionHook from './create-source-reaction-hook';

describe('useSourceReaction', () => {
  it('creates a useReaction hook which provides a source', () => {
    const obs = new TestObservable();
    const hook = createSourceReactionHook(obs);
    const effect = jest.fn();
    const { unmount } = renderHook(() =>
      hook(source => source.observablePrimitive, effect),
    );

    expect(effect.mock.calls).toEqual([]);

    act(() => {
      obs.observablePrimitive = 'value1';
    });

    expect(effect.mock.calls).toEqual([expect.arrayContaining(['value1'])]);

    unmount();

    act(() => {
      obs.observablePrimitive = 'value1';
    });

    expect(effect.mock.calls).toEqual([expect.arrayContaining(['value1'])]);
  });
});
