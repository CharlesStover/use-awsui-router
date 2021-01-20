import historyRef from '../test-utils/history-ref';

export default function expectHref(href: string): void {
  const { hash, pathname, search } = historyRef.current.location;
  expect(`${pathname}${search}${hash}`).toBe(href);
}
