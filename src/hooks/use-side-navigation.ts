import type { SideNavigationProps } from '@awsui/components-react/side-navigation';
import { useCallback } from 'react';
import { useHistory } from 'react-router';

export interface State {
  readonly activeHref: string;
  readonly handleFollow: (
    event: Readonly<CustomEvent<Readonly<SideNavigationProps.FollowDetail>>>,
  ) => void;
}

export default function useSideNavigation(): State {
  const history = useHistory();

  const { hash, pathname, search } = history.location;
  return {
    activeHref: `${pathname}${search}${hash}`,

    handleFollow: useCallback(
      (
        e: Readonly<CustomEvent<Readonly<SideNavigationProps.FollowDetail>>>,
      ): void => {
        if (e.detail.external === true) {
          return;
        }
        e.preventDefault();
        history.push(e.detail.href);
      },
      [history],
    ),
  };
}
