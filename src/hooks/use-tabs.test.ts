import { NonCancelableCustomEvent } from '@awsui/components-react/internal/events';
import { TabsProps } from '@awsui/components-react/tabs';
import { act } from '@testing-library/react-hooks';
import { useTabs } from '..';
import setHref from '../test-utils/set-href';
import expectHref from '../test-utils/expect-href';
import mapHrefToTabsChangeEvent from '../test-utils/map-href-to-tabs-change-event';
import renderHook from '../test-utils/render-hook';

const TEST_HREF = '/test/pathname?test=search#test:hash';
const TEST_ID = 'test-id';
const TEST_LABEL = 'Test label';

describe('useTabs', (): void => {
  it('should scroll into view', (): void => {
    const MOCK_SCROLL_INTO_VIEW = jest.fn();
    const MOCK_DIV: HTMLDivElement = document.createElement('div');
    MOCK_DIV.scrollIntoView = MOCK_SCROLL_INTO_VIEW;
    const { result } = renderHook(useTabs, {
      initialProps: {
        tabs: [
          {
            href: TEST_HREF,
            id: TEST_ID,
            label: TEST_LABEL,
          },
        ],
      },
    });
    result.current.ref.current = MOCK_DIV;
    act((): void => {
      setHref(TEST_HREF);
    });
    expect(MOCK_SCROLL_INTO_VIEW).toHaveBeenCalledTimes(1);
  });

  describe('activeTabId', (): void => {
    it('should be any matching tab ID', (): void => {
      setHref(TEST_HREF);

      const { result } = renderHook(useTabs, {
        initialProps: {
          tabs: [
            {
              href: TEST_HREF,
              id: TEST_ID,
              label: TEST_LABEL,
            },
          ],
        },
      });

      expect(result.current.activeTabId).toBe(TEST_ID);
    });

    it('should be defaultActiveTabId', (): void => {
      const { result } = renderHook(useTabs, {
        initialProps: {
          defaultActiveTabId: TEST_ID,
        },
      });

      expect(result.current.activeTabId).toBe(TEST_ID);
    });
  });

  describe('handleChange', (): void => {
    it('should push to history if href is present', (): void => {
      const { result } = renderHook(useTabs);

      act((): void => {
        const testChangeEvent: NonCancelableCustomEvent<TabsProps.ChangeDetail> = mapHrefToTabsChangeEvent(
          TEST_HREF,
        );
        result.current.handleChange(testChangeEvent);
      });

      expectHref(TEST_HREF);
    });

    it('should not push to history if href is not present', (): void => {
      const { result } = renderHook(useTabs);

      act((): void => {
        const testChangeEvent: NonCancelableCustomEvent<TabsProps.ChangeDetail> = mapHrefToTabsChangeEvent();
        result.current.handleChange(testChangeEvent);
      });

      expectHref('/');
    });
  });
});
