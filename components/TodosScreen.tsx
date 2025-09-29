import React from 'react';
import { View, Text, FlatList, StyleSheet, SafeAreaView } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useQuery } from '@apollo/client/react';
import { useAppContext } from '../contexts/AppContext';
import { graphql } from '../generated';
import { Header } from './Header';
import { CreateForm } from './CreateForm';
import { UpdateForm } from './UpdateForm';
import { TodoCard } from './TodoCard';

const createStyles = (insets: { top: number; bottom: number }) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#f5f5f5',
      paddingTop: insets.top,
      paddingBottom: insets.bottom,
    },
    header: {
      padding: 16,
    },
    content: {
      flex: 1,
      padding: 16,
    },
    loadingContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
    loadingText: {
      fontSize: 16,
      color: '#666',
      marginTop: 10,
    },
    errorContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      padding: 20,
    },
    errorText: {
      fontSize: 16,
      color: '#ff6b6b',
      textAlign: 'center',
    },
    retryButton: {
      backgroundColor: '#007AFF',
      paddingHorizontal: 20,
      paddingVertical: 10,
      borderRadius: 8,
      marginTop: 15,
    },
    retryButtonText: {
      color: '#fff',
      fontSize: 16,
      fontWeight: 'bold',
    },
    emptyContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      padding: 20,
    },
    emptyText: {
      fontSize: 16,
      color: '#666',
      textAlign: 'center',
    },
    list: {
      flex: 1,
    },
    listContent: {
      paddingBottom: 20,
    },
  });

const TodosDocument = graphql(`
  query Todos($userId: ID!) {
    todos(userId: $userId) {
      id
      title
      content
    }
    todoCount(userId: $userId)
  }
`);

export const TodosScreen = () => {
  const safeAreaInsets = useSafeAreaInsets();
  const styles = createStyles(safeAreaInsets);
  const { state, actions } = useAppContext();
  if (!state.user?.id) {
    return null;
  }

  const { data, loading, error } = useQuery(TodosDocument, {
    variables: { userId: state.user?.id },
  });

  const todosData =
    data && typeof data === 'object' && 'todos' in data
      ? data.todos
      : undefined;
  const todoCount =
    data &&
    typeof data === 'object' &&
    'todoCount' in data &&
    typeof data.todoCount === 'number'
      ? data.todoCount
      : 0;

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>読み込み中...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>
            エラーが発生しました: {error.message}
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  const renderTodo = ({ item }: { item: any }) => <TodoCard item={item} />;

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Header
          todoCount={todoCount}
          setShowCreateForm={actions.showCreateForm}
        />
      </View>

      <View style={styles.content}>
        {state.showCreateForm && <CreateForm />}

        {state.showUpdateForm && state.selectedTodo && (
          <UpdateForm todoId={parseInt(state.selectedTodo.id)} />
        )}

        {!todosData || !Array.isArray(todosData) || todosData.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>
              Todoがありません。新しいTodoを作成してください。
            </Text>
          </View>
        ) : (
          <FlatList
            style={styles.list}
            contentContainerStyle={styles.listContent}
            data={Array.isArray(todosData) ? todosData : []}
            renderItem={renderTodo}
            keyExtractor={item => item.id.toString()}
          />
        )}
      </View>
    </SafeAreaView>
  );
};
