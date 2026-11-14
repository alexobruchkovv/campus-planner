import React from 'react';
import { ScrollView, StyleProp, StyleSheet, View, ViewStyle } from 'react-native';
import { Edge, SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../../hooks/useTheme';
import { spacing } from '../../theme/spacing';

interface ScreenProps {
  children: React.ReactNode;
  /** Прокручиваемое содержимое — для форм и длинных экранов. */
  scroll?: boolean;
  /** Стандартные внутренние отступы. */
  padded?: boolean;
  /** Верхний край по умолчанию не нужен: его закрывает заголовок Stack. */
  edges?: Edge[];
  contentStyle?: StyleProp<ViewStyle>;
}

export default function Screen({
  children,
  scroll = false,
  padded = true,
  edges = ['bottom', 'left', 'right'],
  contentStyle,
}: ScreenProps) {
  const { colors } = useTheme();
  const innerStyle = [padded && styles.padded, contentStyle];

  return (
    <SafeAreaView edges={edges} style={[styles.root, { backgroundColor: colors.background }]}>
      {scroll ? (
        <ScrollView contentContainerStyle={[styles.scrollContent, innerStyle]} keyboardShouldPersistTaps="handled">
          {children}
        </ScrollView>
      ) : (
        <View style={[styles.root, innerStyle]}>{children}</View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  scrollContent: { flexGrow: 1 },
  padded: { padding: spacing.md },
});
