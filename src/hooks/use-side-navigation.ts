import { SideNavigationProps } from '@awsui/components-react/side-navigation';
import { useCallback } from 'react';
import { useHistory, useLocation } from 'react-router';

export interface State {
  activeHref: string;
  handleFollow: Required<SideNavigationProps>['onFollow'];
}

export default function useSideNavigation(): State {
  const history = useHistory();
  const { hash, pathname, search } = useLocation();

  return {
    activeHref: `${pathname}${search}${hash}`,
    handleFollow: useCallback(
      (e: CustomEvent<SideNavigationProps.FollowDetail>): void => {
        if (e.detail.external) {
          return;
        }
        e.preventDefault();
        history.push(e.detail.href);
      },
      [history],
    ),
  };
}
