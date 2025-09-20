import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Todo } from '../generated/graphql';
import { graphql } from '../generated';

const styles = StyleSheet.create({
  todoCard: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 20,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  todoContent: {
    flex: 1,
  },
  todoTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1a1a1a',
    marginBottom: 4,
  },
  todoDescription: {
    fontSize: 14,
    color: '#6b7280',
    lineHeight: 20,
  },
  todoIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#3b82f6',
    marginLeft: 12,
  },
});

export const TodosFragment = graphql(`
  fragment TodosFragment on Query {
    todos {
      id
      title
      content
    }
  }
`);

type TodoItem = Pick<Todo, 'id' | 'title' | 'content'>;

type Props = {
  item: TodoItem;
  setSelectedTodo: (todoItem: TodoItem) => void;
  setNewTodoTitle: (title: string) => void;
  setNewTodoContent: (content: string) => void;
  setShowUpdateForm: (arg: boolean) => void;
};

export const TodoCard = ({
  item,
  setSelectedTodo,
  setNewTodoTitle,
  setNewTodoContent,
  setShowUpdateForm,
}: Props) => (
  <TouchableOpacity
    style={styles.todoCard}
    onPress={() => {
      setSelectedTodo(item);
      setNewTodoTitle(item.title || '');
      setNewTodoContent(item.content || '');
      setShowUpdateForm(true);
    }}
  >
    <View style={styles.todoContent}>
      <Text style={styles.todoTitle}>{item.title}</Text>
      {item.content && (
        <Text style={styles.todoDescription}>{item.content}</Text>
      )}
    </View>
    <View style={styles.todoIndicator} />
  </TouchableOpacity>
);
