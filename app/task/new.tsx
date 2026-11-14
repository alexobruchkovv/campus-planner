import React from 'react';
import { useRouter } from 'expo-router';
import TaskForm from '../../src/components/task/TaskForm';
import Screen from '../../src/components/ui/Screen';
import { useTasks } from '../../src/hooks/useTasks';
import { CreateTaskInput } from '../../src/types/task';

export default function NewTaskScreen() {
  const router = useRouter();
  const { createTask } = useTasks();

  const handleSubmit = (input: CreateTaskInput) => {
    createTask(input);
    router.back();
  };

  return (
    <Screen scroll>
      <TaskForm submitLabel="Создать задачу" onSubmit={handleSubmit} />
    </Screen>
  );
}
