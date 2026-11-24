import { StyleSheet, Text, View } from 'react-native';

import { GlassCard } from '@/components/glass-card';
import { Spacing, type ThemeColors } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import { moistureStatus, type Plant } from '@/lib/mock-plants';

export function PlantCard({ plant }: { plant: Plant }) {
  const c = useTheme();
  const { moisture, light, temperature, humidity } = plant.reading;
  const status = moistureStatus(moisture);
  const statusColor = c[status];

  return (
    <GlassCard style={styles.card}>
      <View style={styles.header}>
        <Text style={styles.emoji}>{plant.emoji}</Text>
        <View style={{ flex: 1 }}>
          <Text style={[styles.name, { color: c.textPrimary }]}>{plant.name}</Text>
          <Text style={[styles.species, { color: c.textSecondary }]}>
            {plant.species} · Day {plant.daysOld}
          </Text>
        </View>
        <View style={[styles.dot, { backgroundColor: statusColor }]} />
      </View>

      <View style={styles.meterRow}>
        <Text style={[styles.meterLabel, { color: c.textSecondary }]}>Soil moisture</Text>
        <Text style={[styles.meterValue, { color: c.textPrimary }]}>{moisture}%</Text>
      </View>
      <View style={[styles.track, { backgroundColor: c.track }]}>
        <View style={[styles.fill, { width: `${moisture}%`, backgroundColor: statusColor }]} />
      </View>

      <View style={styles.stats}>
        <Stat c={c} label="Light" value={`${(light / 1000).toFixed(1)}k lx`} />
        <Stat c={c} label="Temp" value={`${temperature}°F`} />
        <Stat c={c} label="Humidity" value={`${humidity}%`} />
      </View>
    </GlassCard>
  );
}

function Stat({ c, label, value }: { c: ThemeColors; label: string; value: string }) {
  return (
    <View style={styles.stat}>
      <Text style={[styles.statValue, { color: c.textPrimary }]}>{value}</Text>
      <Text style={[styles.statLabel, { color: c.textSecondary }]}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    padding: Spacing.three,
    gap: Spacing.two,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: Spacing.one,
  },
  emoji: { fontSize: 32 },
  name: { fontSize: 18, fontWeight: '600' },
  species: { fontSize: 13, fontStyle: 'italic', marginTop: 2 },
  dot: { width: 10, height: 10, borderRadius: 5 },
  meterRow: { flexDirection: 'row', justifyContent: 'space-between' },
  meterLabel: { fontSize: 13 },
  meterValue: { fontSize: 13, fontWeight: '600' },
  track: { height: 8, borderRadius: 4, overflow: 'hidden' },
  fill: { height: '100%', borderRadius: 4 },
  stats: { flexDirection: 'row', marginTop: Spacing.two },
  stat: { flex: 1 },
  statValue: { fontSize: 15, fontWeight: '600' },
  statLabel: { fontSize: 12, marginTop: 2 },
});
