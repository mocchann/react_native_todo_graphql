import {
  Alert,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { useMutation } from '@apollo/client/react';
import { graphql } from '../generated';
import { useAppContext } from '../contexts/AppContext';

const CreateTodoDocument = graphql(`
  mutation CreateTodo($input: CreateTodoInput!) {
    createTodo(input: $input) {
      errors
      todo {
        id
        title
        content
      }
    }
  }
`);

const styles = StyleSheet.create({
  createForm: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  formTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1a1a1a',
  },
  input: {
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
    color: '#1a1a1a',
    backgroundColor: '#f9fafb',
    marginBottom: 12,
  },
  textArea: {
    height: 80,
    textAlignVertical: 'top',
  },
  formButtons: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 12,
  },
  cancelButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#d1d5db',
  },
  cancelButtonText: {
    color: '#6b7280',
    fontSize: 14,
    fontWeight: '500',
  },
  submitButton: {
    backgroundColor: '#3b82f6',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  submitButtonText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '600',
  },
});

export const CreateForm = () => {
  const { state, actions } = useAppContext();
  const [createTodo] = useMutation(CreateTodoDocument, {
    refetchQueries: ['Todos'],
  });

  const handleCreateTodo = async (title: string, content: string) => {
    if (!title.trim() || !content.trim()) {
      Alert.alert('Failed!', 'Please input form');
      return;
    }

    try {
      const result = await createTodo({
        variables: {
          input: {
            title,
            content,
            userId: state.user?.id || '',
            clientMutationId: String(Date.now()),
          },
        },
      });

      if (
        result.data &&
        result.data.createTodo &&
        result.data.createTodo.errors &&
        result.data.createTodo.errors.length > 0
      ) {
        Alert.alert('Error', result.data.createTodo.errors.join(', '));
        return;
      }

      actions.cancelTodo();
    } catch (error) {
      console.error('Create todo error:', error);
      Alert.alert('Error', 'Failed to create todo');
    }
  };

  return (
    <View style={styles.createForm}>
      <Text style={styles.formTitle}>New todo</Text>
      <TextInput
        style={styles.input}
        placeholder="Input title"
        value={state.newTodoTitle}
        onChangeText={actions.setTodoTitle}
        placeholderTextColor="#9ca3af"
        autoCapitalize="none"
        autoCorrect={false}
      />
      <TextInput
        style={[styles.input, styles.textArea]}
        placeholder="Input content"
        value={state.newTodoContent}
        onChangeText={actions.setTodoContent}
        multiline
        numberOfLines={3}
        placeholderTextColor="#9ca3af"
        autoCapitalize="none"
        autoCorrect={false}
      />
      <View style={styles.formButtons}>
        <TouchableOpacity
          style={styles.cancelButton}
          onPress={actions.cancelTodo}
        >
          <Text style={styles.cancelButtonText}>Cancel</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.submitButton}
          onPress={() =>
            handleCreateTodo(state.newTodoTitle, state.newTodoContent)
          }
        >
          <Text style={styles.submitButtonText}>Submit</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};
