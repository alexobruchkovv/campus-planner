import React, { useEffect, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import Animated, {
  Extrapolation,
  interpolate,
  interpolateColor,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withSequence,
  withTiming,
} from 'react-native-reanimated';
import { useAnimatedFlag } from '../../hooks/useAnimatedFlag';
import { useTheme } from '../../hooks/useTheme';
import { motion } from '../../theme/motion';
import { fontSize, radius, spacing } from '../../theme/spacing';
import { Task } from '../../types/task';
import { formatDateString } from '../../utils/date';
import { isRecentlyCreated } from '../../utils/task';
import AppButton from '../ui/AppButton';
import Collapsible from '../ui/Collapsible';
import DueDateLabel from './DueDateLabel';
import PriorityBadge from './PriorityBadge';
import TaskStatusToggle from './TaskStatusToggle';

interface TaskCardProps {
  task: Task;
  onOpen: (id: string) => void;
  onToggleStatus: (id: string) => void;
  onEdit: (id: string) => void;
  onDelete: (task: Task) => void;
}

export default function TaskCard({ task, onOpen, onToggleStatus, onEdit, onDelete }: TaskCardProps) {
  const { colors } = useTheme();
  const isCompleted = task.status === 'completed';
  // Раскрытие — локальное состояние интерфейса, после перезапуска не сохраняется.
  const [expanded, setExpanded] = useState(false);

  // 1. Смена статуса: значение берётся из task.status, SharedValue лишь анимирует переход.
  const statusProgress = useAnimatedFlag(isCompleted, 'spring');
  // 2. Раскрытие блока «Подробнее».
  const expandProgress = useAnimatedFlag(expanded, 'timing');
  // Доп. задание: краткая подсветка только что созданной карточки.
  const highlight = useSharedValue(0);

  useEffect(() => {
    if (!isRecentlyCreated(task)) return;
    // Сначала карточка появляется (entering в списке), затем кратко подсвечивается.
    highlight.value = withDelay(
      motion.highlight.delay,
      withSequence(
        withTiming(1, { duration: motion.highlight.fadeIn }),
        withTiming(0, { duration: motion.highlight.fadeOut })
      )
    );
    // Подсветка нужна один раз — при первом появлении карточки.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const cardStyle = useAnimatedStyle(() => ({
    backgroundColor: interpolateColor(statusProgress.value, [0, 1], [colors.card, colors.successSoft]),
    borderColor: interpolateColor(highlight.value, [0, 1], [colors.border, colors.primary]),
  }));

  const contentStyle = useAnimatedStyle(() => ({
    opacity: interpolate(statusProgress.value, [0, 1], [1, 0.6], Extrapolation.CLAMP),
  }));

  const highlightStyle = useAnimatedStyle(() => ({
    opacity: highlight.value * 0.18,
  }));

  const chevronStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${expandProgress.value * 180}deg` }],
  }));

  return (
    <Animated.View style={[styles.card, cardStyle]}>
      <Animated.View
        style={[StyleSheet.absoluteFill, { backgroundColor: colors.primary, pointerEvents: 'none' }, highlightStyle]}
      />

      <View style={styles.header}>
        <TaskStatusToggle checked={isCompleted} onToggle={() => onToggleStatus(task.id)} />
        <Pressable
          accessibilityRole="button"
          accessibilityHint="Открыть детали задачи"
          onPress={() => onOpen(task.id)}
          style={({ pressed }) => [styles.titleArea, pressed && styles.pressed]}
        >
          <Animated.Text
            style={[styles.title, { color: colors.text }, isCompleted && styles.titleCompleted, contentStyle]}
            numberOfLines={2}
          >
            {task.title}
          </Animated.Text>
        </Pressable>
        <PriorityBadge priority={task.priority} />
      </View>

      <Pressable
        onPress={() => setExpanded((value) => !value)}
        accessibilityRole="button"
        accessibilityState={{ expanded }}
        hitSlop={6}
        style={styles.toggle}
      >
        <Text style={[styles.toggleText, { color: colors.primary }]}>{expanded ? 'Свернуть' : 'Подробнее'}</Text>
        <Animated.Text style={[styles.toggleText, { color: colors.primary }, chevronStyle]}>▾</Animated.Text>
      </Pressable>

      <Collapsible expanded={expanded} progress={expandProgress}>
        <View style={[styles.details, { borderTopColor: colors.border }]}>
          <Text style={[styles.detailText, { color: colors.subtitle }]}>Предмет: {task.subject}</Text>
          {task.dueDate ? (
            <DueDateLabel task={task} />
          ) : (
            <Text style={[styles.detailText, { color: colors.subtitle }]}>Срок не указан</Text>
          )}
          <Text style={[styles.detailText, { color: colors.subtitle }]}>
            Создана: {formatDateString(task.createdAt)}
          </Text>
          <Text style={[styles.description, { color: colors.text }]}>
            {task.description || 'Описание не добавлено'}
          </Text>
          <View style={styles.actions}>
            <AppButton title="Изменить" variant="secondary" size="sm" onPress={() => onEdit(task.id)} />
            <AppButton title="Удалить" variant="danger" size="sm" onPress={() => onDelete(task)} />
          </View>
        </View>
      </Collapsible>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: radius.md,
    borderWidth: 1,
    padding: spacing.md,
    // Внешний отступ задаёт обёртка SwipeableTaskCard: фон действий должен совпадать с карточкой по размеру.
    overflow: 'hidden',
  },
  header: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm + spacing.xs },
  titleArea: { flex: 1 },
  pressed: { opacity: 0.6 },
  title: { fontSize: fontSize.subtitle, fontWeight: '600' },
  titleCompleted: { textDecorationLine: 'line-through' },
  toggle: { flexDirection: 'row', alignItems: 'center', gap: spacing.xs, alignSelf: 'flex-start', marginTop: spacing.sm },
  toggleText: { fontSize: fontSize.body - 1, fontWeight: '600' },
  details: {
    borderTopWidth: StyleSheet.hairlineWidth,
    marginTop: spacing.sm,
    paddingTop: spacing.sm,
    gap: spacing.xs + 2,
  },
  detailText: { fontSize: fontSize.caption + 1 },
  description: { fontSize: fontSize.body, lineHeight: 20 },
  actions: { flexDirection: 'row', gap: spacing.sm, marginTop: spacing.xs },
});
