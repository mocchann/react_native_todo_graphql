import React, {
  createContext,
  useContext,
  useReducer,
  ReactNode,
  useEffect,
} from 'react';

export type User = {
  id: string;
  email: string;
};

export type AppState = {
  // Todo関連の状態
  showCreateForm: boolean;
  showUpdateForm: boolean;
  newTodoTitle: string;
  newTodoContent: string;
  selectedTodo: {
    id: string;
    title: string | null;
    content: string | null;
  } | null;
  // 認証関連の状態
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
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
  | { type: 'CANCEL_TODO' }
  // 認証関連のアクション
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_USER'; payload: User | null }
  | { type: 'LOGIN_SUCCESS'; payload: User }
  | { type: 'LOGOUT' };

const initialState: AppState = {
  // Todo関連の初期状態
  showCreateForm: false,
  showUpdateForm: false,
  newTodoTitle: '',
  newTodoContent: '',
  selectedTodo: null,
  // 認証関連の初期状態
  user: null,
  isAuthenticated: false,
  isLoading: false,
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
    // 認証関連のケース
    case 'SET_LOADING':
      return {
        ...state,
        isLoading: action.payload,
      };
    case 'SET_USER':
      return {
        ...state,
        user: action.payload,
        isAuthenticated: action.payload !== null,
      };
    case 'LOGIN_SUCCESS':
      return {
        ...state,
        user: action.payload,
        isAuthenticated: true,
        isLoading: false,
      };
    case 'LOGOUT':
      return {
        ...state,
        user: null,
        isAuthenticated: false,
        isLoading: false,
      };
    default:
      return state;
  }
}

type AppContextType = {
  state: AppState;
  dispatch: React.Dispatch<AppAction>;
  actions: {
    // Todo関連のアクション
    showCreateForm: () => void;
    showUpdateForm: (todo: {
      id: string;
      title: string | null;
      content: string | null;
    }) => void;
    cancelTodo: () => void;
    setTodoTitle: (title: string) => void;
    setTodoContent: (content: string) => void;
    // 認証関連のアクション
    setLoading: (loading: boolean) => void;
    setUser: (user: User | null) => void;
    loginSuccess: (user: User) => void;
    logout: () => void;
  };
};

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(appReducer, initialState);

  // アプリ起動時の認証状態初期化
  useEffect(() => {
    // ここでローカルストレージやAsyncStorageから認証情報を読み込む
    // 現在はデモ用にfalseに設定
    const initializeAuth = async () => {
      // 実際の実装では、ここでトークンをチェックして認証状態を復元
      // const token = await AsyncStorage.getItem('authToken');
      // if (token) {
      //   // トークンが有効かチェック
      //   actions.setUser({ id: '1', email: 'user@example.com' });
      // }
    };

    initializeAuth();
  }, []);

  const actions = {
    // Todo関連のアクション
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
    // 認証関連のアクション
    setLoading: (loading: boolean) =>
      dispatch({ type: 'SET_LOADING', payload: loading }),
    setUser: (user: User | null) =>
      dispatch({ type: 'SET_USER', payload: user }),
    loginSuccess: (user: User) =>
      dispatch({ type: 'LOGIN_SUCCESS', payload: user }),
    logout: () => dispatch({ type: 'LOGOUT' }),
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
