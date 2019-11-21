import { useState, useEffect } from 'react';
import { toJS, reaction } from 'mobx';
import { isEqual } from 'lodash/fp';

// By default, toJS wont convert observables inside non-observables.
const deepToJs = (item: unknown) => toJS(item, { recurseEverything: true });

// TODO: find a way to type internals properly [@kavsingh]
/* eslint-disable @typescript-eslint/no-explicit-any */
const useReactiveProps = <T>(propsMap: { [K in keyof T]: () => T[K] }) => {
  const [state, setState] = useState<{ [K in keyof T]: T[K] }>(
    Object.entries(propsMap).reduce(
      (acc, [key, expression]: [unknown, any]) => {
        acc[key as keyof T] = deepToJs(expression()) as any;

        return acc;
      },
      {} as { [K in keyof T]: T[K] },
    ),
  );

  useEffect(() => {
    const disposers = Object.entries(propsMap).map(
      ([key, expression]: [unknown, any]) =>
        reaction(
          expression,
          value => {
            setState(current => {
              const nextValue = deepToJs(value);

              return isEqual(current[key as keyof T], nextValue)
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
  }, [propsMap]);

  return state;
};
/* eslint-enable */

export default useReactiveProps;
