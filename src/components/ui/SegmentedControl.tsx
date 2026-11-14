import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useTheme } from '../../hooks/useTheme';
import { fontSize, spacing } from '../../theme/spacing';
import AppButton from './AppButton';

export interface SegmentOption<T extends string> {
  value: T;
  label: string;
}

interface SegmentedControlProps<T extends string> {
  options: readonly SegmentOption<T>[];
  value: T;
  onChange: (value: T) => void;
  label?: string;
}

/** Выбор одного значения из нескольких. Тип значения выводится из options. */
export default function SegmentedControl<T extends string>({ options, value, onChange, label }: SegmentedControlProps<T>) {
  const { colors } = useTheme();

  return (
    <View style={styles.container}>
      {label ? <Text style={[styles.label, { color: colors.subtitle }]}>{label}</Text> : null}
      <View style={styles.row}>
        {options.map((option) => {
          const selected = option.value === value;
          return (
            <AppButton
              key={option.value}
              title={option.label}
              size="sm"
              variant={selected ? 'primary' : 'secondary'}
              accessibilityState={{ selected }}
              onPress={() => onChange(option.value)}
              style={styles.item}
            />
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { marginBottom: spacing.sm + spacing.xs },
  label: { fontSize: fontSize.caption + 1, marginBottom: spacing.xs },
  row: { flexDirection: 'row', gap: spacing.sm },
  item: { flex: 1 },
});
