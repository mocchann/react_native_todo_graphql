import { ApolloClient, InMemoryCache, createHttpLink } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';

// GraphQLエンドポイントのURL
const httpLink = createHttpLink({
  uri: 'http://localhost:3000/graphql', // 実際のエンドポイントに変更してください
});

// 認証ヘッダーを追加するリンク
const authLink = setContext((_, { headers }) => {
  // ここでトークンを取得（AsyncStorageなどから）
  const token = null; // 実際の実装では、AsyncStorageからトークンを取得

  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : '',
    },
  };
});

// Apollo Clientのインスタンスを作成
export const apolloClient = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache(),
  defaultOptions: {
    watchQuery: {
      errorPolicy: 'all',
    },
    query: {
      errorPolicy: 'all',
    },
  },
});
