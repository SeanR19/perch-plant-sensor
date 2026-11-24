import { Image, type ImageSource } from 'expo-image';
import { StyleSheet, Text, View } from 'react-native';

import { Gradient } from '@/components/gradient';
import { Allo } from '@/constants/fonts';

const CARD_WIDTH = 92.037;
const CARD_HEIGHT = 114;
const CARD_RADIUS = 15.688;

/** The Plants / Thriving / Need care row (Figma frame 49080, 169:138). */
export function StatCards({
  plants,
  thriving,
  needCare,
}: {
  plants: number;
  thriving: number;
  needCare: number;
}) {
  return (
    <View style={styles.row}>
      <StatCard
        icon={require('../../assets/home/leaf.png')}
        value={plants}
        label="Plants"
        divider={require('../../assets/home/stat-divider.png')}
        dividerWidth={92}
      />
      <StatCard
        icon={require('../../assets/home/heart.png')}
        value={thriving}
        label="Thriving"
        divider={require('../../assets/home/stat-divider-short.png')}
        dividerWidth={90}
      />
      <StatCard
        icon={require('../../assets/home/square-activity.png')}
        value={needCare}
        label="Need care"
        divider={require('../../assets/home/stat-divider.png')}
        dividerWidth={92}
      />
    </View>
  );
}

function StatCard({
  icon,
  value,
  label,
  divider,
  dividerWidth,
}: {
  icon: ImageSource;
  value: number;
  label: string;
  divider: ImageSource;
  dividerWidth: number;
}) {
  return (
    <View style={styles.card}>
      {/* Two stacked Figma fills: a light sheen under a dark wash. */}
      <Gradient
        stops={[
          { offset: 0, color: 'rgba(255, 255, 255, 0.1)' },
          { offset: 1, color: 'rgba(117, 117, 117, 0.1)' },
        ]}
      />
      <Gradient
        stops={[
          { offset: 0, color: 'rgba(0, 0, 0, 0.14)' },
          { offset: 1, color: 'rgba(117, 117, 117, 0.14)' },
        ]}
      />

      <View style={styles.content}>
        <Image source={icon} style={styles.icon} />
        <Text style={styles.value}>{value}</Text>
        <View style={styles.footer}>
          <Image source={divider} style={{ width: dividerWidth, height: 0.5 }} />
          <Text style={styles.label} numberOfLines={1}>
            {label}
          </Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    gap: 13,
    alignSelf: 'center',
  },
  card: {
    width: CARD_WIDTH,
    height: CARD_HEIGHT,
    borderRadius: CARD_RADIUS,
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    alignItems: 'center',
    gap: 7.321,
    // Figma offsets the stack half a point right and down of centre.
    transform: [{ translateX: 0.52 }, { translateY: 0.52 }],
  },
  icon: {
    width: 23,
    height: 23,
  },
  value: {
    fontFamily: Allo.semibold,
    fontSize: 18,
    color: '#FFFFFF',
  },
  footer: {
    alignItems: 'center',
    gap: 8,
  },
  label: {
    fontFamily: Allo.light,
    fontSize: 12,
    color: '#FFFFFF',
  },
});
