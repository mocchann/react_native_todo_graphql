import { Alert, Text, TouchableOpacity, View } from 'react-native';
import { useAppContext } from '../contexts/AppContext';
import { graphql } from '../generated';
import { useGraphQLClient } from '../graphql/apolloClient';

const SignOutDocument = graphql(`
  mutation SignOutUser($input: SignOutInput!) {
    signOut(input: $input) {
      success
    }
  }
`);

export const ProfileScreen = () => {
  const { state, actions } = useAppContext();
  const client = useGraphQLClient();
  const [signOutResult, signOut] = client.mutation(SignOutDocument);

  const handleLogout = () => {
    Alert.alert('ログアウト', 'ログアウトしますか？', [
      { text: 'キャンセル', style: 'cancel' },
      {
        text: 'ログアウト',
        onPress: () => {
          signOut({
            variables: {
              input: {
                clientMutationId: String(Date.now()),
              },
            },
          });
          actions.logout();
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
