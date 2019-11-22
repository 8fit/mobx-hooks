import { useMemo, useCallback } from 'react';

import { Options } from './types';
import useReactiveProps from './use-reactive-props';

// TODO: find a way to type internals properly [@kavsingh]
/* eslint-disable @typescript-eslint/no-explicit-any */
const attachSourceToPropsMap = <S, T>(
  source: S,
  propsMap: { [K in keyof T]: (source: S) => T[K] },
) =>
  Object.entries(propsMap).reduce((acc, [key, expression]: [unknown, any]) => {
    acc[key as keyof T] = () => expression(source);
    return acc;
  }, {} as { [K in keyof T]: () => T[K] });

const createReactivePropsHookFrom = <S>(source: S) => <T>(
  propsMap: { [K in keyof T]: (source: S) => T[K] },
  options?: Options<T>,
) => {
  const propsMapWithSource = useMemo(
    () => attachSourceToPropsMap(source, propsMap),
    [propsMap],
  );
  const state = useReactiveProps(propsMapWithSource, options);
  const withSource = useCallback(
    <H>(handler: (source: S) => H) => handler(source),
    [],
  );

  return [state, withSource] as const;
};

export default createReactivePropsHookFrom;
/* eslint-enable */
