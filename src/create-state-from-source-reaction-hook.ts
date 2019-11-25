import { useCallback } from 'react';
import { IReactionPublic } from 'mobx';

import { StateFromReactionOptions } from './types';
import useStateFromReaction from './use-state-from-reaction';

/**
 * Attach a source object for setting up state from a mobx reaction
 *
 * @example
 * const useStateFromStoreReaction = createStateFromSourceReactionHook(new Store())
 * const [state, withStore] = useStateFromStoreReaction(store => store.account.locale)
 * // state is typeof store.account.locale. withStore provides generic access to the data object
 * @example
 * const [state, withStore] = useStateFromStoreReaction(store => ({ store.account.isPro }))
 * const refresh = useCallback(() => withStore(store => store.account.refresh()), [withStore])
 * // state is { isPro: typeof store.account.isPro }
 * // withStore used to extend functionality of a hook
 * @param source object containing observables
 * @returns useStateFromReaction hook
 */
const createStateFromSourceReactionHook = <S>(source: S) => <T>(
  expressionFromSource: (source: S, reactionObject?: IReactionPublic) => T,
  options?: StateFromReactionOptions<T>,
) => {
  const expression = useCallback(
    (reactionObject?: IReactionPublic) =>
      expressionFromSource(source, reactionObject),
    [expressionFromSource],
  );
  const withData = useCallback(
    <R>(handler: (source: S) => R) => handler(source),
    [],
  );
  const state = useStateFromReaction(expression, options);

  return [state, withData] as const;
};

export default createStateFromSourceReactionHook;
