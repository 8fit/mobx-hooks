import { useState, useEffect } from 'react';
import { toJS, reaction } from 'mobx';

import { Options, PropsMap } from './types';
import { valueEq } from './util';

// TODO: find a way to type internals properly [@kavsingh]
/* eslint-disable @typescript-eslint/no-explicit-any */
const mapPropsMapToInitialState = <T>(propsMap: PropsMap<T>) =>
  Object.entries(propsMap).reduce((acc, [key, expression]: [unknown, any]) => {
    acc[key as keyof T] = toJS(expression()) as any;

    return acc;
  }, {} as T);

const useReactiveProps = <T>(
  propsMap: PropsMap<T>,
  { equalityComparator = valueEq }: Options<T> = {},
) => {
  const [state, setState] = useState<T>(mapPropsMapToInitialState<T>(propsMap));

  useEffect(() => {
    const disposers = Object.entries(propsMap).map(
      ([key, expression]: [unknown, any]) =>
        reaction(expression, value => {
          setState(current => {
            const nextValue = toJS(value);

            return equalityComparator(
              current[key as keyof T],
              nextValue as T[keyof T],
              key as keyof T,
            )
              ? current
              : { ...current, [key as keyof T]: nextValue };
          });
        }),
    );

    return () => {
      disposers.forEach(disposer => disposer());
    };
  }, [equalityComparator, propsMap]);

  return state;
};
/* eslint-enable */

export default useReactiveProps;
