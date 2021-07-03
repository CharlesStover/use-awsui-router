import type { PropertyFilterProps } from '@awsui/components-react/property-filter';
import { act } from '@testing-library/react-hooks';
import { usePropertyFilter } from '..';
import expectHref from '../test-utils/expect-href';
import renderHook from '../test-utils/render-hook';
import setHref from '../test-utils/set-href';

describe('usePropertyFilter', (): void => {
  describe('handleChange', (): void => {
    it('should set operation', (): void => {
      const { result } = renderHook(usePropertyFilter);

      act((): void => {
        result.current.handleChange(
          new CustomEvent<PropertyFilterProps.Query>('', {
            detail: {
              operation: 'or',
              tokens: [],
            },
          }),
        );
      });

      expect(result.current.operation).toBe('or');
      expect(result.current.query.operation).toBe('or');
    });

    it('should set tokens', (): void => {
      const { result } = renderHook(usePropertyFilter);

      act((): void => {
        result.current.handleChange(
          new CustomEvent<PropertyFilterProps.Query>('', {
            detail: {
              operation: 'or',
              tokens: [
                {
                  operator: '=',
                  propertyKey: 'foo',
                  value: 'bar',
                },
                {
                  operator: '!=',
                  propertyKey: 'bar',
                  value: 'baz',
                },
                {
                  operator: '=',
                  value: 'test',
                },
              ],
            },
          }),
        );
      });

      expectHref('/?foo=bar&bar=%21%3Dbaz');
    });

    it('should set only property keys in search', (): void => {
      setHref('/?foo=test1&baz=test2');
      const { result } = renderHook(usePropertyFilter, {
        initialProps: {
          delimiter: '|',
          propertyKeys: ['foo', 'bar'],
        },
      });

      act((): void => {
        result.current.handleChange(
          new CustomEvent<PropertyFilterProps.Query>('', {
            detail: {
              operation: 'or',
              tokens: [
                {
                  operator: '=',
                  propertyKey: 'foo',
                  value: 'bar',
                },
                {
                  operator: '!=',
                  propertyKey: 'bar',
                  value: 'baz',
                },
                {
                  operator: '!=',
                  propertyKey: 'bar',
                  value: 'quaz',
                },
                {
                  operator: '=',
                  value: 'hello-world',
                },
              ],
            },
          }),
        );
      });

      expectHref('/?baz=test2&foo=bar&bar=%21%3Dbaz%7C%21%3Dquaz');
    });
  });

  describe('operation', (): void => {
    it('should default to and', (): void => {
      const { result } = renderHook(usePropertyFilter);
      expect(result.current.operation).toBe('and');
      expect(result.current.query.operation).toBe('and');
    });

    it('should default to defaultOperation', (): void => {
      const { result } = renderHook(usePropertyFilter, {
        initialProps: {
          defaultOperation: 'or',
        },
      });

      expect(result.current.operation).toBe('or');
      expect(result.current.query.operation).toBe('or');
    });
  });

  describe('query', (): void => {
    describe('tokens', (): void => {
      it('should contain search params', (): void => {
        setHref('/?quaz=1&wex=%21%3D2%2C%21%3D3&exort=4');

        const { result } = renderHook(usePropertyFilter);

        expect(result.current.query.tokens).toEqual([
          {
            operator: '=',
            propertyKey: 'quaz',
            value: '1',
          },
          {
            operator: '!=',
            propertyKey: 'wex',
            value: '2',
          },
          {
            operator: '!=',
            propertyKey: 'wex',
            value: '3',
          },
          {
            operator: '=',
            propertyKey: 'exort',
            value: '4',
          },
        ]);
      });
    });

    it('should contain property keys', (): void => {
      setHref('/?wex=%21%3D2%2C%21%3D3&exort=4');

      const { result } = renderHook(usePropertyFilter, {
        initialProps: {
          propertyKeys: ['quaz', 'wex'],
        },
      });

      expect(result.current.query.tokens).toEqual([
        {
          operator: '!=',
          propertyKey: 'wex',
          value: '2',
        },
        {
          operator: '!=',
          propertyKey: 'wex',
          value: '3',
        },
      ]);
    });
  });

  describe('setOperation', (): void => {
    it('should set operation', (): void => {
      const { result } = renderHook(usePropertyFilter);
      expect(result.current.operation).toBe('and');
      expect(result.current.query.operation).toBe('and');

      act((): void => {
        result.current.setOperation('or');
      });

      expect(result.current.operation).toBe('or');
      expect(result.current.query.operation).toBe('or');
    });
  });
});
