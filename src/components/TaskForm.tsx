import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { Task, TaskPriority } from '../types/task';
import { useTheme } from '../context/ThemeContext';

type TaskFormValues = Pick<Task, 'title' | 'subject' | 'priority'>;

interface TaskFormProps {
  initialValues?: TaskFormValues;
  submitLabel?: string;
  onSubmit: (values: TaskFormValues) => void;
}

const priorities: TaskPriority[] = ['low', 'medium', 'high'];
const priorityLabels: Record<TaskPriority, string> = {
  low: 'Низкий',
  medium: 'Средний',
  high: 'Высокий',
};

export default function TaskForm({ initialValues, submitLabel = 'Добавить', onSubmit }: TaskFormProps) {
  const { colors } = useTheme();
  const [title, setTitle] = useState(initialValues?.title ?? '');
  const [subject, setSubject] = useState(initialValues?.subject ?? '');
  const [priority, setPriority] = useState<TaskPriority>(initialValues?.priority ?? 'medium');
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

    onSubmit({ title: trimmedTitle, subject: trimmedSubject, priority });

    if (!initialValues) {
      setTitle('');
      setSubject('');
      setPriority('medium');
      setTitleError('');
      setSubjectError('');
    }
  };

  return (
    <View style={[styles.form, { backgroundColor: colors.card }]}>
      <Text style={[styles.label, { color: colors.subtitle }]}>Название задачи</Text>
      <TextInput
        style={[styles.input, { borderColor: colors.border, color: colors.text }]}
        value={title}
        onChangeText={setTitle}
        placeholder="Например: Подготовить доклад"
        placeholderTextColor={colors.subtitle}
      />
      {titleError ? <Text style={styles.error}>{titleError}</Text> : null}

      <Text style={[styles.label, { color: colors.subtitle }]}>Предмет</Text>
      <TextInput
        style={[styles.input, { borderColor: colors.border, color: colors.text }]}
        value={subject}
        onChangeText={setSubject}
        placeholder="Например: Сети ЭВМ"
        placeholderTextColor={colors.subtitle}
      />
      {subjectError ? <Text style={styles.error}>{subjectError}</Text> : null}

      <Text style={[styles.label, { color: colors.subtitle }]}>Приоритет</Text>
      <View style={styles.priorityRow}>
        {priorities.map((p) => (
          <TouchableOpacity
            key={p}
            style={[
              styles.priorityOption,
              { borderColor: colors.border },
              priority === p && { backgroundColor: colors.primary, borderColor: colors.primary },
            ]}
            onPress={() => setPriority(p)}
          >
            <Text
              style={[
                styles.priorityOptionText,
                { color: colors.text },
                priority === p && styles.priorityOptionTextActive,
              ]}
            >
              {priorityLabels[p]}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <TouchableOpacity style={[styles.submitButton, { backgroundColor: colors.primary }]} onPress={handleSubmit}>
        <Text style={styles.submitButtonText}>{submitLabel}</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  form: { borderRadius: 12, padding: 14, marginHorizontal: 12, marginTop: 12 },
  label: { fontSize: 13, marginTop: 8, marginBottom: 4 },
  input: { borderWidth: 1, borderRadius: 8, paddingHorizontal: 10, paddingVertical: 8, fontSize: 14 },
  error: { color: '#f44336', fontSize: 12, marginTop: 4 },
  priorityRow: { flexDirection: 'row', gap: 8 },
  priorityOption: { borderWidth: 1, borderRadius: 8, paddingVertical: 6, paddingHorizontal: 12 },
  priorityOptionText: { fontSize: 13 },
  priorityOptionTextActive: { color: '#fff', fontWeight: '600' },
  submitButton: { borderRadius: 8, paddingVertical: 10, alignItems: 'center', marginTop: 14 },
  submitButtonText: { color: '#fff', fontWeight: '600', fontSize: 15 },
});