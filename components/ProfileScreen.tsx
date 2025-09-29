import { Alert, Text, TouchableOpacity, View } from 'react-native';
import { useAppContext } from '../contexts/AppContext';
import { useMutation } from '@apollo/client/react';
import { graphql } from '../generated';
import { SignOutUserMutation } from '../generated/graphql';

const SignOutDocument = graphql(`
  mutation SignOutUser($input: SignOutInput!) {
    signOut(input: $input) {
      success
    }
  }
`);

export const ProfileScreen = () => {
  const { state, actions } = useAppContext();
  const [signOut] = useMutation<SignOutUserMutation>(SignOutDocument);

  const handleLogout = () => {
    Alert.alert('ログアウト', 'ログアウトしますか？', [
      { text: 'キャンセル', style: 'cancel' },
      {
        text: 'ログアウト',
        onPress: async () => {
          try {
            await signOut({
              variables: {
                input: {
                  clientMutationId: String(Date.now()),
                },
              },
            });
            actions.logout();
          } catch (error) {
            console.error('SignOut error:', error);
            actions.logout();
          }
        },
      },
    ]);
  };

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
        ログイン中:{state.user?.email}
      </Text>
      <TouchableOpacity
        style={{
          backgroundColor: '#ff6b6b',
          paddingHorizontal: 20,
          paddingVertical: 10,
          borderRadius: 8,
        }}
        onPress={handleLogout}
      >
        <Text style={{ color: '#fff', fontSize: 16, fontWeight: 'bold' }}>
          ログアウト
        </Text>
      </TouchableOpacity>
    </View>
  );
};
