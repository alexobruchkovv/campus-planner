import React, { useState } from 'react';
import { StyleSheet } from 'react-native';
import { spacing } from '../../theme/spacing';
import { CreateTaskInput, TaskDraft, TaskDraftErrors, TaskPriority } from '../../types/task';
import { draftToInput, hasErrors, inputToDraft, priorityLabels, taskPriorities, validateTaskDraft } from '../../utils/task';
import AppButton from '../ui/AppButton';
import AppInput from '../ui/AppInput';
import Card from '../ui/Card';
import SegmentedControl, { SegmentOption } from '../ui/SegmentedControl';

interface TaskFormProps {
  initialValues?: Partial<CreateTaskInput>;
  submitLabel: string;
  onSubmit: (input: CreateTaskInput) => void;
}

const priorityOptions: SegmentOption<TaskPriority>[] = taskPriorities.map((priority) => ({
  value: priority,
  label: priorityLabels[priority],
}));

export default function TaskForm({ initialValues, submitLabel, onSubmit }: TaskFormProps) {
  const [draft, setDraft] = useState<TaskDraft>(() => inputToDraft(initialValues));
  const [errors, setErrors] = useState<TaskDraftErrors>({});

  const setField = <K extends keyof TaskDraft>(field: K, value: TaskDraft[K]) => {
    setDraft((prev) => ({ ...prev, [field]: value }));
    // Ошибка поля исчезает, как только пользователь начинает его исправлять.
    if (field in errors) setErrors((prev) => ({ ...prev, [field]: undefined }));
  };

  const handleSubmit = () => {
    const nextErrors = validateTaskDraft(draft);
    setErrors(nextErrors);
    if (hasErrors(nextErrors)) return;
    onSubmit(draftToInput(draft));
  };

  return (
    <Card>
      <AppInput
        label="Название задачи"
        value={draft.title}
        onChangeText={(text) => setField('title', text)}
        placeholder="Например: Подготовить доклад"
        error={errors.title}
      />
      <AppInput
        label="Предмет"
        value={draft.subject}
        onChangeText={(text) => setField('subject', text)}
        placeholder="Например: Сети ЭВМ"
        error={errors.subject}
      />
      <AppInput
        label="Срок сдачи (необязательно)"
        value={draft.dueDate}
        onChangeText={(text) => setField('dueDate', text)}
        placeholder="ГГГГ-ММ-ДД"
        keyboardType="numbers-and-punctuation"
        maxLength={10}
        error={errors.dueDate}
        hint="Например: 2026-12-01"
      />
      <SegmentedControl
        label="Приоритет"
        options={priorityOptions}
        value={draft.priority}
        onChange={(priority) => setField('priority', priority)}
      />
      <AppButton title={submitLabel} onPress={handleSubmit} style={styles.submit} />
    </Card>
  );
}

const styles = StyleSheet.create({
  submit: { marginTop: spacing.xs },
});
