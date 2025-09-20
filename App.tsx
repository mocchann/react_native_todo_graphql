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
  TouchableOpacity,
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

const TodosDocument = graphql(`
  query Todos {
    todos {
      id
      title
      content
    }
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

function AppContent() {
  const safeAreaInsets = useSafeAreaInsets();
  const styles = createStyles(safeAreaInsets);

  const [{ data, fetching, error }] = useQuery({ query: TodosDocument });
  const headerData = useFragment(HeaderFragment, data);
  const todoCount = headerData?.todoCount ?? 0;

  const [createTodoResult, createTodo] = useMutation(CreateTodoDocument);
  const [updatetodoResult, updateTodo] = useMutation(UpdateTodoDocument);
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

  if (!data) {
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
              data={data.todos || []}
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
                <TouchableOpacity
                  style={styles.todoCard}
                  onPress={() => {
                    setSelectedTodo(item);
                    setNewTodoTitle(item.title || '');
                    setNewTodoContent(item.content || '');
                    setShowUpdateForm(true);
                  }}
                >
                  <View style={styles.todoContent}>
                    <Text style={styles.todoTitle}>{item.title}</Text>
                    {item.content && (
                      <Text style={styles.todoDescription}>{item.content}</Text>
                    )}
                  </View>
                  <View style={styles.todoIndicator} />
                </TouchableOpacity>
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
    todoCard: {
      backgroundColor: '#ffffff',
      borderRadius: 16,
      padding: 20,
      marginBottom: 12,
      flexDirection: 'row',
      alignItems: 'center',
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.1,
      shadowRadius: 8,
      elevation: 3,
    },
    todoContent: {
      flex: 1,
    },
    todoTitle: {
      fontSize: 18,
      fontWeight: '600',
      color: '#1a1a1a',
      marginBottom: 4,
    },
    todoDescription: {
      fontSize: 14,
      color: '#6b7280',
      lineHeight: 20,
    },
    todoIndicator: {
      width: 8,
      height: 8,
      borderRadius: 4,
      backgroundColor: '#3b82f6',
      marginLeft: 12,
    },
  });

export default App;
