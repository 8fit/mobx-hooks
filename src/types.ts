import { IEqualsComparer, IReactionOptions, toJS } from 'mobx';

/**
 * Options for converting reaction values to state
 */
export interface StateFromReactionOptions<T> {
  // Comparator function to determine if state has changed
  stateEquals?: IEqualsComparer<T>;
  // Options passed along to mobx toJS (allowing shallow recurse, etc)
  toJSOptions?: Parameters<typeof toJS>[1];
  // Options passed along to the internal mobx reaction
  reactionOptions?: IReactionOptions;
}
