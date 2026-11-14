import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useTheme } from '../../hooks/useTheme';
import { fontSize, spacing } from '../../theme/spacing';
import AppButton from './AppButton';

interface EmptyStateProps {
  /** Эмодзи или короткий символ над заголовком. */
  icon?: string;
  title: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
}

export default function EmptyState({ icon, title, description, actionLabel, onAction }: EmptyStateProps) {
  const { colors } = useTheme();

  return (
    <View style={styles.container}>
      {icon ? <Text style={styles.icon}>{icon}</Text> : null}
      <Text style={[styles.title, { color: colors.text }]}>{title}</Text>
      {description ? <Text style={[styles.description, { color: colors.subtitle }]}>{description}</Text> : null}
      {actionLabel && onAction ? (
        <AppButton title={actionLabel} onPress={onAction} style={styles.action} />
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flexGrow: 1, alignItems: 'center', justifyContent: 'center', padding: spacing.lg },
  icon: { fontSize: 40, marginBottom: spacing.sm },
  title: { fontSize: fontSize.subtitle + 1, fontWeight: '700', textAlign: 'center' },
  description: { fontSize: fontSize.body, textAlign: 'center', marginTop: spacing.xs },
  action: { marginTop: spacing.md, alignSelf: 'stretch' },
});
