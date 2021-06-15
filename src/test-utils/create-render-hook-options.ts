import type { RenderHookOptions } from '@testing-library/react-hooks';
import wrapper from '../test-utils/wrapper';

export default function createRenderHookOptions<Props>(
  options?: RenderHookOptions<Props>,
): RenderHookOptions<Props> {
  return {
    ...options,
    wrapper,
  };
}
