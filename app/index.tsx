import React from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { useTasks } from '../src/context/TasksContext';
import { useTheme } from '../src/context/ThemeContext';
import TaskCard from '../src/components/TaskCard';

export default function TaskListScreen() {
  const router = useRouter();
  const { tasks } = useTasks();
  const { colors } = useTheme();

  const completedCount = tasks.filter((task) => task.isCompleted).length;

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.headerRow}>
        <Text style={[styles.header, { color: colors.text }]}>Campus Planner</Text>
        <TouchableOpacity onPress={() => router.push('/settings')}>
          <Text style={{ color: colors.primary, fontWeight: '600' }}>Настройки</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.statsRow}>
        <Text style={{ color: colors.text, fontWeight: '600' }}>Всего задач: {tasks.length}</Text>
        <Text style={{ color: colors.text, fontWeight: '600' }}>Выполнено: {completedCount}</Text>
      </View>

      <TouchableOpacity
        style={[styles.addButton, { backgroundColor: colors.primary }]}
        onPress={() => router.push('/task/new')}
      >
        <Text style={styles.addButtonText}>+ Добавить задачу</Text>
      </TouchableOpacity>

      <FlatList
        data={tasks}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TaskCard
            task={item}
            onPress={(id) => router.push({ pathname: '/task/[id]', params: { id } })}
          />
        )}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={{ color: colors.subtitle }}>Список пока пуст</Text>
          </View>
        }
        contentContainerStyle={tasks.length === 0 ? styles.emptyList : undefined}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, paddingTop: 12 },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginBottom: 8,
  },
  header: { fontSize: 22, fontWeight: '700' },
  statsRow: { flexDirection: 'row', justifyContent: 'space-around', marginBottom: 12 },
  addButton: { marginHorizontal: 12, borderRadius: 8, paddingVertical: 10, alignItems: 'center', marginBottom: 8 },
  addButtonText: { color: '#fff', fontWeight: '600' },
  emptyContainer: { alignItems: 'center', marginTop: 40 },
  emptyList: { flexGrow: 1 },
});