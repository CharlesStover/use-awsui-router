import historyRef from '../test-utils/history-ref';

export default function setHref(href: string): void {
  historyRef.current.push(href);
}
