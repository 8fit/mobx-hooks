import { useState } from 'react';
import { comparer, toJS, IReactionPublic } from 'mobx';

import { StateFromReactionOptions } from './types';
import useReaction from './use-reaction';

/**
 * Use a mobx reaction to generate returned state which responds to observable changes
 *
 * Note: By default, resulting values will be recursed to plain js using { recursveEverything: true }
 * in mobx#toJS options. To change this, use the options param with
 * {
 *   toJsOptions: { recurseEverything: false },
 * }
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
  options: StateFromReactionOptions<T> = {},
) => {
  const {
    stateEquals = comparer.structural,
    toJSOptions = { recurseEverything: true },
    reactionOptions = { fireImmediately: false },
  } = options;
  const convert = (value: T) => toJS(value, toJSOptions);
  const [state, setState] = useState(convert(expression()));

  useReaction(
    reactionObject => expression(reactionObject),
    value => {
      const next = convert(value);

      setState(current => (stateEquals(current, next) ? current : next));
    },
    reactionOptions,
  );

  return state;
};

export default useStateFromReaction;
