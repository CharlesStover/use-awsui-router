import type { NonCancelableCustomEvent } from '@awsui/components-react/internal/events';
import type { PropertyFilterProps } from '@awsui/components-react/property-filter';
import type { SetStateAction } from 'react';
import { useHistory } from 'react-router';
import { useCallback, useMemo, useState } from 'react';
import filterByDefined from '../utils/filter-by-defined';
import mapSearchValueToTokenOperator from '../utils/map-search-value-to-token-operator';
import mapSearchValueToTokenValue from '../utils/map-search-value-to-token-value';
import mapUrlSearchParamsToKeys from '../utils/map-url-search-params-to-keys';

interface Props {
  readonly defaultOperation?: PropertyFilterProps.JoinOperation;
  readonly delimiter?: string;
  readonly propertyKeys?: string[];
}

interface ReadOnlyQuery
  extends Omit<PropertyFilterProps.Query, 'operation' | 'tokens'> {
  readonly operation: PropertyFilterProps.JoinOperation;
  readonly tokens: readonly Readonly<PropertyFilterProps.Token>[];
}

export interface State {
  readonly handleChange: Required<PropertyFilterProps>['onChange'];
  readonly operation: PropertyFilterProps.JoinOperation;
  readonly query: PropertyFilterProps.Query;
  readonly setOperation: (
    operation: SetStateAction<PropertyFilterProps.JoinOperation>,
  ) => void;
}

const DEFAULT_PROPS: Props = Object.freeze({});
const DEFAULT_PROPERTY_KEYS: readonly string[] = Object.freeze([]);
const EMPTY = 0;

export default function usePropertyFilter(props: Props = DEFAULT_PROPS): State {
  const {
    defaultOperation = 'and',
    delimiter = ',',
    propertyKeys = DEFAULT_PROPERTY_KEYS,
  } = props;

  // Contexts
  const history = useHistory();
  const { search } = history.location;

  // States
  const urlSearchParams: URLSearchParams = useMemo(
    (): URLSearchParams => new URLSearchParams(search),
    [search],
  );

  const tokenPropertyKeys: readonly string[] =
    useMemo((): readonly string[] => {
      if (propertyKeys.length === EMPTY) {
        return mapUrlSearchParamsToKeys(urlSearchParams);
      }
      return propertyKeys;
    }, [propertyKeys, urlSearchParams]);

  const [operation, setOperation] =
    useState<PropertyFilterProps.JoinOperation>(defaultOperation);

  return {
    operation,
    setOperation,

    handleChange: useCallback(
      (e: Readonly<NonCancelableCustomEvent<ReadOnlyQuery>>) => {
        setOperation(e.detail.operation);

        const getNewTokens = (): readonly PropertyFilterProps.Token[] => {
          if (propertyKeys.length === EMPTY) {
            return e.detail.tokens;
          }

          const filterByPropertyKeys = ({
            propertyKey,
          }: Readonly<PropertyFilterProps.Token>): boolean =>
            filterByDefined(propertyKey) && propertyKeys.includes(propertyKey);

          return e.detail.tokens.filter(filterByPropertyKeys);
        };

        const newTokens: readonly PropertyFilterProps.Token[] = getNewTokens();

        const newUrlSearchParams: URLSearchParams = new URLSearchParams(
          urlSearchParams,
        );

        // Delete old property keys.
        for (const propertyKey of tokenPropertyKeys) {
          newUrlSearchParams.delete(propertyKey);
        }

        // Add new property keys.
        for (const { operator, propertyKey, value } of newTokens) {
          if (typeof propertyKey === 'undefined') {
            continue;
          }

          const oldValue: string | null = newUrlSearchParams.get(propertyKey);
          const operatorStr: string = operator === '=' ? '' : operator;
          const newValues: string[] = [`${operatorStr}${value}`];
          if (oldValue !== null) {
            newValues.unshift(oldValue);
          }

          const newValue: string = newValues.join(delimiter);
          newUrlSearchParams.set(propertyKey, newValue);
        }

        const newSearch: string = newUrlSearchParams.toString();
        history.push({
          ...history.location,
          search: newSearch === '' ? '' : `?${newSearch}`,
        });
      },
      [delimiter, history, propertyKeys, tokenPropertyKeys, urlSearchParams],
    ),

    query: useMemo((): PropertyFilterProps.Query => {
      const tokens: PropertyFilterProps.Token[] = [];
      for (const propertyKey of tokenPropertyKeys) {
        const searchValue: string | null = urlSearchParams.get(propertyKey);
        if (searchValue === null) {
          continue;
        }

        const tokenSearchValues: readonly string[] =
          searchValue.split(delimiter);

        for (const tokenSearchValue of tokenSearchValues) {
          tokens.push({
            operator: mapSearchValueToTokenOperator(tokenSearchValue),
            propertyKey,
            value: mapSearchValueToTokenValue(tokenSearchValue),
          });
        }
      }

      return {
        operation,
        tokens,
      };
    }, [delimiter, operation, tokenPropertyKeys, urlSearchParams]),
  };
}
