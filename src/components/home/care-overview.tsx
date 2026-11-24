import { Image } from 'expo-image';
import { useState } from 'react';
import { Pressable, StyleSheet, Text, View, type StyleProp, type ViewStyle } from 'react-native';
import Svg, { Defs, LinearGradient, Rect, Stop } from 'react-native-svg';

import { Allo } from '@/constants/fonts';

const SEGMENTS = [
  // Widths are the Figma segment boxes, so the row keeps its shape whichever
  // one is selected.
  { key: 'today', label: 'Today', width: 105 },
  { key: 'upcoming', label: 'Upcoming', width: 119 },
  { key: 'completed', label: 'Completed', width: 106 },
] as const;
type Segment = (typeof SEGMENTS)[number]['key'];

const BAR_WIDTH = 340;
const BAR_HEIGHT = 12;

/**
 * The dark "Care Overview" panel at the bottom of the home screen (Figma
 * frame 49081, 169:71): title, Today/Upcoming/Completed switch, and task
 * progress. The two empty cards are placeholders in the design too.
 */
export function CareOverview({
  tasks,
  style,
}: {
  tasks: { completed: number; total: number };
  style?: StyleProp<ViewStyle>;
}) {
  const [segment, setSegment] = useState<Segment>('today');
  const progress = tasks.total > 0 ? tasks.completed / tasks.total : 0;
  const fillWidth = Math.max(BAR_HEIGHT, BAR_WIDTH * progress);

  return (
    <View style={[styles.panel, style]}>
      <Image source={require('../../assets/home/sheet-handle.png')} style={styles.handle} />

      <View style={styles.titleRow}>
        <Text style={styles.title}>Care Overview</Text>
        <Image source={require('../../assets/home/calendar-heart.png')} style={styles.titleIcon} />
      </View>

      <View style={styles.segments}>
        {SEGMENTS.map(({ key, label, width }) => {
          const selected = key === segment;
          return (
            <Pressable
              key={key}
              onPress={() => setSegment(key)}
              accessibilityRole="tab"
              accessibilityState={{ selected }}
              style={[styles.segment, { width }, selected && styles.segmentSelected]}
            >
              <Text style={[styles.segmentLabel, selected && styles.segmentLabelSelected]}>
                {label}
              </Text>
            </Pressable>
          );
        })}
      </View>

      <View style={styles.section}>
        <View style={styles.progressHeader}>
          <View style={{ gap: 3 }}>
            <Text style={styles.progressTitle}>Progress</Text>
            <Text style={styles.progressSubtitle}>Tasks completed</Text>
          </View>
          <Text style={styles.progressCount}>
            {tasks.completed}/{tasks.total}
          </Text>
        </View>

        <View style={styles.bar}>
          <View style={styles.barTrack} />
          <ProgressFill width={fillWidth} />
          <Text style={[styles.barEnd, { left: 0 }]}>0</Text>
          <Text style={[styles.barEnd, { right: 0 }]}>{tasks.total}</Text>
          {/* Marker tip sits under the end of the fill, as in Figma. */}
          <Image
            source={require('../../assets/home/progress-marker.png')}
            style={[styles.marker, { left: fillWidth - 5.4 }]}
          />
        </View>

        <View style={styles.cards}>
          <View style={styles.card} />
          <View style={styles.card} />
        </View>
      </View>
    </View>
  );
}

/** The rainbow fill: Figma's four-stop gradient at 70%, with a 1pt rust border. */
function ProgressFill({ width }: { width: number }) {
  return (
    <Svg width={width} height={BAR_HEIGHT} style={styles.fill}>
      <Defs>
        <LinearGradient id="careProgress" x1="0" y1="0" x2="1" y2="0">
          <Stop offset={0} stopColor="rgba(221, 116, 68, 0.7)" />
          <Stop offset={0.34135} stopColor="rgba(245, 176, 80, 0.7)" />
          <Stop offset={0.58173} stopColor="rgba(168, 213, 181, 0.7)" />
          <Stop offset={0.9375} stopColor="rgba(201, 160, 220, 0.7)" />
        </LinearGradient>
      </Defs>
      <Rect
        x={0.5}
        y={0.5}
        width={width - 1}
        height={BAR_HEIGHT - 1}
        rx={3.5}
        fill="url(#careProgress)"
        stroke="#894729"
        strokeWidth={1}
      />
    </Svg>
  );
}

const GRAY_TEXT = '#CBCBCB';
const CARD_FILL = 'rgba(55, 55, 55, 0.24)';
const CARD_BORDER = 'rgba(65, 65, 65, 0.2)';

const styles = StyleSheet.create({
  panel: {
    backgroundColor: 'rgba(18, 18, 18, 0.6)',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    borderBottomLeftRadius: 15.688,
    borderBottomRightRadius: 15.688,
    minHeight: 362,
  },
  handle: {
    width: 33,
    height: 4,
    alignSelf: 'center',
    marginTop: 11,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 16,
    marginHorizontal: 17,
    height: 23,
  },
  title: {
    fontFamily: Allo.semibold,
    fontSize: 18,
    color: '#FFFFFF',
  },
  titleIcon: {
    width: 23,
    height: 23,
  },
  segments: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 12,
    marginLeft: 16,
    marginRight: 17,
    height: 38,
    paddingHorizontal: 4,
    borderRadius: 60,
    borderWidth: 1,
    borderColor: CARD_BORDER,
    backgroundColor: CARD_FILL,
  },
  segment: {
    height: 31,
    borderRadius: 60,
    alignItems: 'center',
    justifyContent: 'center',
  },
  segmentSelected: {
    backgroundColor: '#FFFFFF',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 2.2,
  },
  segmentLabel: {
    fontFamily: Allo.medium,
    fontSize: 12,
    color: GRAY_TEXT,
  },
  segmentLabelSelected: {
    // Figma's green/950.
    color: '#022917',
  },
  section: {
    marginTop: 16,
    marginLeft: 1,
    borderTopWidth: 0.5,
    borderTopColor: 'rgba(255, 255, 255, 0.3)',
    paddingTop: 15.5,
  },
  progressHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginHorizontal: 17,
  },
  progressTitle: {
    fontFamily: Allo.semibold,
    fontSize: 16,
    color: '#FFFFFF',
  },
  progressSubtitle: {
    fontFamily: Allo.regular,
    fontSize: 12,
    color: '#C2C2C2',
  },
  progressCount: {
    fontFamily: Allo.regular,
    fontSize: 26,
    color: '#FFFFFF',
  },
  bar: {
    width: BAR_WIDTH,
    height: 35,
    marginTop: 14,
    marginLeft: 16,
  },
  barTrack: {
    position: 'absolute',
    width: BAR_WIDTH,
    height: BAR_HEIGHT,
    borderRadius: 4,
    backgroundColor: '#1B1B1B',
  },
  fill: {
    position: 'absolute',
  },
  barEnd: {
    position: 'absolute',
    top: 17,
    width: 8,
    textAlign: 'center',
    fontFamily: Allo.regular,
    fontSize: 12,
    color: GRAY_TEXT,
  },
  marker: {
    position: 'absolute',
    top: 20,
    width: 9.797,
    height: 8.75,
  },
  cards: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 13,
    marginLeft: 13,
  },
  card: {
    width: 167,
    height: 65,
    borderRadius: 8,
    borderWidth: 0.704,
    borderColor: CARD_BORDER,
    backgroundColor: CARD_FILL,
  },
});
