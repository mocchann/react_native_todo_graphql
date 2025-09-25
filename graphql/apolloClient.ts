import { ApolloClient, InMemoryCache, createHttpLink } from '@apollo/client';
import { useQuery, useMutation } from '@apollo/client/react';
import { DocumentNode } from 'graphql';
import { useFragment } from '../generated/fragment-masking';
import { TodosFragment } from '../components/TodoCard';
import { HeaderFragment } from '../components/Header';
import { CreateTodoFragment } from '../components/CreateForm';
import {
  DeleteTodoFragment,
  UpdateTodoFragment,
} from '../components/UpdateForm';

export const GRAPHQL_ENDPOINT = 'http://localhost:3000/graphql';

export const apolloClient = new ApolloClient({
  link: createHttpLink({
    uri: GRAPHQL_ENDPOINT,
  }),
  cache: new InMemoryCache(),
  defaultOptions: {
    watchQuery: {
      errorPolicy: 'all',
    },
    query: {
      errorPolicy: 'all',
    },
    mutate: {
      errorPolicy: 'all',
    },
  },
});

export const useGraphQLClient = () => {
  return {
    query: (options: any) => {
      const { data, loading, error, refetch } = useQuery(options.query, {
        variables: options.variables,
        errorPolicy: 'all',
      });

      if ((options.query?.definitions?.[0] as any)?.name?.value === 'Todos') {
        const todosData = useFragment(TodosFragment, data as any);
        const headerData = useFragment(HeaderFragment, data as any);

        return [
          {
            data,
            fetching: loading,
            error,
            refetch,
            todosData,
            headerData,
          } as any,
        ];
      }

      return [{ data, fetching: loading, error, refetch }];
    },

    mutation: (query: DocumentNode) => {
      const [executeMutation, { data, loading, error }] = useMutation(query, {
        errorPolicy: 'all',
      });

      const mutationName = (query?.definitions?.[0] as any)?.name?.value;

      if (mutationName === 'CreateTodo') {
        const wrappedExecuteMutation = async (variables: any) => {
          try {
            const mutationResult = await executeMutation({
              variables,
              refetchQueries: ['Todos'],
            });

            if (
              mutationResult.data &&
              (mutationResult.data as any)?.createTodo
            ) {
              const createData = useFragment(
                CreateTodoFragment,
                (mutationResult.data as any).createTodo,
              );
              return {
                ...mutationResult,
                createData,
              } as any;
            }

            return mutationResult;
          } catch (err) {
            console.error('CreateTodo mutation error:', err);
            throw err;
          }
        };

        return [
          { data, fetching: loading, error },
          wrappedExecuteMutation as any,
        ];
      }

      if (mutationName === 'UpdateTodo') {
        const wrappedExecuteMutation = async (variables: any) => {
          try {
            const mutationResult = await executeMutation({
              variables,
              refetchQueries: ['Todos'],
            });

            if (
              mutationResult.data &&
              (mutationResult.data as any)?.updateTodo
            ) {
              const updateData = useFragment(
                UpdateTodoFragment,
                (mutationResult.data as any).updateTodo,
              );
              return {
                ...mutationResult,
                updateData,
              } as any;
            }

            return mutationResult;
          } catch (err) {
            console.error('UpdateTodo mutation error:', err);
            throw err;
          }
        };

        return [
          { data, fetching: loading, error },
          wrappedExecuteMutation as any,
        ];
      }

      if (mutationName === 'DeleteTodo') {
        const wrappedExecuteMutation = async (variables: any) => {
          try {
            const mutationResult = await executeMutation({
              variables,
              refetchQueries: ['Todos'],
            });

            if (
              mutationResult.data &&
              (mutationResult.data as any)?.deleteTodo
            ) {
              const deleteData = useFragment(
                DeleteTodoFragment,
                (mutationResult.data as any).deleteTodo,
              );
              return {
                ...mutationResult,
                deleteData,
              } as any;
            }

            return mutationResult;
          } catch (err) {
            console.error('DeleteTodo mutation error:', err);
            throw err;
          }
        };

        return [
          { data, fetching: loading, error },
          wrappedExecuteMutation as any,
        ];
      }

      return [{ data, fetching: loading, error }, executeMutation];
    },
  };
};
