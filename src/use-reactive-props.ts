import { useState, useEffect } from 'react';
import { toJS, reaction } from 'mobx';
import { isEqual } from 'lodash/fp';

import { Options } from './types';

// By default, toJS wont convert observables inside non-observables.
const deepToJS = (item: unknown) => toJS(item, { recurseEverything: true });

type PropsMap<T> = { [K in keyof T]: () => T[K] };

// TODO: find a way to type internals properly [@kavsingh]
/* eslint-disable @typescript-eslint/no-explicit-any */
const mapPropsMapToInitialState = <T>(
  propsMap: PropsMap<T>,
  converter: typeof toJS | typeof deepToJS,
) =>
  Object.entries(propsMap).reduce((acc, [key, expression]: [unknown, any]) => {
    acc[key as keyof T] = converter(expression()) as any;

    return acc;
  }, {} as T);

const useReactiveProps = <T>(
  propsMap: PropsMap<T>,
  {
    deepJsConversion = true,
    equalityComparator = (value, nextValue) => isEqual(value, nextValue),
  }: Options<T> = {},
) => {
  const converter = deepJsConversion ? deepToJS : toJS;
  const [state, setState] = useState<T>(
    mapPropsMapToInitialState<T>(propsMap, converter),
  );

  useEffect(() => {
    const disposers = Object.entries(propsMap).map(
      ([key, expression]: [unknown, any]) =>
        reaction(
          expression,
          value => {
            setState(current => {
              const nextValue = converter(value);

              return equalityComparator(
                current[key as keyof T],
                nextValue as T[keyof T],
                key as keyof T,
              )
                ? current
                : { ...current, [key as keyof T]: nextValue };
            });
          },
          { fireImmediately: true },
        ),
    );

    return () => {
      disposers.forEach(disposer => disposer());
    };
  }, [converter, deepJsConversion, equalityComparator, propsMap]);

  return state;
};
/* eslint-enable */

export default useReactiveProps;
