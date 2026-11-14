import React from 'react';
import { useLocalSearchParams, useRouter } from 'expo-router';
import TaskDetailsCard from '../../src/components/task/TaskDetailsCard';
import TaskNotFound from '../../src/components/task/TaskNotFound';
import AppButton from '../../src/components/ui/AppButton';
import Screen from '../../src/components/ui/Screen';
import { useTasks } from '../../src/hooks/useTasks';
import { confirmAction } from '../../src/services/dialogs';
import { routes, TaskRouteParams } from '../../src/types/navigation';

export default function TaskDetailsScreen() {
  const { id } = useLocalSearchParams<TaskRouteParams>();
  const router = useRouter();
  const { getTaskById, toggleTaskStatus, removeTask } = useTasks();

  const task = getTaskById(id);
  if (!task) return <TaskNotFound onBack={() => router.replace(routes.home)} />;

  const isCompleted = task.status === 'completed';

  const handleDelete = () =>
    confirmAction(
      {
        title: 'Удалить задачу?',
        message: `«${task.title}» будет удалена без возможности отмены.`,
        confirmLabel: 'Удалить',
        destructive: true,
      },
      () => {
        removeTask(task.id);
        router.back();
      }
    );

  return (
    <Screen scroll>
      <TaskDetailsCard task={task}>
        <AppButton
          title={isCompleted ? 'Отметить как невыполненное' : 'Отметить как выполненное'}
          onPress={() => toggleTaskStatus(task.id)}
        />
        <AppButton title="Редактировать" variant="secondary" onPress={() => router.push(routes.editTask(task.id))} />
        <AppButton title="Удалить задачу" variant="danger" onPress={handleDelete} />
      </TaskDetailsCard>
    </Screen>
  );
}
