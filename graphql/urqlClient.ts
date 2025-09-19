import { createClient, cacheExchange, fetchExchange } from 'urql';

export const GRAPHQL_ENDPOINT = 'http://localhost:3000/graphql';

export const urqlClient = createClient({
  url: GRAPHQL_ENDPOINT,
  exchanges: [cacheExchange, fetchExchange],
  preferGetMethod: false,
});
