import { IEqualsComparer, IReactionOptions } from 'mobx';

/**
 * Options for converting reaction values to state
 */
export interface StateFromReactionOptions<T> {
  // Should state values be converted from mobx observable to plain JS
  convertToJs?: 'recurse' | 'shallow' | 'never';
  // Comparator function to determine if state has changed
  stateEquals?: IEqualsComparer<T>;
  // Options passed along to the internal mobx reaction
  reactionOptions?: IReactionOptions;
}
