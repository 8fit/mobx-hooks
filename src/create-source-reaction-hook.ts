import { useMemo, useCallback } from 'react';

import { Options, SelectorFromSource } from './types';
import useReaction from './use-reaction';

const attachSourceToSelector = <S, T>(
  source: S,
  selector: SelectorFromSource<S, T>,
) => selector(source);

const createSourceReactionHook = <S>(source: S) => <T>(
  selectorFromSource: SelectorFromSource<S, T>,
  options?: Options<T>,
) => {
  const selector = useMemo(
    () => attachSourceToSelector(source, selectorFromSource),
    [selectorFromSource],
  );
  const state = useReaction(selector, options);
  const withSource = useCallback(
    <R>(handler: (source: S) => R) => handler(source),
    [],
  );

  return [state, withSource] as const;
};

export default createSourceReactionHook;
