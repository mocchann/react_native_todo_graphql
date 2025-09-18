/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import { NewAppScreen } from '@react-native/new-app-screen';
import React from 'react';
import {
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
import { Provider, useQuery } from 'urql';
import { urqlClient } from './urqlClient';
import { graphql } from './generated';
import {
  QueryTodosArgs,
  Todo,
  TodosQuery,
  TodosQueryVariables,
} from './generated/graphql';

const TodoDocument = graphql(`
  query Todos {
    todos {
      id
      title
      content
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
  const [{ data, fetching, error }] = useQuery({ query: TodoDocument });

  return (
    <>
      <View style={styles.container}>
        <NewAppScreen
          templateFileName="App.tsx"
          safeAreaInsets={safeAreaInsets}
        />
      </View>
      <View style={{ flex: 1, padding: 16 }}>
        {fetching ? <Text>Loading...</Text> : null}
        {error ? <Text>{String(error)}</Text> : null}
        {!fetching && !error ? (
          <>
            <Text style={{ fontWeight: 'bold', marginBottom: 8 }}>Todos</Text>
            {data?.todos?.map(
              (todo: Pick<Todo, 'id' | 'title' | 'content'>) => (
                <Text key={todo.id} style={{ marginBottom: 4 }}>
                  • {todo.title}
                </Text>
              ),
            )}
          </>
        ) : null}
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default App;
