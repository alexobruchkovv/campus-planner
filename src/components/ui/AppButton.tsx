import React from 'react';
import { Pressable, PressableProps, StyleProp, StyleSheet, Text, ViewStyle } from 'react-native';
import { useTheme } from '../../hooks/useTheme';
import { fontSize, radius, spacing } from '../../theme/spacing';

export type AppButtonVariant = 'primary' | 'secondary' | 'danger';
export type AppButtonSize = 'md' | 'sm';

interface AppButtonProps extends Omit<PressableProps, 'style' | 'children'> {
  title: string;
  variant?: AppButtonVariant;
  size?: AppButtonSize;
  style?: StyleProp<ViewStyle>;
}

export default function AppButton({
  title,
  variant = 'primary',
  size = 'md',
  disabled = false,
  style,
  accessibilityState,
  ...pressableProps
}: AppButtonProps) {
  const { colors } = useTheme();
  const isDisabled = Boolean(disabled);

  const palette: Record<AppButtonVariant, { background: string; text: string }> = {
    primary: { background: colors.primary, text: colors.onPrimary },
    secondary: { background: colors.secondary, text: colors.text },
    danger: { background: colors.danger, text: colors.onAccent },
  };
  const { background, text } = palette[variant];

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ disabled: isDisabled, ...accessibilityState }}
      disabled={isDisabled}
      style={({ pressed }) => [
        styles.base,
        size === 'sm' ? styles.sm : styles.md,
        { backgroundColor: background },
        pressed && !isDisabled && styles.pressed,
        isDisabled && styles.disabled,
        style,
      ]}
      {...pressableProps}
    >
      <Text style={[styles.text, size === 'sm' && styles.textSm, { color: text }]} numberOfLines={1}>
        {title}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: { borderRadius: radius.sm, alignItems: 'center', justifyContent: 'center' },
  md: { paddingVertical: spacing.sm + spacing.xs, paddingHorizontal: spacing.md },
  sm: { paddingVertical: spacing.xs + 2, paddingHorizontal: spacing.sm + spacing.xs },
  pressed: { opacity: 0.8 },
  disabled: { opacity: 0.45 },
  text: { fontWeight: '600', fontSize: fontSize.body + 1 },
  textSm: { fontSize: fontSize.body - 1 },
});
