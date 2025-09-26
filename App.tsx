/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React from 'react';
import { StatusBar, useColorScheme } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NavigationContainer } from '@react-navigation/native';
import { ApolloProvider } from '@apollo/client/react';
import { apolloClient } from './graphql/apolloClient';
import { AppProvider } from './contexts/AppContext';
import { TabNavigator } from './components/TabNavigator';

function App() {
  const isDarkMode = useColorScheme() === 'dark';

  return (
    <ApolloProvider client={apolloClient}>
      <SafeAreaProvider>
        <AppProvider>
          <NavigationContainer>
            <StatusBar
              barStyle={isDarkMode ? 'light-content' : 'dark-content'}
            />
            <TabNavigator />
          </NavigationContainer>
        </AppProvider>
      </SafeAreaProvider>
    </ApolloProvider>
  );
}

export default App;
