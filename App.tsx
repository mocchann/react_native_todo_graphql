/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React, { useReducer } from 'react';
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

type AppState = {
  showCreateForm: boolean;
  showUpdateForm: boolean;
  newTodoTitle: string;
  newTodoContent: string;
  selectedTodo: {
    id: string;
    title: string | null;
    content: string | null;
  } | null;
};

type AppAction =
  | { type: 'SHOW_CREATE_FORM' }
  | { type: 'SHOW_UPDATE_FORM' }
  | { type: 'HIDE_FORMS' }
  | { type: 'SET_TODO_TITLE'; payload: string }
  | { type: 'SET_TODO_CONTENT'; payload: string }
  | {
      type: 'SET_SELECTED_TODO';
      payload: {
        id: string;
        title: string | null;
        content: string | null;
      } | null;
    }
  | { type: 'RESET_FORM' }
  | { type: 'CANCEL_TODO' };

const initialState: AppState = {
  showCreateForm: false,
  showUpdateForm: false,
  newTodoTitle: '',
  newTodoContent: '',
  selectedTodo: null,
};

function appReducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case 'SHOW_CREATE_FORM':
      return {
        ...state,
        showCreateForm: true,
        showUpdateForm: false,
        selectedTodo: null,
      };
    case 'SHOW_UPDATE_FORM':
      return {
        ...state,
        showCreateForm: false,
        showUpdateForm: true,
      };
    case 'HIDE_FORMS':
      return {
        ...state,
        showCreateForm: false,
        showUpdateForm: false,
      };
    case 'SET_TODO_TITLE':
      return {
        ...state,
        newTodoTitle: action.payload,
      };
    case 'SET_TODO_CONTENT':
      return {
        ...state,
        newTodoContent: action.payload,
      };
    case 'SET_SELECTED_TODO':
      return {
        ...state,
        selectedTodo: action.payload,
      };
    case 'RESET_FORM':
      return {
        ...state,
        newTodoTitle: '',
        newTodoContent: '',
      };
    case 'CANCEL_TODO':
      return {
        ...state,
        showCreateForm: false,
        showUpdateForm: false,
        newTodoTitle: '',
        newTodoContent: '',
        selectedTodo: null,
      };
    default:
      return state;
  }
}

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
  const [createTodoResult, createTodo] = client.mutation(CreateTodoDocument);
  const [updateTodoResult, updateTodo] = client.mutation(UpdateTodoDocument);
  const [deleteTodoResult, deleteTodo] = client.mutation(DeleteTodoDocument);

  const [state, dispatch] = useReducer(appReducer, initialState);

  const handleCancelTodo = () => {
    dispatch({ type: 'CANCEL_TODO' });
  };

  const handleShowCreateForm = () => {
    dispatch({ type: 'SHOW_CREATE_FORM' });
  };

  const handleShowUpdateForm = (todo: {
    id: string;
    title: string | null;
    content: string | null;
  }) => {
    dispatch({ type: 'SET_SELECTED_TODO', payload: todo });
    dispatch({ type: 'SET_TODO_TITLE', payload: todo.title || '' });
    dispatch({ type: 'SET_TODO_CONTENT', payload: todo.content || '' });
    dispatch({ type: 'SHOW_UPDATE_FORM' });
  };

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
              setShowCreateForm={handleShowCreateForm}
            />
            <FlatList
              data={todosData.todos || []}
              keyExtractor={item => item.id}
              ListHeaderComponent={
                state.showCreateForm ? (
                  <CreateForm
                    newTodoTitle={state.newTodoTitle}
                    setNewTodoTitle={title =>
                      dispatch({ type: 'SET_TODO_TITLE', payload: title })
                    }
                    newTodoContent={state.newTodoContent}
                    setNewTodoContent={content =>
                      dispatch({ type: 'SET_TODO_CONTENT', payload: content })
                    }
                    handleCancelTodo={handleCancelTodo}
                    createTodo={createTodo}
                  />
                ) : state.showUpdateForm && state.selectedTodo ? (
                  <UpdateForm
                    newTodoTitle={state.newTodoTitle}
                    setNewTodoTitle={title =>
                      dispatch({ type: 'SET_TODO_TITLE', payload: title })
                    }
                    newTodoContent={state.newTodoContent}
                    setNewTodoContent={content =>
                      dispatch({ type: 'SET_TODO_CONTENT', payload: content })
                    }
                    handleCancelTodo={handleCancelTodo}
                    todoId={Number(state.selectedTodo.id)}
                    updateTodo={updateTodo}
                    deleteTodo={deleteTodo}
                  />
                ) : null
              }
              renderItem={({ item }) => (
                <TodoCard
                  item={item}
                  setSelectedTodo={todo => handleShowUpdateForm(todo)}
                  setNewTodoTitle={title =>
                    dispatch({ type: 'SET_TODO_TITLE', payload: title })
                  }
                  setNewTodoContent={content =>
                    dispatch({ type: 'SET_TODO_CONTENT', payload: content })
                  }
                  setShowUpdateForm={() => handleShowUpdateForm(item)}
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
