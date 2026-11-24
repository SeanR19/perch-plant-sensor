import { StyleSheet, Text, View } from 'react-native';

import { useTheme } from '@/hooks/use-theme';

/** Stand-in for tabs that haven't been designed yet. */
export function PlaceholderScreen({ title }: { title: string }) {
  const c = useTheme();
  return (
    <View style={[styles.root, { backgroundColor: c.background }]}>
      <Text style={[styles.title, { color: c.textPrimary }]}>{title}</Text>
      <Text style={{ color: c.textSecondary }}>Coming soon</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 4 },
  title: { fontSize: 28, fontWeight: '700' },
});
