import type { LinkProps } from '@awsui/components-react/link';
import { useCallback } from 'react';
import type { NavigateFunction } from 'react-router';
import { useNavigate } from 'react-router';

export interface State {
  readonly handleFollow: (
    event: Readonly<CustomEvent<Readonly<LinkProps.FollowDetail>>>,
  ) => void;
}

export default function useLink(): State {
  const navigate: NavigateFunction = useNavigate();

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
        navigate(e.detail.href);
      },
      [navigate],
    ),
  };
}
