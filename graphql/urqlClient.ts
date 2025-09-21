import {
  createClient,
  cacheExchange,
  fetchExchange,
  useQuery,
  useMutation,
  UseQueryArgs,
} from 'urql';
import { DocumentNode } from 'graphql';

export const GRAPHQL_ENDPOINT = 'http://localhost:3000/graphql';

export const urqlClient = createClient({
  url: GRAPHQL_ENDPOINT,
  exchanges: [cacheExchange, fetchExchange],
  preferGetMethod: false,
});

// Query用の型定義
type QueryOptions<T = any> = Omit<UseQueryArgs<any>, 'query'> & {
  query: DocumentNode;
};

// Mutation用の型定義
type MutationOptions<T = any> = {
  query: DocumentNode;
  variables?: any;
  context?: any;
};

/**
 * GraphQLクライアント層
 *
 * 目的:
 * 1. urqlの直接的な依存を隠蔽
 * 2. 統一されたAPIでクエリとミューテーションを実行
 * 3. 将来的にクライアント実装を変更する際の影響範囲を限定
 * 4. ビジネスロジックとGraphQL実装の分離
 */
export interface GraphQLClient {
  query: <T = any>(options: QueryOptions<T>) => ReturnType<typeof useQuery<T>>;
  mutation: <T = any>(
    options: MutationOptions<T>,
  ) => ReturnType<typeof useMutation<T>>;
}

/**
 * GraphQLクライアントフック
 *
 * urqlClientで設定されたurqlクライアントを使用して、
 * 統一されたAPIでGraphQL操作を実行する
 */
export const useGraphQLClient = (): GraphQLClient => {
  return {
    query: <T = any>(options: QueryOptions<T>) => {
      return useQuery<T>(options as any);
    },
    mutation: <T = any>(options: MutationOptions<T>) => {
      return useMutation<T>(options.query);
    },
  };
};

// 個別のフックも提供（より直接的な使用を希望する場合）
export const useGraphQLQuery = <T = any>(options: QueryOptions<T>) => {
  return useQuery<T>(options as any);
};

export const useGraphQLMutation = <T = any>(options: MutationOptions<T>) => {
  return useMutation<T>(options.query);
};
