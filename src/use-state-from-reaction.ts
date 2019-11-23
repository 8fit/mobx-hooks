import { useState } from 'react';
import { comparer, toJS, IReactionPublic } from 'mobx';

import { ReactionToStateOptions } from './types';
import useReaction from './use-reaction';

/**
 * Use a mobx reaction to generate returned state which responds to observable changes
 *
 * @example
 * useStateFromReaction(() => ({ a: observable.a, b: otherObservable.b }))
 * // returns a state object { a: typeof observable.a, b: typeof otherObservable.b }
 * @example
 * useStateFromReaction(() => observable.a + observable.b)
 * // returns a state value typeof (observable.a + observable.b)
 *
 * @param expression mobx reaction expression (note: reaction object is not passed in initial state setup)
 * @param options state update options
 */
const useStateFromReaction = <T>(
  expression: (reactionObject?: IReactionPublic) => T,
  {
    convertToJs = true,
    stateEquals = comparer.structural,
    reactionOptions = { fireImmediately: false },
  }: ReactionToStateOptions<T> = {},
) => {
  const [state, setState] = useState(
    convertToJs ? toJS(expression()) : expression(),
  );

  useReaction(
    reactionObject => expression(reactionObject),
    value => {
      const nextValue = convertToJs ? toJS(value) : value;

      setState(current => (stateEquals(current, nextValue) ? current : value));
    },
    reactionOptions,
  );

  return state;
};

export default useStateFromReaction;
