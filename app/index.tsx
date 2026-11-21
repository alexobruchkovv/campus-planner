import React, { useEffect, useMemo, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Animated from 'react-native-reanimated';
import { useRouter } from 'expo-router';
import SwipeableTaskCard from '../src/components/task/SwipeableTaskCard';
import TaskProgress from '../src/components/task/TaskProgress';
import TaskStatsBar from '../src/components/task/TaskStatsBar';
import AppButton from '../src/components/ui/AppButton';
import AppInput from '../src/components/ui/AppInput';
import EmptyState from '../src/components/ui/EmptyState';
import Screen from '../src/components/ui/Screen';
import SegmentedControl, { SegmentOption } from '../src/components/ui/SegmentedControl';
import UndoBar from '../src/components/ui/UndoBar';
import { useTasks } from '../src/hooks/useTasks';
import { useTheme } from '../src/hooks/useTheme';
import { confirmAction } from '../src/services/dialogs';
import { listAnimations, UNDO_TIMEOUT_MS } from '../src/theme/motion';
import { fontSize, spacing } from '../src/theme/spacing';
import { routes } from '../src/types/navigation';
import { Task, TaskStatusFilter } from '../src/types/task';
import { countTasks, selectVisibleTasks, statusFilterLabels, taskStatusFilters } from '../src/utils/task';

const statusOptions: SegmentOption<TaskStatusFilter>[] = taskStatusFilters.map((status) => ({
  value: status,
  label: statusFilterLabels[status],
}));

export default function TaskListScreen() {
  const router = useRouter();
  const { tasks, toggleTaskStatus, removeTask, restoreTask } = useTasks();
  const { colors } = useTheme();
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState<TaskStatusFilter>('all');
  // Доп. задание: последняя удалённая задача хранится до конца сеанса (только в памяти),
  // пока видна кнопка «Отменить».
  const [lastDeleted, setLastDeleted] = useState<DeletedTask | null>(null);

  const stats = useMemo(() => countTasks(tasks), [tasks]);
  const visibleTasks = useMemo(() => selectVisibleTasks(tasks, { search, status }), [tasks, search, status]);

  // Через 5 секунд плашка исчезает (exiting-анимация в UndoBar).
  // Новое удаление меняет key — таймер перезапускается.
  useEffect(() => {
    if (!lastDeleted) return;
    const timer = setTimeout(() => setLastDeleted(null), UNDO_TIMEOUT_MS);
    return () => clearTimeout(timer);
  }, [lastDeleted]);

  const handleDelete = (task: Task) =>
    confirmAction(
      {
        title: 'Удалить задачу?',
        message: `«${task.title}» будет удалена. Отменить можно в течение 5 секунд.`,
        confirmLabel: 'Удалить',
        destructive: true,
      },
      () => {
        // Запоминаем позицию в исходном массиве, чтобы вернуть задачу туда же.
        const index = tasks.findIndex((item) => item.id === task.id);
        removeTask(task.id);
        setLastDeleted({ task, index, key: Date.now() });
      }
    );

  const handleUndo = () => {
    if (!lastDeleted) return;
    restoreTask(lastDeleted.task, lastDeleted.index);
    setLastDeleted(null);
  };

  const resetFilters = () => {
    setSearch('');
    setStatus('all');
  };

  const emptyState =
    tasks.length === 0 ? (
      <EmptyState
        icon="📋"
        title="Список пока пуст"
        description="Добавьте первую задачу, чтобы ничего не забыть."
        actionLabel="Добавить задачу"
        onAction={() => router.push(routes.newTask)}
      />
    ) : (
      <EmptyState
        icon="🔍"
        title="Ничего не найдено"
        description="Попробуйте изменить запрос или фильтр."
        actionLabel="Сбросить фильтры"
        onAction={resetFilters}
      />
    );

  return (
    <Screen padded={false}>
      <View style={styles.controls}>
        <View style={styles.headerRow}>
          <Text style={[styles.header, { color: colors.text }]}>Campus Planner</Text>
          <AppButton title="Настройки" variant="secondary" size="sm" onPress={() => router.push(routes.settings)} />
        </View>

        <TaskStatsBar stats={stats} />
        <TaskProgress stats={stats} />

        <AppButton title="+ Добавить задачу" onPress={() => router.push(routes.newTask)} style={styles.addButton} />

        <AppInput
          value={search}
          onChangeText={setSearch}
          placeholder="Поиск по названию или предмету"
          accessibilityLabel="Поиск задач"
          autoCorrect={false}
          clearButtonMode="while-editing"
          returnKeyType="search"
        />
        <SegmentedControl options={statusOptions} value={status} onChange={setStatus} />
      </View>

      <Animated.FlatList
        data={visibleTasks}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          // Layout-анимации появления/удаления. Задача удаляется из состояния сразу,
          // а exiting проигрывается на «снимке» карточки и ничего не блокирует.
          <Animated.View entering={listAnimations.entering} exiting={listAnimations.exiting}>
            {/* Свайп вправо — статус, влево — удаление с подтверждением (ЛР №5). */}
            <SwipeableTaskCard
              task={item}
              onOpen={(id) => router.push(routes.taskDetails(id))}
              onEdit={(id) => router.push(routes.editTask(id))}
              onToggleStatus={toggleTaskStatus}
              onDelete={handleDelete}
            />
          </Animated.View>
        )}
        // Соседние карточки плавно сдвигаются на место удалённой.
        itemLayoutAnimation={listAnimations.layout}
        // При первом открытии экрана карточки не «въезжают» — анимируются только изменения.
        skipEnteringExitingAnimations
        ListEmptyComponent={emptyState}
        // Пока видна плашка «Отменить», добавляем место снизу, чтобы она не закрывала последнюю карточку.
        contentContainerStyle={[styles.listContent, lastDeleted && styles.listContentWithUndo]}
        keyboardShouldPersistTaps="handled"
      />

      {lastDeleted && (
        <UndoBar
          key={lastDeleted.key}
          message={`Задача «${lastDeleted.task.title}» удалена`}
          duration={UNDO_TIMEOUT_MS}
          onUndo={handleUndo}
        />
      )}
    </Screen>
  );
}

const styles = StyleSheet.create({
  controls: { paddingHorizontal: spacing.md, paddingTop: spacing.sm + spacing.xs },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm + spacing.xs,
  },
  header: { fontSize: fontSize.heading, fontWeight: '700' },
  addButton: { marginBottom: spacing.sm + spacing.xs },
  listContent: { flexGrow: 1, paddingHorizontal: spacing.md, paddingBottom: spacing.md },
  listContentWithUndo: { paddingBottom: 96 },
});

interface DeletedTask {
  task: Task;
  /** Позиция в исходном массиве задач до удаления. */
  index: number;
  /** Уникален для каждого удаления: перезапускает таймер и анимацию плашки. */
  key: number;
}
