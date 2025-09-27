import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { graphql } from '../generated';

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  headerLeft: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 32,
    fontWeight: '700',
    color: '#1a1a1a',
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 16,
    color: '#6b7280',
    fontWeight: '500',
  },
  createButton: {
    backgroundColor: '#3b82f6',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  createButtonText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '600',
  },
});

export const HeaderFragment = graphql(`
  fragment HeaderFragment on Query {
    todoCount
  }
`);

type Props = {
  todoCount: number;
  setShowCreateForm: (arg: boolean) => void;
};

export const Header = ({ todoCount, setShowCreateForm }: Props) => (
  <View style={styles.header}>
    <View style={styles.headerLeft}>
      <Text style={styles.headerTitle}>My Todos</Text>
      <Text style={styles.headerSubtitle}>{todoCount} tasks</Text>
    </View>
    <TouchableOpacity
      style={styles.createButton}
      onPress={() => setShowCreateForm(true)}
    >
      <Text style={styles.createButtonText}>+ Create</Text>
    </TouchableOpacity>
  </View>
);
