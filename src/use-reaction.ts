import { useState, useEffect } from 'react';
import { toJS, reaction, comparer } from 'mobx';

import { Options } from './types';

const useReaction = <T>(
  selector: () => T,
  { jsConvert = true, stateComparer = comparer.structural }: Options<T> = {},
) => {
  const [state, setState] = useState(jsConvert ? toJS(selector()) : selector());

  useEffect(() => {
    const disposer = reaction(selector, value => {
      const next = jsConvert ? toJS(value) : value;

      setState(current => (stateComparer(current, next) ? current : value));
    });

    return disposer;
  }, [jsConvert, selector, stateComparer]);

  return state;
};

export default useReaction;
