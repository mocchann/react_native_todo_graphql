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
import { useMutation } from '@apollo/client/react';
import { graphql } from '../generated';
import { SignUpUserMutation } from '../generated/graphql';

const SignUpDocument = graphql(`
  mutation SignUpUser($input: SignUpInput!) {
    signUp(input: $input) {
      user {
        id
        email
      }
    }
  }
`);

export const SignUpScreen = () => {
  const { state, actions } = useAppContext();
  const [signUp] = useMutation<SignUpUserMutation>(SignUpDocument);
  const safeAreaInsets = useSafeAreaInsets();

  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleSignUp = async () => {
    if (!username || !email || !password || !confirmPassword) {
      Alert.alert('エラー', 'すべてのフィールドを入力してください');
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert('エラー', 'パスワードが一致しません');
      return;
    }

    if (password.length < 6) {
      Alert.alert('エラー', 'パスワードは6文字以上で入力してください');
      return;
    }

    try {
      actions.setLoading(true);

      const result = await signUp({
        variables: {
          input: {
            input: {
              username: username,
              email: email,
              password: password,
              passwordConfirmation: confirmPassword,
            },
            clientMutationId: String(Date.now()),
          },
        },
      });

      if (result.data?.signUp?.user) {
        actions.loginSuccess(result.data.signUp.user);
        Alert.alert('成功', 'アカウントが作成されました！');
      } else {
        Alert.alert('エラー', 'アカウントの作成に失敗しました');
      }
    } catch (error) {
      console.error('SignUp error:', error);
      Alert.alert('エラー', 'アカウントの作成に失敗しました');
    } finally {
      actions.setLoading(false);
    }
  };

  return (
    <SafeAreaView
      style={[styles.container, { paddingTop: safeAreaInsets.top }]}
    >
      <View style={styles.content}>
        <Text style={styles.title}>アカウント作成</Text>

        <View style={styles.form}>
          <TextInput
            style={styles.input}
            placeholder="ユーザー名"
            value={username}
            onChangeText={setUsername}
            autoCapitalize="none"
            autoCorrect={false}
          />

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

          <TextInput
            style={styles.input}
            placeholder="パスワード確認"
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            secureTextEntry
            autoCapitalize="none"
            autoCorrect={false}
          />

          <TouchableOpacity
            style={[styles.button, state.isLoading && styles.buttonDisabled]}
            onPress={handleSignUp}
            disabled={state.isLoading}
          >
            {state.isLoading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.buttonText}>アカウント作成</Text>
            )}
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.linkButton}
            onPress={() => {
              // todo: タブナビゲーションでSignIn画面に移動
            }}
          >
            <Text style={styles.linkText}>
              すでにアカウントをお持ちの方はこちら
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
