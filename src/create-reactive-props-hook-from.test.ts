import { renderHook, act } from '@testing-library/react-hooks';

import TestObservable from './test-observable';
import * as useReactiveProps from './use-reactive-props';
import createReactivePropsHookFrom from './create-reactive-props-hook-from';

const setup = () => {
  const source = {
    storeA: new TestObservable({ num: 0, str: 'storeA', arr: [] }),
    storeB: new TestObservable({ num: 0, str: 'storeB', arr: [] }),
  };

  return { source, hook: createReactivePropsHookFrom(source) };
};

describe('createReactivePropsHookFrom', () => {
  it('calls reactive props hook and passes along the return', () => {
    const mockReactivePropsReturn = {};

    jest
      .spyOn(useReactiveProps, 'default')
      .mockImplementation(() => mockReactivePropsReturn);

    const { hook } = setup();
    const options = {};

    const noOptions = renderHook(() => hook({}));

    expect(useReactiveProps.default).toHaveBeenLastCalledWith({}, undefined);
    expect(noOptions.result.current[0]).toBe(mockReactivePropsReturn);

    noOptions.unmount();

    const withOptions = renderHook(() => hook({}, options));

    expect(useReactiveProps.default).toHaveBeenLastCalledWith({}, options);
    expect(withOptions.result.current[0]).toBe(mockReactivePropsReturn);

    withOptions.unmount();

    (useReactiveProps.default as jest.Mock).mockRestore();
  });

  it('responds to observable changes from the source object', () => {
    const { hook, source } = setup();

    const rendered = renderHook(() =>
      hook({
        contentA: source => source.storeA.computedSerializedAttributes,
        contentB: source => source.storeB.computedSerializedAttributes,
      }),
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
    const { hook, source } = setup();

    const rendered = renderHook(() => hook({}));

    let providedSource: unknown;

    rendered.result.current[1](
      (provided: unknown) => (providedSource = provided),
    );

    expect(providedSource).toBe(source);
  });
});
