import React from 'react';
import { View, Text, FlatList, StyleSheet, SafeAreaView } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAppContext } from '../contexts/AppContext';
import { useGraphQLClient } from '../graphql/apolloClient';
import { graphql } from '../generated';
import { Header } from './Header';
import { CreateForm } from './CreateForm';
import { UpdateForm } from './UpdateForm';
import { TodoCard } from './TodoCard';

const TodosDocument = graphql(`
  query Todos {
    todos {
      id
      title
      content
      createdAt
      updatedAt
    }
    todoCount
  }
`);

const CreateTodoDocument = graphql(`
  mutation CreateTodo($input: CreateTodoInput!) {
    createTodo(input: $input) {
      todo {
        id
        title
        content
        createdAt
        updatedAt
      }
      errors
    }
  }
`);

const UpdateTodoDocument = graphql(`
  mutation UpdateTodo($input: UpdateTodoInput!) {
    updateTodo(input: $input) {
      todo {
        id
        title
        content
        createdAt
        updatedAt
      }
      errors
    }
  }
`);

const DeleteTodoDocument = graphql(`
  mutation DeleteTodo($input: DeleteTodoInput!) {
    deleteTodo(input: $input) {
      errors
    }
  }
`);

const createStyles = (insets: { top: number; bottom: number }) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#f5f5f5',
      paddingTop: insets.top,
      paddingBottom: insets.bottom,
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

export const TodosScreen = () => {
  const safeAreaInsets = useSafeAreaInsets();
  const styles = createStyles(safeAreaInsets);
  const client = useGraphQLClient();
  const { state, actions } = useAppContext();

  const queryResult = client.query({
    query: TodosDocument,
  });

  const { data, fetching, error } = queryResult[0];
  const todosData = (queryResult[0].data as any)?.todosData;
  const headerData = (queryResult[0].data as any)?.headerData;
  const [createTodoResult, createTodo] = client.mutation(CreateTodoDocument);
  const [updateTodoResult, updateTodo] = client.mutation(UpdateTodoDocument);
  const [deleteTodoResult, deleteTodo] = client.mutation(DeleteTodoDocument);

  if (!todosData) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>
            {fetching ? '読み込み中...' : 'データを取得中...'}
          </Text>
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
      <Header
        todoCount={headerData?.todoCount || 0}
        setShowCreateForm={actions.showCreateForm}
      />

      <View style={styles.content}>
        {state.showCreateForm && (
          <CreateForm
            createTodo={async variables => {
              const result = await createTodo(variables);
              if (result.data?.createTodo) {
                actions.cancelTodo();
              }
              return result;
            }}
          />
        )}

        {state.showUpdateForm && state.selectedTodo && (
          <UpdateForm
            todoId={parseInt(state.selectedTodo.id)}
            updateTodo={async variables => {
              const result = await updateTodo(variables);
              if (result.data?.updateTodo) {
                actions.cancelTodo();
              }
              return result;
            }}
            deleteTodo={async variables => {
              const result = await deleteTodo(variables);
              if (result.data?.deleteTodo) {
                actions.cancelTodo();
              }
              return result;
            }}
          />
        )}

        {todosData.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>
              Todoがありません。新しいTodoを作成してください。
            </Text>
          </View>
        ) : (
          <FlatList
            style={styles.list}
            contentContainerStyle={styles.listContent}
            data={todosData}
            renderItem={renderTodo}
            keyExtractor={item => item.id.toString()}
          />
        )}
      </View>
    </SafeAreaView>
  );
};
