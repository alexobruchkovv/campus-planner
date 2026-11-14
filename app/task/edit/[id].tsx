import React from 'react';
import { useLocalSearchParams, useRouter } from 'expo-router';
import TaskForm from '../../../src/components/task/TaskForm';
import TaskNotFound from '../../../src/components/task/TaskNotFound';
import Screen from '../../../src/components/ui/Screen';
import { useTasks } from '../../../src/hooks/useTasks';
import { routes, TaskRouteParams } from '../../../src/types/navigation';
import { CreateTaskInput } from '../../../src/types/task';

export default function EditTaskScreen() {
  const { id } = useLocalSearchParams<TaskRouteParams>();
  const router = useRouter();
  const { getTaskById, updateTask } = useTasks();

  const task = getTaskById(id);
  if (!task) return <TaskNotFound onBack={() => router.replace(routes.home)} />;

  const handleSubmit = (input: CreateTaskInput) => {
    updateTask(task.id, input);
    router.back();
  };

  return (
    <Screen scroll>
      <TaskForm initialValues={task} submitLabel="Сохранить изменения" onSubmit={handleSubmit} />
    </Screen>
  );
}
