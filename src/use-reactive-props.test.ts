import { renderHook, act } from '@testing-library/react-hooks';

import TestObservable from './test-observable';
import useReactiveProps from './use-reactive-props';

describe('useReactiveProps', () => {
  it('reacts to observable changes and cleans up on unmount', () => {
    const subject = new TestObservable();
    const rendered = renderHook(() =>
      useReactiveProps({
        prop: () => subject.observableProp,
        a: () => subject.getSafe('a'),
        b: () => subject.getSafe('b'),
        content: () => subject.computedContent,
      }),
    );

    expect(rendered.result.current.prop).toBe('value');
    expect(rendered.result.current.a).toBeUndefined();
    expect(rendered.result.current.b).toBeUndefined();
    expect(rendered.result.current.content).toBe('value::undefined::undefined');

    act(() => {
      subject.observableProp = 'nextvalue';
    });

    expect(rendered.result.current.prop).toBe('nextvalue');
    expect(rendered.result.current.a).toBeUndefined();
    expect(rendered.result.current.b).toBeUndefined();
    expect(rendered.result.current.content).toBe(
      'nextvalue::undefined::undefined',
    );

    act(() => {
      subject.set({ a: 4 });
    });

    expect(rendered.result.current.prop).toBe('nextvalue');
    expect(rendered.result.current.a).toBe(4);
    expect(rendered.result.current.b).toBeUndefined();
    expect(rendered.result.current.content).toBe('nextvalue::4::undefined');

    rendered.unmount();

    act(() => {
      subject.set({ b: 'defined' });
    });

    expect(rendered.result.current.prop).toBe('nextvalue');
    expect(rendered.result.current.a).toBe(4);
    expect(rendered.result.current.b).toBeUndefined();
    expect(rendered.result.current.content).toBe('nextvalue::4::undefined');
  });
});
