import type { BreadcrumbGroupProps } from '@awsui/components-react/breadcrumb-group';
import { useCallback } from 'react';
import type { NavigateFunction } from 'react-router';
import { useNavigate } from 'react-router';

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
  const navigate: NavigateFunction = useNavigate();

  return {
    handleFollow: useCallback(
      (
        e: Readonly<
          CustomEvent<Readonly<BreadcrumbGroupProps.ClickDetail<Item>>>
        >,
      ): void => {
        e.preventDefault();
        navigate(e.detail.href);
      },
      [navigate],
    ),
  };
}
