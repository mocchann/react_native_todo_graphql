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
  Alert,
} from 'react-native';
import {
  SafeAreaProvider,
  useSafeAreaInsets,
} from 'react-native-safe-area-context';
import { Provider, useMutation, useQuery } from 'urql';
import { urqlClient } from './graphql/urqlClient';
import { graphql } from './generated';
import { useFragment } from './generated/fragment-masking';
import { Header, HeaderFragment } from './components/Header';
import { CreateForm, CreateTodoFragment } from './components/CreateForm';
import { UpdateForm } from './components/UpdateForm';
import { TodoCard, TodosFragment } from './components/TodoCard';

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

  const [{ data, fetching, error }] = useQuery({ query: TodosDocument });
  const todosData = useFragment(TodosFragment, data);
  const headerData = useFragment(HeaderFragment, data);
  const todoCount = headerData?.todoCount ?? 0;

  const [createTodoResult, createTodo] = useMutation(CreateTodoDocument);
  const [updateTodoResult, updateTodo] = useMutation(UpdateTodoDocument);
  const [deleteTodoResult, deleteTodo] = useMutation(DeleteTodoDocument);

  const [showCreateForm, setShowCreateForm] = useState(false);
  const [showUpdateForm, setShowUpdateForm] = useState(false);
  const [newTodoTitle, setNewTodoTitle] = useState('');
  const [newTodoContent, setNewTodoContent] = useState('');
  const [selectedTodo, setSelectedTodo] = useState<{
    id: string;
    title: string | null;
    content: string | null;
  } | null>(null);

  const handleCreateTodo = (title: string, content: string) => {
    if (!title.trim() || !content.trim()) {
      Alert.alert('Failed!', 'Please input form');
      return;
    }
    createTodo({
      input: { title, content, clientMutationId: String(Date.now()) },
    }).then(result => {
      if (result.error) {
        console.error('Oh, no!', result.error);
        return;
      }
      if (result.data?.createTodo) {
        const createData = useFragment(
          CreateTodoFragment,
          result.data.createTodo,
        );
        if (createData?.errors && createData.errors.length > 0) {
          Alert.alert('Error', createData.errors.join(', '));
          return;
        }
      }
    });
    handleCancelCreate();
  };

  const handleUpdateTodo = (todoId: number, title: string, content: string) => {
    if (!todoId || !title.trim() || !content.trim()) {
      Alert.alert('Failed!', 'Please input form');
      return;
    }
    updateTodo({
      input: {
        id: todoId,
        title,
        content,
        clientMutationId: String(Date.now()),
      },
    }).then(result => {
      if (result.error) {
        console.error('Oh no!', result.error);
        return;
      }
    });
    handleCancelCreate();
  };

  const handleDeleteTodo = (todoId: number) => {
    if (!todoId) {
      Alert.alert('Failed!', 'Invalid todo id');
      return;
    }
    Alert.alert('Are you Sure?', 'Delete the Todo', [
      {
        text: 'Cancel',
        onPress: () => console.log('cancel'),
      },
      {
        text: 'OK',
        onPress: () =>
          deleteTodo({
            input: { id: todoId, clientMutationId: String(Date.now()) },
          }).then(result => {
            if (result.error) {
              console.error('Delete failed!', result.error);
              return;
            }
          }),
      },
    ]);
    handleCancelCreate();
  };

  const handleCancelCreate = () => {
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
                    handleCancelCreate={handleCancelCreate}
                    handleCreateTodo={handleCreateTodo}
                  />
                ) : showUpdateForm && selectedTodo ? (
                  <UpdateForm
                    newTodoTitle={newTodoTitle}
                    setNewTodoTitle={setNewTodoTitle}
                    newTodoContent={newTodoContent}
                    setNewTodoContent={setNewTodoContent}
                    handleCancelCreate={handleCancelCreate}
                    todoId={Number(selectedTodo.id)}
                    handleUpdateTodo={handleUpdateTodo}
                    handleDeleteTodo={handleDeleteTodo}
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
