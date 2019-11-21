import { renderHook, act } from '@testing-library/react-hooks';

import TestObservable from './test-observable';
import createReactivePropsHookFrom from './create-reactive-props-hook-from';

const setup = () => {
  const source = {
    storeA: new TestObservable({ a: 0, b: 'storeA' }),
    storeB: new TestObservable({ a: 0, b: 'storeB' }),
  };

  return { source, hook: createReactivePropsHookFrom(source) };
};

describe('createReactivePropsHookFrom', () => {
  it('responds to observable changes from the source object', () => {
    const { hook, source } = setup();

    const rendered = renderHook(() =>
      hook({
        contentA: source => source.storeA.computedContent,
        contentB: source => source.storeB.computedContent,
      }),
    );

    expect(rendered.result.current[0]).toEqual({
      contentA: 'value::0::storeA',
      contentB: 'value::0::storeB',
    });

    act(() => {
      source.storeA.set({ a: 1 });
    });

    expect(rendered.result.current[0]).toEqual({
      contentA: 'value::1::storeA',
      contentB: 'value::0::storeB',
    });

    rendered.unmount();

    act(() => {
      source.storeB.set({ a: 1 });
    });

    expect(rendered.result.current[0]).toEqual({
      contentA: 'value::1::storeA',
      contentB: 'value::0::storeB',
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
