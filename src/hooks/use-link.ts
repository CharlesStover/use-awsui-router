import type { LinkProps } from '@awsui/components-react/link';
import { useCallback } from 'react';
import { useHistory } from 'react-router';

export interface State {
  handleFollow: Required<LinkProps>['onFollow'];
}

export default function useLink(): State {
  const history = useHistory();

  return {
    handleFollow: useCallback(
      (e: Readonly<CustomEvent<Readonly<LinkProps.FollowDetail>>>): void => {
        if (
          e.detail.external === true ||
          typeof e.detail.href === 'undefined'
        ) {
          return;
        }

        e.preventDefault();
        history.push(e.detail.href);
      },
      [history],
    ),
  };
}
