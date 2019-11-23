import { renderHook, act } from '@testing-library/react-hooks';

import TestObservable from './test-observable';
import * as useReactiveProps from './use-state-from-reaction';
import createStateFromSourceReactionHook from './create-state-from-source-reaction-hook';

const setup = () => {
  const source = {
    storeA: new TestObservable({ num: 0, str: 'storeA', arr: [] }),
    storeB: new TestObservable({ num: 0, str: 'storeB', arr: [] }),
  };

  return {
    source,
    useStateFromSourceReaction: createStateFromSourceReactionHook(source),
  };
};

describe('createSourceReactionHook', () => {
  it('use useReaction and passes along its return', () => {
    const mockReactivePropsReturn = {};

    jest
      .spyOn(useReactiveProps, 'default')
      .mockImplementation(() => mockReactivePropsReturn);

    const { useStateFromSourceReaction } = setup();
    const selector = () => ({});
    const options = {};

    const noOptions = renderHook(() => useStateFromSourceReaction(selector));

    expect(useReactiveProps.default).toHaveBeenLastCalledWith(
      expect.any(Function),
      undefined,
    );
    expect(noOptions.result.current[0]).toBe(mockReactivePropsReturn);

    noOptions.unmount();

    const withOptions = renderHook(() =>
      useStateFromSourceReaction(selector, options),
    );

    expect(useReactiveProps.default).toHaveBeenLastCalledWith(
      expect.any(Function),
      options,
    );
    expect(withOptions.result.current[0]).toBe(mockReactivePropsReturn);

    withOptions.unmount();

    (useReactiveProps.default as jest.Mock).mockRestore();
  });

  it('responds to observable changes from the source object', () => {
    const { useStateFromSourceReaction, source } = setup();

    const rendered = renderHook(() =>
      useStateFromSourceReaction(source => ({
        contentA: source.storeA.computedSerializedAttributes,
        contentB: source.storeB.computedSerializedAttributes,
      })),
    );

    expect(rendered.result.current[0]).toEqual({
      contentA: '0::storeA::[]',
      contentB: '0::storeB::[]',
    });

    act(() => {
      source.storeA.set({ num: 1 });
    });

    expect(rendered.result.current[0]).toEqual({
      contentA: '1::storeA::[]',
      contentB: '0::storeB::[]',
    });

    rendered.unmount();

    act(() => {
      source.storeB.set({ num: 1 });
    });

    expect(rendered.result.current[0]).toEqual({
      contentA: '1::storeA::[]',
      contentB: '0::storeB::[]',
    });
  });

  it('returns a function that provides access to the source object', () => {
    const { useStateFromSourceReaction, source } = setup();

    const rendered = renderHook(() => useStateFromSourceReaction(() => ({})));

    let providedSource: unknown;

    rendered.result.current[1](
      (provided: unknown) => (providedSource = provided),
    );

    expect(providedSource).toBe(source);
  });
});
