import { useCallback } from 'react';
import { IReactionPublic, IReactionOptions } from 'mobx';

import useReaction from './use-reaction';

/**
 * Attach a source object for setting up an auto disposed mobx reaction
 *
 * @example
 * const useStoreReaction = createSourceReactionHook(new Store())
 * useStoreReaction(store => store.account.locale, locale => (cache.invalidate(locale !== 'en')))
 * // will run effect whenever store.account.locale changes
 *
 * @param source source object containing observables
 * @returns useReaction hook
 */
const createSourceReactionHook = <S>(source: S) => <T>(
  expressionFromSource: (source: S, reactionObject: IReactionPublic) => T,
  effect: (arg: T, reactionObject: IReactionPublic) => void,
  options?: IReactionOptions,
) => {
  const expression = useCallback(
    (reactionObject: IReactionPublic) =>
      expressionFromSource(source, reactionObject),
    [expressionFromSource],
  );

  useReaction(expression, effect, options);
};

export default createSourceReactionHook;
