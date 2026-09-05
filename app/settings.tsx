import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useTheme } from '../src/context/ThemeContext';

export default function SettingsScreen() {
  const { theme, setTheme, colors } = useTheme();

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Text style={[styles.header, { color: colors.text }]}>Тема оформления</Text>

      <TouchableOpacity
        style={[
          styles.option,
          { borderColor: colors.border },
          theme === 'light' && { backgroundColor: colors.primary, borderColor: colors.primary },
        ]}
        onPress={() => setTheme('light')}
      >
        <Text style={[styles.optionText, { color: theme === 'light' ? '#fff' : colors.text }]}>Светлая</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[
          styles.option,
          { borderColor: colors.border },
          theme === 'dark' && { backgroundColor: colors.primary, borderColor: colors.primary },
        ]}
        onPress={() => setTheme('dark')}
      >
        <Text style={[styles.optionText, { color: theme === 'dark' ? '#fff' : colors.text }]}>Тёмная</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  header: { fontSize: 18, fontWeight: '700', marginBottom: 16 },
  option: { borderWidth: 1, borderRadius: 8, paddingVertical: 12, alignItems: 'center', marginBottom: 10 },
  optionText: { fontSize: 15, fontWeight: '600' },
});