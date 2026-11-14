import React from 'react';
import { StyleProp, StyleSheet, Text, TextInput, TextInputProps, View, ViewStyle } from 'react-native';
import { useTheme } from '../../hooks/useTheme';
import { fontSize, radius, spacing } from '../../theme/spacing';

interface AppInputProps extends TextInputProps {
  label?: string;
  error?: string;
  hint?: string;
  containerStyle?: StyleProp<ViewStyle>;
}

export default function AppInput({ label, error, hint, containerStyle, style, ...inputProps }: AppInputProps) {
  const { colors } = useTheme();

  return (
    <View style={[styles.container, containerStyle]}>
      {label ? <Text style={[styles.label, { color: colors.subtitle }]}>{label}</Text> : null}
      <TextInput
        placeholderTextColor={colors.subtitle}
        accessibilityLabel={label}
        {...inputProps}
        style={[
          styles.input,
          { borderColor: error ? colors.danger : colors.border, color: colors.text, backgroundColor: colors.card },
          style,
        ]}
      />
      {error ? (
        <Text style={[styles.message, { color: colors.danger }]}>{error}</Text>
      ) : hint ? (
        <Text style={[styles.message, { color: colors.subtitle }]}>{hint}</Text>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { marginBottom: spacing.sm + spacing.xs },
  label: { fontSize: fontSize.caption + 1, marginBottom: spacing.xs },
  input: {
    borderWidth: 1,
    borderRadius: radius.sm,
    paddingHorizontal: spacing.sm + 2,
    paddingVertical: spacing.sm,
    fontSize: fontSize.body,
  },
  message: { fontSize: fontSize.caption, marginTop: spacing.xs },
});
