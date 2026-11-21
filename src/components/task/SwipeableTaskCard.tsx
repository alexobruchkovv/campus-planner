import React, { useCallback, useMemo, useRef } from 'react';
import { StyleSheet, View } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, {
  Extrapolation,
  interpolate,
  interpolateColor,
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
import { useTheme } from '../../hooks/useTheme';
import {
  SWIPE_ACTION_THRESHOLD,
  SWIPE_ACTIVATION_OFFSET,
  SWIPE_FAIL_OFFSET_Y,
  SWIPE_MAX_OFFSET,
  swipeSpring,
} from '../../theme/motion';
import { fontSize, radius, spacing } from '../../theme/spacing';
import { Task } from '../../types/task';
import TaskCard from './TaskCard';

interface SwipeableTaskCardProps {
  task: Task;
  onOpen: (id: string) => void;
  onToggleStatus: (id: string) => void;
  onEdit: (id: string) => void;
  /** Запрос удаления: экран сам показывает подтверждение. */
  onDelete: (task: Task) => void;
}

/** Сколько миллисекунд после свайпа игнорировать нажатия внутри карточки. */
const PRESS_GUARD_MS = 350;

/**
 * Карточка задачи со свайпом:
 *  вправо — сменить статус (выполнено ↔ в процессе),
 *  влево — запросить удаление (с подтверждением).
 * Если палец отпущен раньше порога, карточка пружиной возвращается на место.
 */
export default function SwipeableTaskCard({ task, onOpen, onToggleStatus, onEdit, onDelete }: SwipeableTaskCardProps) {
  const { colors } = useTheme();
  const isCompleted = task.status === 'completed';

  // Горизонтальное смещение карточки. Живёт на UI-потоке — жест не вызывает ре-рендеров.
  const translateX = useSharedValue(0);

  // Момент последнего свайпа: защищает от «случайного» onPress сразу после жеста.
  const lastSwipeAt = useRef(0);
  const markSwipeStarted = useCallback(() => {
    lastSwipeAt.current = Date.now();
  }, []);
  const guardPress = useCallback(
    <A extends unknown[]>(handler: (...args: A) => void) =>
      (...args: A) => {
        if (Date.now() - lastSwipeAt.current < PRESS_GUARD_MS) return;
        handler(...args);
      },
    []
  );

  // Бизнес-логика — обычные JS-функции. Из worklet их можно вызвать только через runOnJS.
  const completeAction = useCallback(() => onToggleStatus(task.id), [onToggleStatus, task.id]);
  const deleteAction = useCallback(() => onDelete(task), [onDelete, task]);

  const pan = useMemo(
    () =>
      Gesture.Pan()
        // Жест активируется только при заметном горизонтальном движении…
        .activeOffsetX([-SWIPE_ACTIVATION_OFFSET, SWIPE_ACTIVATION_OFFSET])
        // …и отменяется, если пользователь начал прокручивать список по вертикали.
        .failOffsetY([-SWIPE_FAIL_OFFSET_Y, SWIPE_FAIL_OFFSET_Y])
        .onStart(() => {
          runOnJS(markSwipeStarted)();
        })
        .onUpdate((event) => {
          // Ограничиваем смещение: карточка не уезжает за SWIPE_MAX_OFFSET в обе стороны.
          translateX.value = Math.min(Math.max(event.translationX, -SWIPE_MAX_OFFSET), SWIPE_MAX_OFFSET);
        })
        .onEnd(() => {
          const offset = translateX.value;

          if (offset >= SWIPE_ACTION_THRESHOLD) {
            // Порог вправо пройден — меняем статус; карточка возвращается,
            // а смену вида (фон, зачёркивание, чекбокс) анимирует TaskCard из ЛР №4.
            runOnJS(completeAction)();
          } else if (offset <= -SWIPE_ACTION_THRESHOLD) {
            // Порог влево — только просим подтверждение; удаляет экран после «Удалить».
            runOnJS(deleteAction)();
          }
        })
        .onFinalize(() => {
          // Вызывается всегда после жеста — и после onEnd, и если жест прервала система.
          // Во всех случаях (порог не достигнут, статус сменён, ждём ответа в Alert)
          // карточка плавно возвращается в исходное положение.
          translateX.value = withSpring(0, swipeSpring);
        }),
    [translateX, markSwipeStarted, completeAction, deleteAction]
  );

  // ---------- Анимированные стили ----------

  const cardStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
  }));

  // Левая область («Выполнить») видна при свайпе вправо. Цвет набирает насыщенность к порогу.
  const completeBgStyle = useAnimatedStyle(() => ({
    opacity: interpolate(translateX.value, [0, 24], [0, 1], Extrapolation.CLAMP),
    backgroundColor: interpolateColor(
      translateX.value,
      [0, SWIPE_ACTION_THRESHOLD],
      [colors.secondary, isCompleted ? colors.warning : colors.success]
    ),
  }));

  // Правая область («Удалить») — при свайпе влево.
  const deleteBgStyle = useAnimatedStyle(() => ({
    opacity: interpolate(translateX.value, [-24, 0], [1, 0], Extrapolation.CLAMP),
    backgroundColor: interpolateColor(translateX.value, [-SWIPE_ACTION_THRESHOLD, 0], [colors.danger, colors.secondary]),
  }));

  // Подпись действия «подпрыгивает», когда порог пройден: пользователь видит, что отпускание сработает.
  const completeLabelStyle = useAnimatedStyle(() => {
    const progress = interpolate(translateX.value, [0, SWIPE_ACTION_THRESHOLD], [0, 1], Extrapolation.CLAMP);
    return {
      opacity: 0.4 + progress * 0.6,
      transform: [{ scale: translateX.value >= SWIPE_ACTION_THRESHOLD ? 1.15 : 0.85 + progress * 0.15 }],
    };
  });

  const deleteLabelStyle = useAnimatedStyle(() => {
    const progress = interpolate(translateX.value, [-SWIPE_ACTION_THRESHOLD, 0], [1, 0], Extrapolation.CLAMP);
    return {
      opacity: 0.4 + progress * 0.6,
      transform: [{ scale: translateX.value <= -SWIPE_ACTION_THRESHOLD ? 1.15 : 0.85 + progress * 0.15 }],
    };
  });

  const completeLabel = isCompleted ? '↺  Вернуть' : '✓  Выполнить';

  return (
    <View style={styles.container}>
      {/* Фоновые области действий лежат под карточкой и открываются при её смещении. */}
      <Animated.View style={[styles.actionBg, styles.actionLeft, completeBgStyle]}>
        <Animated.Text style={[styles.actionText, { color: colors.onAccent }, completeLabelStyle]}>
          {completeLabel}
        </Animated.Text>
      </Animated.View>
      <Animated.View style={[styles.actionBg, styles.actionRight, deleteBgStyle]}>
        <Animated.Text style={[styles.actionText, { color: colors.onAccent }, deleteLabelStyle]}>
          Удалить  🗑
        </Animated.Text>
      </Animated.View>

      <GestureDetector gesture={pan}>
        <Animated.View
          style={cardStyle}
          accessibilityActions={[
            { name: 'toggle', label: isCompleted ? 'Вернуть в работу' : 'Отметить выполненной' },
            { name: 'delete', label: 'Удалить' },
          ]}
          onAccessibilityAction={(event) => {
            // Свайп недоступен с экранным диктором — дублируем действия.
            if (event.nativeEvent.actionName === 'toggle') completeAction();
            if (event.nativeEvent.actionName === 'delete') deleteAction();
          }}
        >
          <TaskCard
            task={task}
            onOpen={guardPress(onOpen)}
            onToggleStatus={guardPress(onToggleStatus)}
            onEdit={guardPress(onEdit)}
            onDelete={guardPress(onDelete)}
          />
        </Animated.View>
      </GestureDetector>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { marginBottom: spacing.sm },
  actionBg: {
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    borderRadius: radius.md,
    justifyContent: 'center',
    paddingHorizontal: spacing.lg,
  },
  actionLeft: { alignItems: 'flex-start' },
  actionRight: { alignItems: 'flex-end' },
  actionText: { fontSize: fontSize.body + 1, fontWeight: '700' },
});
