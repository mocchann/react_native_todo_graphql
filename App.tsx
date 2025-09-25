/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React from 'react';
import {
  FlatList,
  StatusBar,
  StyleSheet,
  Text,
  useColorScheme,
  View,
} from 'react-native';
import {
  SafeAreaProvider,
  useSafeAreaInsets,
} from 'react-native-safe-area-context';
import { ApolloProvider } from '@apollo/client/react';
import { apolloClient, useGraphQLClient } from './graphql/apolloClient';
import { graphql } from './generated';
import { AppProvider, useAppContext } from './contexts/AppContext';
import { Header } from './components/Header';
import { CreateForm } from './components/CreateForm';
import { UpdateForm } from './components/UpdateForm';
import { TodoCard } from './components/TodoCard';

const TodosDocument = graphql(`
  query Todos {
    ...TodosFragment
    ...HeaderFragment
  }
`);

const CreateTodoDocument = graphql(`
  mutation CreateTodo($input: CreateTodoInput!) {
    createTodo(input: $input) {
      ...CreateTodoFragment
    }
  }
`);

const UpdateTodoDocument = graphql(`
  mutation UpdateTodo($input: UpdateTodoInput!) {
    updateTodo(input: $input) {
      ...UpdateTodoFragment
    }
  }
`);

const DeleteTodoDocument = graphql(`
  mutation DeleteTodo($input: DeleteTodoInput!) {
    deleteTodo(input: $input) {
      ...DeleteTodoFragment
    }
  }
`);

function App() {
  const isDarkMode = useColorScheme() === 'dark';

  return (
    <ApolloProvider client={apolloClient}>
      <SafeAreaProvider>
        <AppProvider>
          <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
          <AppContent />
        </AppProvider>
      </SafeAreaProvider>
    </ApolloProvider>
  );
}

const createStyles = (safeAreaInsets: {
  top: number;
  bottom: number;
  left: number;
  right: number;
}) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#f8f9fa',
      paddingTop: safeAreaInsets.top + 20,
      paddingBottom: safeAreaInsets.bottom + 20,
      paddingLeft: safeAreaInsets.left + 20,
      paddingRight: safeAreaInsets.right + 20,
    },
    listContainer: {
      paddingBottom: 20,
    },
  });

function AppContent() {
  const safeAreaInsets = useSafeAreaInsets();
  const styles = createStyles(safeAreaInsets);
  const client = useGraphQLClient();
  const { state, actions } = useAppContext();

  const [{ data, fetching, error, todosData, headerData }] = client.query({
    query: TodosDocument,
  });
  const [createTodoResult, createTodo] = client.mutation(CreateTodoDocument);
  const [updateTodoResult, updateTodo] = client.mutation(UpdateTodoDocument);
  const [deleteTodoResult, deleteTodo] = client.mutation(DeleteTodoDocument);

  if (!todosData) {
    return null;
  }

  const todoCount = headerData?.todoCount ?? 0;

  return (
    <>
      <View style={styles.container}>
        {fetching ? <Text>Loading...</Text> : null}
        {error ? <Text>{String(error)}</Text> : null}
        {!fetching && !error ? (
          <>
            <Header
              todoCount={todoCount}
              setShowCreateForm={actions.showCreateForm}
            />
            <FlatList
              data={todosData.todos || []}
              keyExtractor={item => item.id}
              ListHeaderComponent={
                state.showCreateForm ? (
                  <CreateForm createTodo={createTodo} />
                ) : state.showUpdateForm && state.selectedTodo ? (
                  <UpdateForm
                    todoId={Number(state.selectedTodo.id)}
                    updateTodo={updateTodo}
                    deleteTodo={deleteTodo}
                  />
                ) : null
              }
              renderItem={({ item }) => <TodoCard item={item} />}
              contentContainerStyle={styles.listContainer}
              showsVerticalScrollIndicator={false}
            />
          </>
        ) : null}
      </View>
    </>
  );
}

export default App;
