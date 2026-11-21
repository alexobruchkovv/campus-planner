import React from 'react';
import { Pressable, StyleSheet } from 'react-native';
import Animated, { Extrapolation, interpolate, interpolateColor, useAnimatedStyle } from 'react-native-reanimated';
import { useAnimatedFlag } from '../../hooks/useAnimatedFlag';
import { useTheme } from '../../hooks/useTheme';

interface TaskStatusToggleProps {
  checked: boolean;
  onToggle: () => void;
}

const SIZE = 26;

/** Круглый чекбокс статуса: заливка и галочка «пружинят» при отметке. */
export default function TaskStatusToggle({ checked, onToggle }: TaskStatusToggleProps) {
  const { colors } = useTheme();
  const progress = useAnimatedFlag(checked, 'spring');

  const circleStyle = useAnimatedStyle(() => ({
    backgroundColor: interpolateColor(progress.value, [0, 1], [colors.card, colors.success]),
    borderColor: interpolateColor(progress.value, [0, 1], [colors.border, colors.success]),
    // Короткий «толчок» в середине перехода подчёркивает, что действие принято.
    transform: [{ scale: interpolate(progress.value, [0, 0.5, 1], [1, 1.2, 1], Extrapolation.CLAMP) }],
  }));

  const checkStyle = useAnimatedStyle(() => ({
    opacity: interpolate(progress.value, [0, 1], [0, 1], Extrapolation.CLAMP),
    // Без CLAMP: перелёт пружины даёт галочке лёгкий отскок.
    transform: [{ scale: Math.max(progress.value, 0) }],
  }));

  return (
    <Pressable
      onPress={onToggle}
      hitSlop={8}
      accessibilityRole="checkbox"
      accessibilityState={{ checked }}
      accessibilityLabel={checked ? 'Отметить как невыполненную' : 'Отметить как выполненную'}
    >
      <Animated.View style={[styles.circle, circleStyle]}>
        <Animated.Text style={[styles.check, { color: colors.onAccent }, checkStyle]}>✓</Animated.Text>
      </Animated.View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  circle: {
    width: SIZE,
    height: SIZE,
    borderRadius: SIZE / 2,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  check: { fontSize: 15, fontWeight: '800', lineHeight: 18 },
});
