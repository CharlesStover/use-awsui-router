import type { NonCancelableCustomEvent } from '@awsui/components-react/interfaces';
import type { TabsProps } from '@awsui/components-react/tabs';
import type { MutableRefObject } from 'react';
import { useCallback, useEffect, useMemo, useRef } from 'react';
import { useHistory } from 'react-router';
import RunnableTabFinder from '../utils/runnable-tab-finder';

export interface Props {
  readonly defaultActiveTabId?: string | undefined;
  readonly tabs?: readonly TabsProps.Tab[] | undefined;
}

export interface State {
  readonly activeTabId: TabsProps['activeTabId'];
  readonly ref: MutableRefObject<HTMLDivElement | null>;
  readonly handleChange: (
    event: Readonly<NonCancelableCustomEvent<Readonly<TabsProps.ChangeDetail>>>,
  ) => void;
}

const DEFAULT_PROPS: Props = Object.freeze({});
const DEFAULT_TABS: TabsProps['tabs'] = Object.freeze([]);

export default function useReactRouterTabs(
  props: Props = DEFAULT_PROPS,
): State {
  const { defaultActiveTabId, tabs = DEFAULT_TABS } = props;

  // Contexts
  const history = useHistory();
  const { hash, pathname, search } = history.location;

  // States
  const currentTab: TabsProps.Tab | undefined = useMemo(():
    | TabsProps.Tab
    | undefined => {
    const tabFinder: RunnableTabFinder = new RunnableTabFinder()
      .setHash(hash)
      .setPathname(pathname)
      .setSearch(search);
    return tabs.find(tabFinder.run.bind(tabFinder));
  }, [hash, pathname, search, tabs]);

  const ref: MutableRefObject<HTMLDivElement | null> =
    useRef<HTMLDivElement>(null);

  useEffect((): void => {
    if (typeof currentTab === 'undefined' || ref.current === null) {
      return;
    }
    ref.current.scrollIntoView();
  }, [currentTab]);

  return {
    ref,

    activeTabId:
      typeof currentTab === 'undefined' ? defaultActiveTabId : currentTab.id,

    handleChange: useCallback(
      (
        e: Readonly<NonCancelableCustomEvent<Readonly<TabsProps.ChangeDetail>>>,
      ): void => {
        if (typeof e.detail.activeTabHref === 'undefined') {
          return;
        }
        history.push(e.detail.activeTabHref);
      },
      [history],
    ),
  };
}
