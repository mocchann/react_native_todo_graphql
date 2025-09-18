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
  TextInput,
  Alert,
} from 'react-native';
import {
  SafeAreaProvider,
  useSafeAreaInsets,
} from 'react-native-safe-area-context';
import { Provider, useMutation, useQuery } from 'urql';
import { urqlClient } from './urqlClient';
import { graphql } from './generated';

const TodoDocument = graphql(`
  query Todos {
    todos {
      id
      title
      content
    }
    todoCount
  }
`);

const CreateTodoDocument = graphql(`
  mutation CreateTodo($input: CreateTodoInput!) {
    createTodo(input: $input) {
      errors
      todo {
        id
        title
        content
      }
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
  const [{ data, fetching, error }] = useQuery({ query: TodoDocument });
  const [createTodoResult, createTodo] = useMutation(CreateTodoDocument);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newTodoTitle, setNewTodoTitle] = useState('');
  const [newTodoContent, setNewTodoContent] = useState('');

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
    });
    setNewTodoTitle('');
    setNewTodoContent('');
    setShowCreateForm(false);
  };

  const handleCancelCreate = () => {
    setNewTodoTitle('');
    setNewTodoContent('');
    setShowCreateForm(false);
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
            <View style={styles.header}>
              <View style={styles.headerLeft}>
                <Text style={styles.headerTitle}>My Todos</Text>
                <Text style={styles.headerSubtitle}>
                  {data.todoCount} tasks
                </Text>
              </View>
              <TouchableOpacity
                style={styles.createButton}
                onPress={() => setShowCreateForm(true)}
              >
                <Text style={styles.createButtonText}>+ Create</Text>
              </TouchableOpacity>
            </View>
            <FlatList
              data={data.todos || []}
              keyExtractor={item => item.id}
              ListHeaderComponent={
                showCreateForm ? (
                  <CreateForm
                    styles={styles}
                    newTodoTitle={newTodoTitle}
                    setNewTodoTitle={setNewTodoTitle}
                    newTodoContent={newTodoContent}
                    setNewTodoContent={setNewTodoContent}
                    handleCancelCreate={handleCancelCreate}
                    handleCreateTodo={handleCreateTodo}
                  />
                ) : null
              }
              renderItem={({ item }) => (
                <TouchableOpacity style={styles.todoCard}>
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
    header: {
      marginBottom: 24,
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'flex-end',
    },
    headerLeft: {
      flex: 1,
    },
    headerTitle: {
      fontSize: 32,
      fontWeight: '700',
      color: '#1a1a1a',
      marginBottom: 4,
    },
    headerSubtitle: {
      fontSize: 16,
      color: '#6b7280',
      fontWeight: '500',
    },
    createButton: {
      backgroundColor: '#3b82f6',
      paddingHorizontal: 16,
      paddingVertical: 8,
      borderRadius: 20,
    },
    createButtonText: {
      color: '#ffffff',
      fontSize: 14,
      fontWeight: '600',
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
    createForm: {
      backgroundColor: '#ffffff',
      borderRadius: 16,
      padding: 20,
      marginBottom: 16,
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.1,
      shadowRadius: 8,
      elevation: 3,
    },
    formTitle: {
      fontSize: 18,
      fontWeight: '600',
      color: '#1a1a1a',
      marginBottom: 16,
    },
    input: {
      borderWidth: 1,
      borderColor: '#e5e7eb',
      borderRadius: 8,
      paddingHorizontal: 12,
      paddingVertical: 10,
      fontSize: 16,
      color: '#1a1a1a',
      backgroundColor: '#f9fafb',
      marginBottom: 12,
    },
    textArea: {
      height: 80,
      textAlignVertical: 'top',
    },
    formButtons: {
      flexDirection: 'row',
      justifyContent: 'flex-end',
      gap: 12,
    },
    cancelButton: {
      paddingHorizontal: 16,
      paddingVertical: 8,
      borderRadius: 8,
      borderWidth: 1,
      borderColor: '#d1d5db',
    },
    cancelButtonText: {
      color: '#6b7280',
      fontSize: 14,
      fontWeight: '500',
    },
    submitButton: {
      backgroundColor: '#3b82f6',
      paddingHorizontal: 16,
      paddingVertical: 8,
      borderRadius: 8,
    },
    submitButtonText: {
      color: '#ffffff',
      fontSize: 14,
      fontWeight: '600',
    },
  });

export default App;

type CreateFormProps = {
  styles: ReturnType<typeof createStyles>;
  newTodoTitle: string;
  setNewTodoTitle: (t: string) => void;
  newTodoContent: string;
  setNewTodoContent: (t: string) => void;
  handleCancelCreate: () => void;
  handleCreateTodo: (title: string, content: string) => void;
};

const CreateForm = ({
  styles,
  newTodoTitle,
  setNewTodoTitle,
  newTodoContent,
  setNewTodoContent,
  handleCancelCreate,
  handleCreateTodo,
}: CreateFormProps) => {
  return (
    <View style={styles.createForm}>
      <Text style={styles.formTitle}>New todo</Text>
      <TextInput
        style={styles.input}
        placeholder="Input title"
        value={newTodoTitle}
        onChangeText={setNewTodoTitle}
        placeholderTextColor="#9ca3af"
        autoCapitalize="none"
        autoCorrect={false}
      />
      <TextInput
        style={[styles.input, styles.textArea]}
        placeholder="Input content"
        value={newTodoContent}
        onChangeText={setNewTodoContent}
        multiline
        numberOfLines={3}
        placeholderTextColor="#9ca3af"
        autoCapitalize="none"
        autoCorrect={false}
      />
      <View style={styles.formButtons}>
        <TouchableOpacity
          style={styles.cancelButton}
          onPress={handleCancelCreate}
        >
          <Text style={styles.cancelButtonText}>Cancel</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.submitButton}
          onPress={() => handleCreateTodo(newTodoTitle, newTodoContent)}
        >
          <Text style={styles.submitButtonText}>Submit</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};
