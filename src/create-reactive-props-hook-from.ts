import { useMemo, useCallback } from 'react';

import { Options, PropsMapWithSource, PropsMap } from './types';
import useReactiveProps from './use-reactive-props';

// TODO: find a way to type internals properly [@kavsingh]
/* eslint-disable @typescript-eslint/no-explicit-any */
const attachSourceToPropsMap = <S, T>(
  source: S,
  propsMap: PropsMapWithSource<S, T>,
) =>
  Object.entries(propsMap).reduce((acc, [key, expression]: [unknown, any]) => {
    acc[key as keyof T] = () => expression(source);
    return acc;
  }, {} as PropsMap<T>);

const createReactivePropsHookFrom = <S>(source: S) => <T>(
  propsMap: PropsMapWithSource<S, T>,
  options?: Options<T>,
) => {
  const reactivePropsMap = useMemo(
    () => attachSourceToPropsMap(source, propsMap),
    [propsMap],
  );
  const state = useReactiveProps(reactivePropsMap, options);
  const withSource = useCallback(
    <R>(handler: (source: S) => R) => handler(source),
    [],
  );

  return [state, withSource] as const;
};
/* eslint-enable */

export default createReactivePropsHookFrom;
