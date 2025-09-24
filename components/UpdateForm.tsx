import {
  Alert,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { graphql } from '../generated';
import {
  DeleteTodoMutation,
  DeleteTodoMutationVariables,
  UpdateTodoMutation,
  UpdateTodoMutationVariables,
} from '../generated/graphql';
import { OperationResult } from 'urql';
import { useAppContext } from '../contexts/AppContext';

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

export const UpdateTodoFragment = graphql(`
  fragment UpdateTodoFragment on UpdateTodoPayload {
    errors
    todo {
      id
      title
      content
    }
  }
`);

export const DeleteTodoFragment = graphql(`
  fragment DeleteTodoFragment on DeleteTodoPayload {
    errors
    todo {
      id
    }
  }
`);

type UpdateFormProps = {
  todoId: number;
  updateTodo: (
    variables: UpdateTodoMutationVariables,
  ) => Promise<OperationResult<UpdateTodoMutation> & { updateData?: any }>;
  deleteTodo: (
    variables: DeleteTodoMutationVariables,
  ) => Promise<OperationResult<DeleteTodoMutation> & { deleteData?: any }>;
};

export const UpdateForm = ({
  todoId,
  updateTodo,
  deleteTodo,
}: UpdateFormProps) => {
  const { state, actions } = useAppContext();

  const handleUpdateTodo = (todoId: number, title: string, content: string) => {
    if (!todoId || !title.trim() || !content.trim()) {
      Alert.alert('Failed!', 'Please input form');
      return;
    }
    updateTodo({
      input: {
        id: todoId,
        title,
        content,
        clientMutationId: String(Date.now()),
      },
    }).then((result: any) => {
      if (result.error) {
        console.error('Oh no!', result.error);
        return;
      }
    });
    actions.cancelTodo();
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
        onPress: () =>
          deleteTodo({
            input: { id: todoId, clientMutationId: String(Date.now()) },
          }).then((result: any) => {
            if (result.error) {
              console.error('Delete failed!', result.error);
              return;
            }
          }),
      },
    ]);
    actions.cancelTodo();
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
