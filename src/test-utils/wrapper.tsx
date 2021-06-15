import type { PropsWithChildren, ReactElement } from 'react';
import { Router } from 'react-router';
import historyRef from './history-ref';

export default function wrapper({
  children,
}: Readonly<PropsWithChildren<unknown>>): ReactElement {
  return <Router history={historyRef.current}>{children}</Router>;
}
