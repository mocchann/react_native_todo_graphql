/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React, { useState } from 'react';
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
import { Provider } from 'urql';
import { urqlClient, useGraphQLClient } from './graphql/urqlClient';
import { graphql } from './generated';
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
    <Provider value={urqlClient}>
      <SafeAreaProvider>
        <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
        <AppContent />
      </SafeAreaProvider>
    </Provider>
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

  const [{ data, fetching, error, todosData, headerData }] = client.query({
    query: TodosDocument,
  });
  const todoCount = headerData?.todoCount ?? 0;

  const [createTodoResult, createTodo] = client.mutation(CreateTodoDocument);
  const [updateTodoResult, updateTodo] = client.mutation(UpdateTodoDocument);
  const [deleteTodoResult, deleteTodo] = client.mutation(DeleteTodoDocument);

  const [showCreateForm, setShowCreateForm] = useState(false);
  const [showUpdateForm, setShowUpdateForm] = useState(false);
  const [newTodoTitle, setNewTodoTitle] = useState('');
  const [newTodoContent, setNewTodoContent] = useState('');
  const [selectedTodo, setSelectedTodo] = useState<{
    id: string;
    title: string | null;
    content: string | null;
  } | null>(null);

  const handleCancelTodo = () => {
    setNewTodoTitle('');
    setNewTodoContent('');
    setShowCreateForm(false);
    setShowUpdateForm(false);
    setSelectedTodo(null);
  };

  if (!todosData) {
    return null;
  }

  return (
    <>
      <View style={styles.container}>
        {fetching ? <Text>Loading...</Text> : null}
        {error ? <Text>{String(error)}</Text> : null}
        {!fetching && !error ? (
          <>
            <Header
              todoCount={todoCount}
              setShowCreateForm={setShowCreateForm}
            />
            <FlatList
              data={todosData.todos || []}
              keyExtractor={item => item.id}
              ListHeaderComponent={
                showCreateForm ? (
                  <CreateForm
                    newTodoTitle={newTodoTitle}
                    setNewTodoTitle={setNewTodoTitle}
                    newTodoContent={newTodoContent}
                    setNewTodoContent={setNewTodoContent}
                    handleCancelTodo={handleCancelTodo}
                    createTodo={createTodo}
                  />
                ) : showUpdateForm && selectedTodo ? (
                  <UpdateForm
                    newTodoTitle={newTodoTitle}
                    setNewTodoTitle={setNewTodoTitle}
                    newTodoContent={newTodoContent}
                    setNewTodoContent={setNewTodoContent}
                    handleCancelTodo={handleCancelTodo}
                    todoId={Number(selectedTodo.id)}
                    updateTodo={updateTodo}
                    deleteTodo={deleteTodo}
                  />
                ) : null
              }
              renderItem={({ item }) => (
                <TodoCard
                  item={item}
                  setSelectedTodo={setSelectedTodo}
                  setNewTodoTitle={setNewTodoTitle}
                  setNewTodoContent={setNewTodoContent}
                  setShowUpdateForm={setShowUpdateForm}
                />
              )}
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
