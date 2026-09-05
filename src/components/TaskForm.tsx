import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { Task, TaskPriority } from '../types/task';

interface TaskFormProps {
  onAddTask: (task: Task) => void;
}

const priorities: TaskPriority[] = ['low', 'medium', 'high'];

const priorityLabels: Record<TaskPriority, string> = {
  low: 'Низкий',
  medium: 'Средний',
  high: 'Высокий',
};

export default function TaskForm({ onAddTask }: TaskFormProps) {
  const [title, setTitle] = useState('');
  const [subject, setSubject] = useState('');
  const [priority, setPriority] = useState<TaskPriority>('medium');
  const [titleError, setTitleError] = useState('');
  const [subjectError, setSubjectError] = useState('');

  const handleSubmit = () => {
    const trimmedTitle = title.trim();
    const trimmedSubject = subject.trim();

    let hasError = false;
    if (!trimmedTitle) {
      setTitleError('Введите название задачи');
      hasError = true;
    } else {
      setTitleError('');
    }

    if (!trimmedSubject) {
      setSubjectError('Введите предмет');
      hasError = true;
    } else {
      setSubjectError('');
    }

    if (hasError) return;

    const newTask: Task = {
      id: String(Date.now()),
      title: trimmedTitle,
      subject: trimmedSubject,
      priority,
      isCompleted: false,
    };

    onAddTask(newTask);

    setTitle('');
    setSubject('');
    setPriority('medium');
    setTitleError('');
    setSubjectError('');
  };

  return (
    <View style={styles.form}>
      <Text style={styles.label}>Название задачи</Text>
      <TextInput
        style={styles.input}
        value={title}
        onChangeText={setTitle}
        placeholder="Например: Подготовить доклад"
      />
      {titleError ? <Text style={styles.error}>{titleError}</Text> : null}

      <Text style={styles.label}>Предмет</Text>
      <TextInput
        style={styles.input}
        value={subject}
        onChangeText={setSubject}
        placeholder="Например: Сети ЭВМ"
      />
      {subjectError ? <Text style={styles.error}>{subjectError}</Text> : null}

      <Text style={styles.label}>Приоритет</Text>
      <View style={styles.priorityRow}>
        {priorities.map((p) => (
          <TouchableOpacity
            key={p}
            style={[
              styles.priorityOption,
              priority === p && styles.priorityOptionActive,
            ]}
            onPress={() => setPriority(p)}
          >
            <Text
              style={[
                styles.priorityOptionText,
                priority === p && styles.priorityOptionTextActive,
              ]}
            >
              {priorityLabels[p]}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
        <Text style={styles.submitButtonText}>Добавить</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  form: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 14,
    marginHorizontal: 12,
    marginBottom: 8,
  },
  label: {
    fontSize: 13,
    color: '#444',
    marginTop: 8,
    marginBottom: 4,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 8,
    fontSize: 14,
  },
  error: {
    color: '#f44336',
    fontSize: 12,
    marginTop: 4,
  },
  priorityRow: {
    flexDirection: 'row',
    gap: 8,
  },
  priorityOption: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    paddingVertical: 6,
    paddingHorizontal: 12,
  },
  priorityOptionActive: {
    backgroundColor: '#2196f3',
    borderColor: '#2196f3',
  },
  priorityOptionText: {
    fontSize: 13,
    color: '#444',
  },
  priorityOptionTextActive: {
    color: '#fff',
    fontWeight: '600',
  },
  submitButton: {
    backgroundColor: '#2196f3',
    borderRadius: 8,
    paddingVertical: 10,
    alignItems: 'center',
    marginTop: 14,
  },
  submitButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 15,
  },
});