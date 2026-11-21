import React, { useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Animated, {
  Easing,
  FadeInDown,
  FadeOutDown,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import { useTheme } from '../../hooks/useTheme';
import { fontSize, radius, spacing } from '../../theme/spacing';
import AppButton from './AppButton';

interface UndoBarProps {
  message: string;
  /** Сколько плашка будет видна — по нему анимируется полоска обратного отсчёта. */
  duration: number;
  onUndo: () => void;
}

/**
 * Плашка «Задача удалена · Отменить».
 * Появление и исчезновение — layout-анимации entering/exiting:
 * экран просто перестаёт рендерить плашку через 5 секунд, а Reanimated доигрывает уход.
 */
export default function UndoBar({ message, duration, onUndo }: UndoBarProps) {
  const { colors } = useTheme();
  const remaining = useSharedValue(1);

  useEffect(() => {
    // Полоска показывает, сколько времени осталось на отмену.
    remaining.value = 1;
    remaining.value = withTiming(0, { duration, easing: Easing.linear });
  }, [message, duration, remaining]);

  const barStyle = useAnimatedStyle(() => ({
    transform: [{ scaleX: remaining.value }],
  }));

  return (
    <Animated.View
      entering={FadeInDown.duration(220)}
      exiting={FadeOutDown.duration(300)}
      style={[styles.container, { backgroundColor: colors.text }]}
      accessibilityLiveRegion="polite"
    >
      <View style={styles.row}>
        <Text style={[styles.message, { color: colors.background }]} numberOfLines={2}>
          {message}
        </Text>
        <AppButton title="Отменить" size="sm" onPress={onUndo} />
      </View>
      <View style={[styles.track, { backgroundColor: colors.subtitle }]}>
        <Animated.View style={[styles.bar, { backgroundColor: colors.primary }, barStyle]} />
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    left: spacing.md,
    right: spacing.md,
    bottom: spacing.md,
    borderRadius: radius.md,
    overflow: 'hidden',
    elevation: 6,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 3 },
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm + spacing.xs,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm + spacing.xs,
  },
  message: { flex: 1, fontSize: fontSize.body },
  track: { height: 3, opacity: 0.6 },
  // transformOrigin слева — полоска «съедается» справа налево.
  bar: { height: 3, width: '100%', transformOrigin: 'left' },
});
