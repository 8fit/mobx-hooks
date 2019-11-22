import { useState, useEffect } from 'react';
import { toJS, reaction, comparer } from 'mobx';

import { Options, Selector } from './types';

const consumeInitialStateFromSelector = <T>(
  selector: Selector<T>,
  convert: boolean,
) => (convert ? toJS(selector()) : selector());

const useReaction = <T>(
  selector: Selector<T>,
  { jsConvert = true, stateComparer = comparer.structural }: Options<T> = {},
) => {
  const [state, setState] = useState<T>(
    consumeInitialStateFromSelector<T>(selector, jsConvert),
  );

  useEffect(() => {
    const disposer = reaction(selector, value => {
      const nextValue = jsConvert ? toJS(value) : value;

      setState(current =>
        stateComparer(current, nextValue) ? current : value,
      );
    });

    return disposer;
  }, [jsConvert, selector, stateComparer]);

  return state;
};

export default useReaction;
