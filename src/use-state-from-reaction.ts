import { useState } from 'react';
import { comparer, IReactionPublic } from 'mobx';

import { StateFromReactionOptions } from './types';
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
 * @param options state from reaction options
 */
const useStateFromReaction = <T>(
  expression: (reactionObject?: IReactionPublic) => T,
  {
    stateToJS,
    stateEquals = comparer.structural,
    reactionOptions = { fireImmediately: false },
  }: StateFromReactionOptions<T> = {},
) => {
  const [state, setState] = useState(
    stateToJS ? stateToJS(expression()) : expression(),
  );

  useReaction(
    reactionObject => expression(reactionObject),
    value => {
      const next = stateToJS ? stateToJS(value) : value;

      setState(current => (stateEquals(current, next) ? current : next));
    },
    reactionOptions,
  );

  return state;
};

export default useStateFromReaction;
