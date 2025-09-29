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

const UpdateTodoDocument = graphql(`
  mutation UpdateTodo($input: UpdateTodoInput!) {
    updateTodo(input: $input) {
      errors
      todo {
        id
        title
        content
      }
    }
  }
`);

const DeleteTodoDocument = graphql(`
  mutation DeleteTodo($input: DeleteTodoInput!) {
    deleteTodo(input: $input) {
      errors
      todo {
        id
      }
    }
  }
`);

const styles = StyleSheet.create({
  updateForm: {
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
  formTitleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  formTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1a1a1a',
  },
  deleteButton: {
    backgroundColor: '#ef4444',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  deleteButtonText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '600',
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

type UpdateFormProps = {
  todoId: number;
};

export const UpdateForm = ({ todoId }: UpdateFormProps) => {
  const { state, actions } = useAppContext();
  const [updateTodo] = useMutation(UpdateTodoDocument, {
    refetchQueries: ['Todos'],
  });
  const [deleteTodo] = useMutation(DeleteTodoDocument, {
    refetchQueries: ['Todos'],
  });

  const handleUpdateTodo = async (
    todoId: number,
    title: string,
    content: string,
  ) => {
    if (!todoId || !title.trim() || !content.trim()) {
      Alert.alert('Failed!', 'Please input form');
      return;
    }

    try {
      const result = await updateTodo({
        variables: {
          input: {
            id: todoId,
            title,
            content,
            userId: state?.user?.id || '',
            clientMutationId: String(Date.now()),
          },
        },
      });

      if (
        result.data &&
        result.data.updateTodo &&
        result.data.updateTodo.errors &&
        result.data.updateTodo.errors.length > 0
      ) {
        Alert.alert('Error', result.data.updateTodo.errors.join(', '));
        return;
      }

      actions.cancelTodo();
    } catch (error) {
      console.error('Update todo error:', error);
      Alert.alert('Error', 'Failed to update todo');
    }
  };

  const handleDeleteTodo = (todoId: number) => {
    if (!todoId) {
      Alert.alert('Failed!', 'Invalid todo id');
      return;
    }
    Alert.alert('Are you Sure?', 'Delete the Todo', [
      {
        text: 'Cancel',
        onPress: () => console.log('cancel'),
      },
      {
        text: 'OK',
        onPress: async () => {
          try {
            const result = await deleteTodo({
              variables: {
                input: {
                  id: todoId,
                  userId: state?.user?.id || '',
                  clientMutationId: String(Date.now()),
                },
              },
            });

            if (
              result.data &&
              result.data.deleteTodo &&
              result.data.deleteTodo.errors &&
              result.data.deleteTodo.errors.length > 0
            ) {
              Alert.alert('Error', result.data.deleteTodo.errors.join(', '));
              return;
            }

            actions.cancelTodo();
          } catch (error) {
            console.error('Delete todo error:', error);
            Alert.alert('Error', 'Failed to delete todo');
          }
        },
      },
    ]);
  };

  return (
    <View style={styles.updateForm}>
      <View style={styles.formTitleRow}>
        <Text style={styles.formTitle}>Update todo</Text>
        <TouchableOpacity
          style={styles.deleteButton}
          onPress={() => handleDeleteTodo(todoId)}
        >
          <Text style={styles.deleteButtonText}>Delete</Text>
        </TouchableOpacity>
      </View>
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
            handleUpdateTodo(todoId, state.newTodoTitle, state.newTodoContent)
          }
        >
          <Text style={styles.submitButtonText}>Submit</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};
