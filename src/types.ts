import { IEqualsComparer, IReactionOptions } from 'mobx';

/**
 * Options for converting reaction values to state
 */
export interface StateFromReactionOptions<T> {
  // JS convert function to run on expression return values before storing in state.
  // Useful if you want to the returned state to be pojos, for example.
  stateToJS?: (result: T) => T;
  // Comparator function to determine if state has changed
  stateEquals?: IEqualsComparer<T>;
  // Options passed along to the internal mobx reaction
  reactionOptions?: IReactionOptions;
}
