import React from 'react';
import { View, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import TaskForm from '../../src/components/TaskForm';
import { useTasks } from '../../src/context/TasksContext';
import { useTheme } from '../../src/context/ThemeContext';
import { Task } from '../../src/types/task';

export default function NewTaskScreen() {
  const router = useRouter();
  const { addTask } = useTasks();
  const { colors } = useTheme();

  const handleSubmit = (values: Pick<Task, 'title' | 'subject' | 'priority'>) => {
    const newTask: Task = {
      id: String(Date.now()),
      ...values,
      isCompleted: false,
    };
    addTask(newTask);
    router.back();
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <TaskForm submitLabel="Создать задачу" onSubmit={handleSubmit} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
});