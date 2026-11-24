import { Image } from 'expo-image';
import { StyleSheet, Text, View } from 'react-native';

import { Allo } from '@/constants/fonts';

/**
 * Garden health arc with its score (Figma frame 49078, 169:163). The arc
 * pieces are the Figma vectors, pre-rendered with their drop shadows; each
 * box below is the vector's layer box grown by Figma's shadow bleed, so the
 * images line up exactly with the design.
 *
 * The bright arc is the static Figma drawing of 86 — it doesn't move with the
 * score yet.
 */
export function HealthGauge({ score }: { score: number }) {
  return (
    <View style={styles.root}>
      <Image
        source={require('../../assets/home/gauge-track.png')}
        style={[styles.layer, { left: 13.6, top: 13.75, width: 282.251, height: 61.669 }]}
      />
      <Image
        source={require('../../assets/home/gauge-fill.png')}
        style={[styles.layer, { left: -21.4, top: -19.28, width: 262.905, height: 129.685 }]}
      />
      <Image
        source={require('../../assets/home/gauge-ticks.png')}
        style={[styles.layer, { left: 10.4, top: -5.55, width: 284.652, height: 62.034 }]}
      />

      <View style={styles.center}>
        <Text style={styles.score}>{score}</Text>
        <Text style={styles.caption}>GARDEN HEALTH</Text>
      </View>

      <Text style={[styles.end, { left: 0.5 - 3.5, top: 62 }]}>0</Text>
      <Text style={[styles.end, { left: 309.5 - 8.5, top: 60 }]}>100</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    width: 316,
    height: 106,
    alignSelf: 'center',
    // Figma sits the gauge half a point left of centre.
    marginLeft: -1,
  },
  layer: {
    position: 'absolute',
  },
  center: {
    position: 'absolute',
    left: 53,
    top: 41,
    width: 203,
    alignItems: 'center',
    gap: 10,
  },
  score: {
    fontFamily: Allo.semibold,
    fontSize: 35,
    color: '#FFFFFF',
  },
  caption: {
    fontFamily: Allo.semibold,
    fontSize: 12,
    letterSpacing: 2.04,
    color: '#FFFFFF',
  },
  end: {
    position: 'absolute',
    fontFamily: Allo.regular,
    fontSize: 10,
    color: '#FFFFFF',
  },
});
