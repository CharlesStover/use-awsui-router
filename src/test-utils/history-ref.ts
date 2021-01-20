import { History, createMemoryHistory } from 'history';
import { MutableRefObject } from 'react';

const historyRef: MutableRefObject<History<unknown>> = {
  current: createMemoryHistory(),
};

beforeEach((): void => {
  historyRef.current = createMemoryHistory();
});

export default historyRef;
