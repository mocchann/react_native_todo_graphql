import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Text, View, TouchableOpacity } from 'react-native';
import { useAppContext } from '../contexts/AppContext';
import { TodosScreen } from './TodosScreen';
import { SignInScreen } from './SignInScreen';
import { SignUpScreen } from './SignUpScreen';

const Tab = createBottomTabNavigator();

export const TabNavigator = () => {
  const { state } = useAppContext();

  if (!state.isAuthenticated) {
    return (
      <Tab.Navigator
        screenOptions={{
          headerShown: false,
          tabBarActiveTintColor: '#007AFF',
          tabBarInactiveTintColor: '#8E8E93',
          tabBarStyle: {
            backgroundColor: '#fff',
            borderTopWidth: 1,
            borderTopColor: '#E5E5EA',
            paddingBottom: 5,
            paddingTop: 5,
            height: 60,
          },
        }}
      >
        <Tab.Screen
          name="SignIn"
          component={SignInScreen}
          options={{
            title: 'ログイン',
            tabBarIcon: ({ color, size }) => (
              <Text style={{ color, fontSize: size }}>🔑</Text>
            ),
          }}
        />
        <Tab.Screen
          name="SignUp"
          component={SignUpScreen}
          options={{
            title: 'アカウント作成',
            tabBarIcon: ({ color, size }) => (
              <Text style={{ color, fontSize: size }}>📝</Text>
            ),
          }}
        />
      </Tab.Navigator>
    );
  }

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: '#007AFF',
        tabBarInactiveTintColor: '#8E8E93',
        tabBarStyle: {
          backgroundColor: '#fff',
          borderTopWidth: 1,
          borderTopColor: '#E5E5EA',
          paddingBottom: 5,
          paddingTop: 5,
          height: 60,
        },
      }}
    >
      <Tab.Screen
        name="Todos"
        component={TodosScreen}
        options={{
          title: 'My Todos',
          tabBarIcon: ({ color, size }) => (
            <Text style={{ color, fontSize: size }}>📝</Text>
          ),
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          title: 'プロフィール',
          tabBarIcon: ({ color, size }) => (
            <Text style={{ color, fontSize: size }}>👤</Text>
          ),
        }}
      />
    </Tab.Navigator>
  );
};

const ProfileScreen = () => {
  const { state, actions } = useAppContext();

  return (
    <View
      style={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
      }}
    >
      <Text style={{ fontSize: 18, marginBottom: 20 }}>
        ログイン中: {state.user?.email}
      </Text>
      <TouchableOpacity
        style={{
          backgroundColor: '#ff6b6b',
          paddingHorizontal: 20,
          paddingVertical: 10,
          borderRadius: 8,
        }}
        onPress={actions.logout}
      >
        <Text style={{ color: '#fff', fontSize: 16, fontWeight: 'bold' }}>
          ログアウト
        </Text>
      </TouchableOpacity>
    </View>
  );
};
