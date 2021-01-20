import { NonCancelableCustomEvent } from '@awsui/components-react/internal/events';
import { TabsProps } from '@awsui/components-react/tabs';
import {
  MutableRefObject,
  useCallback,
  useEffect,
  useMemo,
  useRef,
} from 'react';
import { useHistory, useLocation } from 'react-router';
import RunnableTabFinder from '../utils/runnable-tab-finder';

export interface Props {
  defaultActiveTabId?: string;
  tabs?: TabsProps['tabs'];
}

export interface State {
  activeTabId: TabsProps['activeTabId'];
  handleChange: Required<TabsProps>['onChange'];
  ref: MutableRefObject<HTMLDivElement | null>;
}

const DEFAULT_PROPS: Props = Object.freeze(Object.create(null));
const DEFAULT_TABS: TabsProps['tabs'] = Object.freeze([]);

export default function useReactRouterTabs(
  props: Props = DEFAULT_PROPS,
): State {
  const { defaultActiveTabId, tabs = DEFAULT_TABS } = props;

  const history = useHistory();
  const { hash, pathname, search } = useLocation();

  const ref: MutableRefObject<HTMLDivElement | null> = useRef<HTMLDivElement>(
    null,
  );

  const currentTab: TabsProps.Tab | undefined = useMemo(():
    | TabsProps.Tab
    | undefined => {
    const tabFinder: RunnableTabFinder = new RunnableTabFinder()
      .setHash(hash)
      .setPathname(pathname)
      .setSearch(search);
    return tabs.find(tabFinder.run);
  }, [hash, pathname, search, tabs]);

  const isCurrentTab: boolean = typeof currentTab !== 'undefined';
  useEffect((): void => {
    if (isCurrentTab && ref.current) {
      ref.current.scrollIntoView();
    }
  }, [hash, isCurrentTab]);

  return {
    activeTabId: currentTab?.id || defaultActiveTabId,
    handleChange: useCallback(
      (e: NonCancelableCustomEvent<TabsProps.ChangeDetail>): void => {
        if (e.detail.activeTabHref) {
          history.push(e.detail.activeTabHref);
        }
      },
      [history],
    ),
    ref,
  };
}
