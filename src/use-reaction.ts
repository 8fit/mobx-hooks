import { useEffect } from 'react';
import { reaction, IReactionPublic, IReactionOptions } from 'mobx';

/**
 * Thin auto-disposing wrapper around a mobx reaction
 *
 * @param expression mobx reaction expression
 * @param effect mobx reaction effect
 * @param options mobx reaction options
 */
const useReaction = <T>(
  expression: (reactionObject: IReactionPublic) => T,
  effect: (arg: T, reactionObject: IReactionPublic) => void,
  options?: IReactionOptions,
) => {
  useEffect(() => {
    const disposer = reaction(expression, effect, options);

    return disposer;
  }, [effect, expression, options]);
};

export default useReaction;
