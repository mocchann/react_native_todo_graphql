import React, { createContext, useContext, useReducer, ReactNode } from 'react';

export type AppState = {
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

export type AppAction =
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

type AppContextType = {
  state: AppState;
  dispatch: React.Dispatch<AppAction>;
  actions: {
    showCreateForm: () => void;
    showUpdateForm: (todo: {
      id: string;
      title: string | null;
      content: string | null;
    }) => void;
    cancelTodo: () => void;
    setTodoTitle: (title: string) => void;
    setTodoContent: (content: string) => void;
  };
};

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(appReducer, initialState);

  const actions = {
    showCreateForm: () => dispatch({ type: 'SHOW_CREATE_FORM' }),
    showUpdateForm: (todo: {
      id: string;
      title: string | null;
      content: string | null;
    }) => {
      dispatch({ type: 'SET_SELECTED_TODO', payload: todo });
      dispatch({ type: 'SET_TODO_TITLE', payload: todo.title || '' });
      dispatch({ type: 'SET_TODO_CONTENT', payload: todo.content || '' });
      dispatch({ type: 'SHOW_UPDATE_FORM' });
    },
    cancelTodo: () => dispatch({ type: 'CANCEL_TODO' }),
    setTodoTitle: (title: string) =>
      dispatch({ type: 'SET_TODO_TITLE', payload: title }),
    setTodoContent: (content: string) =>
      dispatch({ type: 'SET_TODO_CONTENT', payload: content }),
  };

  return (
    <AppContext.Provider value={{ state, dispatch, actions }}>
      {children}
    </AppContext.Provider>
  );
}

export function useAppContext() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
}
