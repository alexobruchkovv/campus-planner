import React, { useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Animated, { interpolateColor, useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';
import { useTheme } from '../../hooks/useTheme';
import { motion } from '../../theme/motion';
import { fontSize, radius, spacing } from '../../theme/spacing';
import { TaskStats } from '../../types/task';
import { getCompletionRatio } from '../../utils/task';

/** Блок «Прогресс»: полоса шириной completed / total, плавно догоняющая новое значение. */
export default function TaskProgress({ stats }: { stats: TaskStats }) {
  const { colors } = useTheme();
  // Целевое значение считается из данных; SharedValue — только текущее положение полосы.
  const ratio = getCompletionRatio(stats);
  const percent = Math.round(ratio * 100);

  const progress = useSharedValue(0);

  useEffect(() => {
    progress.value = withTiming(ratio, motion.progress);
  }, [ratio, progress]);

  const fillStyle = useAnimatedStyle(() => {
    const value = Math.min(Math.max(progress.value, 0), 1);
    return {
      width: `${value * 100}%`,
      backgroundColor: interpolateColor(value, [0, 0.5, 1], [colors.warning, colors.primary, colors.success]),
    };
  });

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: colors.text }]}>Прогресс</Text>
        <Text style={[styles.caption, { color: colors.subtitle }]}>
          {stats.completed} из {stats.total} · {percent}%
        </Text>
      </View>
      <View
        style={[styles.track, { backgroundColor: colors.secondary }]}
        accessibilityRole="progressbar"
        accessibilityLabel="Доля выполненных задач"
        accessibilityValue={{ min: 0, max: 100, now: percent }}
      >
        <Animated.View style={[styles.fill, fillStyle]} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { marginBottom: spacing.sm + spacing.xs },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: spacing.xs },
  title: { fontSize: fontSize.body, fontWeight: '600' },
  caption: { fontSize: fontSize.caption + 1 },
  track: { height: 10, borderRadius: radius.pill, overflow: 'hidden' },
  fill: { height: '100%', borderRadius: radius.pill },
});
