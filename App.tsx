/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React from 'react';
import {
  FlatList,
  StatusBar,
  StyleSheet,
  Text,
  useColorScheme,
  View,
  TouchableOpacity,
} from 'react-native';
import {
  SafeAreaProvider,
  useSafeAreaInsets,
} from 'react-native-safe-area-context';
import { Provider, useQuery } from 'urql';
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
  const styles = createStyles(safeAreaInsets);

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
              <Text style={styles.headerTitle}>My Todos</Text>
              <Text style={styles.headerSubtitle}>{data.todoCount} tasks</Text>
            </View>
            <FlatList
              data={data.todos || []}
              keyExtractor={item => item.id}
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
