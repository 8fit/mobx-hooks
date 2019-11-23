import { useCallback } from 'react';

import { Options } from './types';
import useReaction from './use-reaction';

const createSourceReactionHook = <S>(source: S) => <T>(
  selectorFromSource: (source: S) => T,
  options?: Options<T>,
) => {
  const selector = useCallback(() => selectorFromSource(source), [
    selectorFromSource,
  ]);
  const state = useReaction(selector, options);
  const withSource = useCallback(
    <R>(handler: (source: S) => R) => handler(source),
    [],
  );

  return [state, withSource] as const;
};

export default createSourceReactionHook;
