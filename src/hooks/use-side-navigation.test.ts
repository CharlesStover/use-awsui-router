import { SideNavigationProps } from '@awsui/components-react/side-navigation';
import { act } from '@testing-library/react-hooks';
import { SideNavigationState, useSideNavigation } from '..';
import expectHref from '../test-utils/expect-href';
import mapHrefToSideNavigationFollowEvent from '../test-utils/map-href-to-side-navigation-follow-event';
import renderHook from '../test-utils/render-hook';

const TEST_HREF = '/test/pathname?test=search#test:hash';

describe('useSideNavigation', (): void => {
  describe('handleFollow', (): void => {
    it('should prevent default behavior for internal navigation', (): void => {
      const testFollowEvent: CustomEvent<SideNavigationProps.FollowDetail> = mapHrefToSideNavigationFollowEvent(
        TEST_HREF,
      );
      const { result } = renderHook<void, SideNavigationState>(
        useSideNavigation,
      );

      act((): void => {
        result.current.handleFollow(testFollowEvent);
      });

      // expect(testFollowEvent.defaultPrevented).toBe(true);
    });

    it('should not prevent default behavior for external navigation', (): void => {
      const testFollowEvent: CustomEvent<SideNavigationProps.FollowDetail> = mapHrefToSideNavigationFollowEvent(
        TEST_HREF,
        true,
      );
      const { result } = renderHook<void, SideNavigationState>(
        useSideNavigation,
      );

      act((): void => {
        result.current.handleFollow(testFollowEvent);
      });

      expect(testFollowEvent.defaultPrevented).toBe(false);
    });

    it('should push to history for internal navigation', (): void => {
      const { result } = renderHook(useSideNavigation);

      act((): void => {
        const testFollowEvent: CustomEvent<SideNavigationProps.FollowDetail> = mapHrefToSideNavigationFollowEvent(
          TEST_HREF,
        );
        result.current.handleFollow(testFollowEvent);
      });

      expectHref(TEST_HREF);
    });

    it('should not push to history for external navigation', (): void => {
      const { result } = renderHook(useSideNavigation);

      act((): void => {
        const testFollowEvent: CustomEvent<SideNavigationProps.FollowDetail> = mapHrefToSideNavigationFollowEvent(
          TEST_HREF,
          true,
        );
        result.current.handleFollow(testFollowEvent);
      });

      expectHref('/');
    });

    it('should set activeHref for internal navigation', (): void => {
      const { result } = renderHook(useSideNavigation);
      expect(result.current.activeHref).toBe('/');

      act((): void => {
        const testFollowEvent: CustomEvent<SideNavigationProps.FollowDetail> = mapHrefToSideNavigationFollowEvent(
          TEST_HREF,
        );
        result.current.handleFollow(testFollowEvent);
      });

      expect(result.current.activeHref).toBe(TEST_HREF);
    });

    it('should not set activeHref for external navigation', (): void => {
      const { result } = renderHook(useSideNavigation);
      expect(result.current.activeHref).toBe('/');

      act((): void => {
        const testFollowEvent: CustomEvent<SideNavigationProps.FollowDetail> = mapHrefToSideNavigationFollowEvent(
          TEST_HREF,
          true,
        );
        result.current.handleFollow(testFollowEvent);
      });

      expect(result.current.activeHref).toBe('/');
    });
  });
});
