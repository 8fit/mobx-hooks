import useReactiveProps from './use-reactive-props';
import createReactivePropsHookFrom from './create-reactive-props-hook-from';
import { Options, EqualityComp } from './types';

export type HookOptions<T> = Options<T>;
export type EqualityComparator<T> = EqualityComp<T>;
export { useReactiveProps, createReactivePropsHookFrom };
