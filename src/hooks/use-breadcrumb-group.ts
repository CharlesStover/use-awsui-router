import type { BreadcrumbGroupProps } from '@awsui/components-react/breadcrumb-group';
import { useCallback } from 'react';
import { useHistory } from 'react-router';

export interface State<
  Item extends BreadcrumbGroupProps.Item = BreadcrumbGroupProps.Item,
> {
  readonly handleFollow: (
    event: Readonly<
      CustomEvent<Readonly<BreadcrumbGroupProps.ClickDetail<Item>>>
    >,
  ) => void;
}

export default function useBreadcrumbGroup<
  Item extends BreadcrumbGroupProps.Item = BreadcrumbGroupProps.Item,
>(): State<Item> {
  const history = useHistory();

  return {
    handleFollow: useCallback(
      (
        e: Readonly<
          CustomEvent<Readonly<BreadcrumbGroupProps.ClickDetail<Item>>>
        >,
      ): void => {
        e.preventDefault();
        history.push(e.detail.href);
      },
      [history],
    ),
  };
}
