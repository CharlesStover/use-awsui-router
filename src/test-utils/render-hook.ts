import {
  RenderHookOptions,
  RenderHookResult,
  renderHook as testingLibraryRenderHook,
} from '@testing-library/react-hooks';
import createRenderHookOptions from '../test-utils/create-render-hook-options';

export default function renderHook<Props, State>(
  useHook: (props: Props) => State,
  options?: RenderHookOptions<Props>,
): RenderHookResult<Props, State> {
  return testingLibraryRenderHook(useHook, createRenderHookOptions(options));
}
