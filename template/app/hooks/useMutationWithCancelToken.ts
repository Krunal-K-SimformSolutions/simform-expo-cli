/**
 *
 */
export const UseMutationWithCancelTokenTemplate = (): string => {
  return `
    import {
      type OperationVariables,
      type DocumentNode,
      type TypedDocumentNode,
      type ApolloCache,
      useMutation,
      type MutationTuple,
      type DefaultContext,
      type MutationHookOptions
    } from '@apollo/client';
    import { useRef, useCallback } from 'react';
    import type React from 'react';

    type MutationWithCancelTokenHookReturnType<
      TData,
      TVariables,
      TContext,
      TCache extends ApolloCache<any>
    > = [...MutationTuple<TData, TVariables, TContext, TCache>, () => void];

    /**
     * It's a wrapper around the \`useMutation\` hook that adds an \`abort\` function to the returned object
     * @param {DocumentNode | TypedDocumentNode<TData, TVariables>} mutation - DocumentNode |
     * TypedDocumentNode<TData, TVariables>
     * @param [options] - MutationHookOptions<TData, TVariables, TContext>
     * @returns An object with the following properties:
     *   - data: TData | undefined -> return a query data
     *   - error: ApolloError | undefined -> return a error when the query fails
     *   - loading: boolean -> flag to identify process is ongoing or not
     *   - networkStatus: NetworkStatus -> network status of process
     *   - called: boolean
     *   - client: ApolloClient<NormalizedCacheObject>
     *   - refetch: (variables?: TVariables | undefined) => Promise<ApolloQuery
     *   - abort: () => void -> to cancel the request
     */
    function useMutationWithCancelToken<
      TData = any,
      TVariables = OperationVariables,
      TContext = DefaultContext,
      TCache extends ApolloCache<any> = ApolloCache<any>
    >(
      mutation: DocumentNode | TypedDocumentNode<TData, TVariables>,
      options?: MutationHookOptions<TData, TVariables, TContext>
    ): MutationWithCancelTokenHookReturnType<TData, TVariables, TContext, TCache> {
      const aborterRef: React.MutableRefObject<AbortController> = useRef<AbortController>(
        new AbortController()
      );
      const returnData: MutationTuple<TData, TVariables, TContext, TCache> = useMutation<
        TData,
        TVariables,
        TContext,
        TCache
      >(
        mutation,
        Object.assign({}, options, {
          context: {
            fetchOptions: {
              signal: aborterRef.current.signal
            }
          }
        })
      );

      const abort: () => void = useCallback<() => void>(() => {
        aborterRef.current.abort();
        aborterRef.current = new AbortController();
      }, []);

      return [...returnData, abort];
    }

    export default useMutationWithCancelToken;
  `;
};
