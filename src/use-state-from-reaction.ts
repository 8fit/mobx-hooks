import { useState, useMemo } from 'react';
import { comparer, toJS, IReactionPublic } from 'mobx';

import { StateFromReactionOptions } from './types';
import useReaction from './use-reaction';

const valueConverter: {
  [key in NonNullable<StateFromReactionOptions<unknown>['convertToJs']>]: <T>(
    value: T,
  ) => T;
} = {
  recurse: <T>(value: T) => toJS(value, { recurseEverything: true }),
  shallow: toJS,
  never: value => value,
};

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
    convertToJs = 'recurse',
    stateEquals = comparer.structural,
    reactionOptions = { fireImmediately: false },
  }: StateFromReactionOptions<T> = {},
) => {
  const convert = useMemo(() => valueConverter[convertToJs], [convertToJs]);
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
