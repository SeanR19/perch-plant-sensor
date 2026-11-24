import { ScrollView, StyleSheet, Text, View } from 'react-native';

import { GlassCard } from '@/components/glass-card';
import { PlantCard } from '@/components/plant-card';
import { Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import { MOCK_PLANTS, moistureStatus } from '@/lib/mock-plants';

export default function HomeScreen() {
  const c = useTheme();
  const thirsty = MOCK_PLANTS.filter((p) => moistureStatus(p.reading.moisture) !== 'good').length;

  return (
    <View style={[styles.root, { backgroundColor: c.background }]}>
      {/* Soft colour behind the glass — Liquid Glass over a flat fill just
          looks grey, it needs something to bend. */}
      <View style={[styles.glow, { backgroundColor: c.glow1, top: -80, left: -60 }]} />
      <View style={[styles.glow, { backgroundColor: c.glow2, top: 260, right: -120 }]} />
      <View style={[styles.glow, { backgroundColor: c.glow3, bottom: -60, left: -40 }]} />

      {/* Automatic insets keep content clear of the status bar and the
          native tab bar, without measuring either. */}
      <ScrollView
        contentInsetAdjustmentBehavior="automatic"
        contentContainerStyle={{
          paddingTop: Spacing.three,
          paddingBottom: Spacing.four,
          paddingHorizontal: Spacing.three,
          gap: Spacing.three,
        }}
      >
        <View>
          <Text style={[styles.eyebrow, { color: c.textSecondary }]}>Perch</Text>
          <Text style={[styles.title, { color: c.textPrimary }]}>My Garden</Text>
        </View>

        <GlassCard style={styles.summary}>
          <Summary value={MOCK_PLANTS.length} label="Plants" />
          <Summary value={thirsty} label="Need water" />
          <Summary value={MOCK_PLANTS.length} label="Sensors" />
        </GlassCard>

        {MOCK_PLANTS.map((plant) => (
          <PlantCard key={plant.id} plant={plant} />
        ))}
      </ScrollView>
    </View>
  );
}

function Summary({ value, label }: { value: number; label: string }) {
  const c = useTheme();
  return (
    <View style={styles.summaryItem}>
      <Text style={[styles.summaryValue, { color: c.textPrimary }]}>{value}</Text>
      <Text style={[styles.summaryLabel, { color: c.textSecondary }]}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, overflow: 'hidden' },
  glow: {
    position: 'absolute',
    width: 320,
    height: 320,
    borderRadius: 160,
    opacity: 0.7,
  },
  eyebrow: {
    fontSize: 13,
    fontWeight: '600',
    letterSpacing: 1.5,
    textTransform: 'uppercase',
  },
  title: { fontSize: 34, fontWeight: '700', marginTop: 2 },
  summary: {
    flexDirection: 'row',
    paddingVertical: Spacing.three,
  },
  summaryItem: { flex: 1, alignItems: 'center' },
  summaryValue: { fontSize: 26, fontWeight: '700' },
  summaryLabel: { fontSize: 12, marginTop: 2 },
});
