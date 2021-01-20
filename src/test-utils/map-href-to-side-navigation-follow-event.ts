import { SideNavigationProps } from '@awsui/components-react/side-navigation';

const TEST_TEXT = 'test text';

export default function mapHrefToSideNavigationFollowEvent(
  href: string,
  external = false,
): CustomEvent<SideNavigationProps.FollowDetail> {
  return new CustomEvent('', {
    detail: {
      external,
      href,
      text: TEST_TEXT,
    },
  });
}
