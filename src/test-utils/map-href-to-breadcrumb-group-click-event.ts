import { BreadcrumbGroupProps } from '@awsui/components-react/breadcrumb-group';

const TEST_TEXT = 'test text';

export default function mapHrefToBreadcrumbGroupClickEvent(
  href: string,
): CustomEvent<BreadcrumbGroupProps.ClickDetail> {
  return new CustomEvent('', {
    detail: {
      href,
      item: {
        href,
        text: TEST_TEXT,
      },
      text: TEST_TEXT,
    },
  });
}
