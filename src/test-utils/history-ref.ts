import type { History } from 'history';
import { createMemoryHistory } from 'history';
import type { MutableRefObject } from 'react';

const historyRef: MutableRefObject<History> = {
  current: createMemoryHistory({
    initialEntries: ['/'],
    initialIndex: 0,
  }),
};

beforeEach((): void => {
  historyRef.current = createMemoryHistory();
});

export default historyRef;
