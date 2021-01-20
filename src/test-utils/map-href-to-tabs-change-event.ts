import { NonCancelableCustomEvent } from '@awsui/components-react/internal/events';
import { TabsProps } from '@awsui/components-react/tabs';

export default function mapHrefToTabsChangeEvent(
  href?: string,
): NonCancelableCustomEvent<TabsProps.ChangeDetail> {
  return new CustomEvent('', {
    detail: {
      activeTabHref: href,
      activeTabId: 'test-active-tab-id',
    },
  });
}
