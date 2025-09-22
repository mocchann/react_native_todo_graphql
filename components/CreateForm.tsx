import {
  Alert,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { graphql } from '../generated';
import { OperationResult } from 'urql';
import {
  CreateTodoMutation,
  CreateTodoMutationVariables,
} from '../generated/graphql';

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

export const CreateTodoFragment = graphql(`
  fragment CreateTodoFragment on CreateTodoPayload {
    errors
    todo {
      id
      title
      content
    }
  }
`);

type Props = {
  newTodoTitle: string;
  setNewTodoTitle: (newTitle: string) => void;
  newTodoContent: string;
  setNewTodoContent: (newTodo: string) => void;
  handleCancelCreate: () => void;
  createTodo: (
    variables: CreateTodoMutationVariables,
  ) => Promise<OperationResult<CreateTodoMutation> & { createData?: any }>;
};

export const CreateForm = ({
  newTodoTitle,
  setNewTodoTitle,
  newTodoContent,
  setNewTodoContent,
  handleCancelCreate,
  createTodo,
}: Props) => {
  const handleCreateTodo = (title: string, content: string) => {
    if (!title.trim() || !content.trim()) {
      Alert.alert('Failed!', 'Please input form');
      return;
    }
    createTodo({
      input: { title, content, clientMutationId: String(Date.now()) },
    }).then(result => {
      if (result.error) {
        console.error('Oh, no!', result.error);
        return;
      }
      if (result.createData?.errors && result.createData.errors.length > 0) {
        Alert.alert('Error', result.createData.errors.join(', '));
        return;
      }
    });
    handleCancelCreate();
  };

  return (
    <View style={styles.createForm}>
      <Text style={styles.formTitle}>New todo</Text>
      <TextInput
        style={styles.input}
        placeholder="Input title"
        value={newTodoTitle}
        onChangeText={setNewTodoTitle}
        placeholderTextColor="#9ca3af"
        autoCapitalize="none"
        autoCorrect={false}
      />
      <TextInput
        style={[styles.input, styles.textArea]}
        placeholder="Input content"
        value={newTodoContent}
        onChangeText={setNewTodoContent}
        multiline
        numberOfLines={3}
        placeholderTextColor="#9ca3af"
        autoCapitalize="none"
        autoCorrect={false}
      />
      <View style={styles.formButtons}>
        <TouchableOpacity
          style={styles.cancelButton}
          onPress={handleCancelCreate}
        >
          <Text style={styles.cancelButtonText}>Cancel</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.submitButton}
          onPress={() => handleCreateTodo(newTodoTitle, newTodoContent)}
        >
          <Text style={styles.submitButtonText}>Submit</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};
