import type { SideNavigationProps } from '@awsui/components-react/side-navigation';
import { useCallback } from 'react';
import type { NavigateFunction } from 'react-router';
import { useLocation, useNavigate } from 'react-router';

export interface State {
  readonly activeHref: string;
  readonly handleFollow: (
    event: Readonly<CustomEvent<Readonly<SideNavigationProps.FollowDetail>>>,
  ) => void;
}

export default function useSideNavigation(): State {
  // Contexts
  const { hash, pathname, search } = useLocation();
  const navigate: NavigateFunction = useNavigate();

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
        navigate(e.detail.href);
      },
      [navigate],
    ),
  };
}
