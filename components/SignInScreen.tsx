import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
  SafeAreaView,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAppContext } from '../contexts/AppContext';
import { useGraphQLClient } from '../graphql/apolloClient';
import { graphql } from '../generated';

const SignInUserDocument = graphql(`
  mutation SignInUser($input: SignInInput!) {
    signIn(input: $input) {
      user {
        id
        email
      }
    }
  }
`);

export const SignInScreen = () => {
  const { state, actions } = useAppContext();
  const client = useGraphQLClient();
  const [signInResult, signIn] = client.mutation(SignInUserDocument);
  const safeAreaInsets = useSafeAreaInsets();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSignIn = async () => {
    if (!email || !password) {
      Alert.alert('エラー', 'メールアドレスとパスワードを入力してください');
      return;
    }

    try {
      actions.setLoading(true);
      const result = await signIn({
        input: {
          email,
          password,
        },
      });

      if (result.data?.signIn?.user) {
        actions.loginSuccess(result.data.signIn.user);
        Alert.alert('成功', 'ログインしました！');
      } else {
        Alert.alert('エラー', 'ログインに失敗しました');
      }
    } catch (error) {
      console.error('SignIn error:', error);
      Alert.alert('エラー', 'ログインに失敗しました');
    } finally {
      actions.setLoading(false);
    }
  };

  return (
    <SafeAreaView
      style={[styles.container, { paddingTop: safeAreaInsets.top }]}
    >
      <View style={styles.content}>
        <Text style={styles.title}>ログイン</Text>

        <View style={styles.form}>
          <TextInput
            style={styles.input}
            placeholder="メールアドレス"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
          />

          <TextInput
            style={styles.input}
            placeholder="パスワード"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            autoCapitalize="none"
            autoCorrect={false}
          />

          <TouchableOpacity
            style={[styles.button, state.isLoading && styles.buttonDisabled]}
            onPress={handleSignIn}
            disabled={state.isLoading}
          >
            {state.isLoading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.buttonText}>ログイン</Text>
            )}
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.linkButton}
            onPress={() => {
              // todo: タブナビゲーションでSignUp画面に移動
            }}
          >
            <Text style={styles.linkText}>
              アカウントをお持ちでない方はこちら
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  content: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 30,
    color: '#333',
  },
  form: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 15,
    marginBottom: 15,
    fontSize: 16,
    backgroundColor: '#f9f9f9',
  },
  button: {
    backgroundColor: '#007AFF',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
  },
  buttonDisabled: {
    backgroundColor: '#ccc',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  linkButton: {
    marginTop: 15,
    alignItems: 'center',
  },
  linkText: {
    color: '#007AFF',
    fontSize: 14,
    textDecorationLine: 'underline',
  },
});
