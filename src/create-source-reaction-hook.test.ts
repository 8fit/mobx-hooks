import { renderHook, act } from '@testing-library/react-hooks';

import TestObservable from './test-observable';
import * as useReactiveProps from './use-reaction';
import createSourceReactionHook from './create-source-reaction-hook';

const setup = () => {
  const source = {
    storeA: new TestObservable({ num: 0, str: 'storeA', arr: [] }),
    storeB: new TestObservable({ num: 0, str: 'storeB', arr: [] }),
  };

  return { source, useSource: createSourceReactionHook(source) };
};

describe('createReactivePropsHookFrom', () => {
  it('calls reactive props hook and passes along the return', () => {
    const mockReactivePropsReturn = {};

    jest
      .spyOn(useReactiveProps, 'default')
      .mockImplementation(() => mockReactivePropsReturn);

    const { useSource } = setup();
    const selector = () => ({});
    const options = {};

    const noOptions = renderHook(() => useSource(() => selector));

    expect(useReactiveProps.default).toHaveBeenLastCalledWith(
      selector,
      undefined,
    );
    expect(noOptions.result.current[0]).toBe(mockReactivePropsReturn);

    noOptions.unmount();

    const withOptions = renderHook(() => useSource(() => selector, options));

    expect(useReactiveProps.default).toHaveBeenLastCalledWith(
      selector,
      options,
    );
    expect(withOptions.result.current[0]).toBe(mockReactivePropsReturn);

    withOptions.unmount();

    (useReactiveProps.default as jest.Mock).mockRestore();
  });

  it('responds to observable changes from the source object', () => {
    const { useSource, source } = setup();

    const rendered = renderHook(() =>
      useSource(source => () => ({
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
    const { useSource: hook, source } = setup();

    const rendered = renderHook(() => hook(() => () => ({})));

    let providedSource: unknown;

    rendered.result.current[1](
      (provided: unknown) => (providedSource = provided),
    );

    expect(providedSource).toBe(source);
  });
});
