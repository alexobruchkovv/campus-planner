import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import TaskForm from '../../../src/components/TaskForm';
import { useTasks } from '../../../src/context/TasksContext';
import { useTheme } from '../../../src/context/ThemeContext';
import { Task } from '../../../src/types/task';

export default function EditTaskScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { getTaskById, updateTask } = useTasks();
  const { colors } = useTheme();

  const task = getTaskById(id);

  if (!task) {
    return (
      <View style={[styles.container, styles.centered, { backgroundColor: colors.background }]}>
        <Text style={{ color: colors.text, fontSize: 16, marginBottom: 16 }}>Задача не найдена</Text>
        <TouchableOpacity style={[styles.button, { backgroundColor: colors.primary }]} onPress={() => router.replace('/')}>
          <Text style={styles.buttonText}>Вернуться к списку</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const handleSubmit = (values: Pick<Task, 'title' | 'subject' | 'priority'>) => {
    updateTask(task.id, values);
    router.back();
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <TaskForm
        initialValues={{ title: task.title, subject: task.subject, priority: task.priority }}
        submitLabel="Сохранить изменения"
        onSubmit={handleSubmit}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  centered: { justifyContent: 'center', alignItems: 'center', padding: 16 },
  button: { borderRadius: 8, paddingVertical: 10, paddingHorizontal: 16, alignItems: 'center' },
  buttonText: { color: '#fff', fontWeight: '600' },
});