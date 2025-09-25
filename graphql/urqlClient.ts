import {
  createClient,
  cacheExchange,
  fetchExchange,
  useQuery,
  useMutation,
} from 'urql';
import { useFragment } from '../generated/fragment-masking';
import { TodosFragment } from '../components/TodoCard';
import { HeaderFragment } from '../components/Header';
import { CreateTodoFragment } from '../components/CreateForm';
import {
  DeleteTodoFragment,
  UpdateTodoFragment,
} from '../components/UpdateForm';

export const GRAPHQL_ENDPOINT = 'http://localhost:3000/graphql';

export const urqlClient = createClient({
  url: GRAPHQL_ENDPOINT,
  exchanges: [cacheExchange, fetchExchange],
  preferGetMethod: false,
});

export const useGraphQLClient = () => {
  return {
    query: (options: any) => {
      const [result] = useQuery(options);

      if (options.query?.definitions?.[0]?.name?.value === 'Todos') {
        const todosData = useFragment(TodosFragment, result.data);
        const headerData = useFragment(HeaderFragment, result.data);

        return [
          {
            ...result,
            todosData,
            headerData,
          } as any,
        ];
      }

      return [result];
    },
    mutation: (query: any) => {
      const [result, executeMutation] = useMutation(query);

      if (query?.definitions?.[0]?.name?.value === 'CreateTodo') {
        const wrappedExecuteMutation = async (variables: any) => {
          const mutationResult = await executeMutation(variables);

          if (mutationResult.data?.createTodo) {
            const createData = useFragment(
              CreateTodoFragment,
              mutationResult.data.createTodo,
            );
            return {
              ...mutationResult,
              createData,
            } as any;
          }

          return mutationResult;
        };

        return [result, wrappedExecuteMutation as any];
      }

      if (query?.definitions?.[0]?.name?.value === 'UpdateTodo') {
        const wrappedExecuteMutation = async (variables: any) => {
          const mutationResult = await executeMutation(variables);

          if (mutationResult.data?.updateTodo) {
            const updateData = useFragment(
              UpdateTodoFragment,
              mutationResult.data.updateTodo,
            );
            return {
              ...mutationResult,
              updateData,
            } as any;
          }

          return mutationResult;
        };

        return [result, wrappedExecuteMutation as any];
      }

      if (query?.definitions?.[0]?.name?.value === 'DeleteTodo') {
        const wrappedExecuteMutation = async (variables: any) => {
          const mutationResult = await executeMutation(variables);

          if (mutationResult.data?.deleteTodo) {
            const deleteData = useFragment(
              DeleteTodoFragment,
              mutationResult.data.deleteTodo,
            );
            return {
              ...mutationResult,
              deleteData,
            } as any;
          }

          return mutationResult;
        };

        return [result, wrappedExecuteMutation as any];
      }

      return [result, executeMutation];
    },
  };
};
