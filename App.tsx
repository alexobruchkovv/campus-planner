import React, { useState } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  FlatList,
  StyleSheet,
  StatusBar,
} from 'react-native';
import TaskCard from './src/components/TaskCard';
import TaskForm from './src/components/TaskForm';
import { Task } from './src/types/task';

const initialTasks: Task[] = [
  {
    id: '1',
    title: 'Сделать лабораторную по сетям',
    subject: 'Сети ЭВМ',
    priority: 'high',
    isCompleted: false,
  },
  {
    id: '2',
    title: 'Прочитать главу учебника',
    subject: 'Матанализ',
    priority: 'low',
    isCompleted: true,
  },
  {
    id: '3',
    title: 'Подготовить презентацию',
    subject: 'История',
    priority: 'medium',
    isCompleted: false,
  },
  {
    id: '4',
    title: 'Сдать отчёт по практике',
    subject: 'Программирование',
    priority: 'high',
    isCompleted: false,
  },
];

export default function App() {
  const [tasks, setTasks] = useState<Task[]>(initialTasks);

  const completedCount = tasks.filter((task) => task.isCompleted).length;

  const handleAddTask = (newTask: Task) => {
    setTasks((prev) => [newTask, ...prev]);
  };

  const handleToggleStatus = (id: string) => {
    setTasks((prev) =>
      prev.map((task) =>
        task.id === id ? { ...task, isCompleted: !task.isCompleted } : task
      )
    );
  };

  const handleDelete = (id: string) => {
    setTasks((prev) => prev.filter((task) => task.id !== id));
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <Text style={styles.header}>Campus Planner</Text>

      <View style={styles.statsRow}>
        <Text style={styles.statsText}>Всего задач: {tasks.length}</Text>
        <Text style={styles.statsText}>Выполнено: {completedCount}</Text>
      </View>

      <TaskForm onAddTask={handleAddTask} />

      <FlatList
        data={tasks}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TaskCard
            task={item}
            onToggleStatus={handleToggleStatus}
            onDelete={handleDelete}
          />
        )}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>Список пока пуст</Text>
          </View>
        }
        contentContainerStyle={tasks.length === 0 && styles.emptyList}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f2f2f2',
  },
  header: {
    fontSize: 22,
    fontWeight: '700',
    textAlign: 'center',
    marginVertical: 12,
    color: '#222',
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 12,
  },
  statsText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
  },
  emptyContainer: {
    alignItems: 'center',
    marginTop: 40,
  },
  emptyText: {
    fontSize: 15,
    color: '#888',
  },
  emptyList: {
    flexGrow: 1,
  },
});