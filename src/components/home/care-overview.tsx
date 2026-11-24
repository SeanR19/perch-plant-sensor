import BottomSheet, {
  BottomSheetScrollView,
  type BottomSheetBackgroundProps,
  type BottomSheetHandleProps,
} from '@gorhom/bottom-sheet';
import { BlurView } from 'expo-blur';
import { Image } from 'expo-image';
import { useState } from 'react';
import { Pressable, StyleSheet, Text, useWindowDimensions, View } from 'react-native';
import Animated, {
  Extrapolation,
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  type SharedValue,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
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
 * The design has two empty task cards. Repeat them until real tasks exist, so
 * there's enough in the sheet to scroll.
 */
const PLACEHOLDER_CARD_ROWS = 8;

/** Space under the content for the floating tab bar. */
const TAB_BAR_CLEARANCE = 90;

/** Sheet top corners at rest, as in Figma. They flatten once it's full screen. */
const TOP_RADIUS = 20;
/** Handle strip: 11pt above the 4pt bar, 4pt below. */
const HANDLE_AREA_HEIGHT = 11 + 4 + 4;
/** Title row's gap below the handle strip (16pt below the bar in Figma). */
const TITLE_GAP = 12;
/** Gap between the header's bottom and the title once the sheet is full screen. */
const OPEN_TITLE_GAP = 16;
/**
 * The last stretch of the swipe up — as a fraction of the way between the two
 * snap points — over which the handle fades and the corners flatten.
 */
const TOP_TRANSITION: [number, number] = [0.85, 1];

/**
 * The dark "Care Overview" panel at the bottom of the home screen (Figma
 * frame 49081, 169:71), as a sheet: it rests where the design puts it, swipes
 * up to fill the screen behind the header buttons, and scrolls once it's open.
 */
export function CareOverviewSheet({
  tasks,
  restingTop,
  headerBottom,
}: {
  tasks: { completed: number; total: number };
  /** Screen y of the sheet's top edge at rest. */
  restingTop: number;
  /** Screen y of the header's bottom edge, which the open sheet slides behind. */
  headerBottom: number;
}) {
  const { height: windowHeight } = useWindowDimensions();
  /** 0 at rest, 1 at full screen, fractional in between. */
  const animatedIndex = useSharedValue(0);

  // As the sheet rises behind the header, grow a spacer above the title so the
  // content ends up just below the buttons instead of underneath them.
  const openSpacer = headerBottom + OPEN_TITLE_GAP - HANDLE_AREA_HEIGHT - TITLE_GAP;
  const spacerStyle = useAnimatedStyle(() => ({
    height: interpolate(animatedIndex.get(), [0, 1], [0, openSpacer], Extrapolation.CLAMP),
  }));
  const { bottom: safeBottom } = useSafeAreaInsets();
  const [segment, setSegment] = useState<Segment>('today');
  const progress = tasks.total > 0 ? tasks.completed / tasks.total : 0;
  const fillWidth = Math.max(BAR_HEIGHT, BAR_WIDTH * progress);

  return (
    <BottomSheet
      index={0}
      snapPoints={[windowHeight - restingTop, windowHeight]}
      animatedIndex={animatedIndex}
      enableDynamicSizing={false}
      // Never closes: the rest position is the lowest it goes.
      enablePanDownToClose={false}
      backgroundComponent={SheetBackground}
      handleComponent={SheetHandle}
    >
      <BottomSheetScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: safeBottom + TAB_BAR_CLEARANCE }}
      >
        <Animated.View style={spacerStyle} />
        <View style={styles.titleRow}>
          <Text style={styles.title}>Care Overview</Text>
          <Image
            source={require('../../assets/home/calendar-heart.png')}
            style={styles.titleIcon}
          />
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

          {Array.from({ length: PLACEHOLDER_CARD_ROWS }, (_, row) => (
            <View key={row} style={styles.cards}>
              <View style={styles.card} />
              <View style={styles.card} />
            </View>
          ))}
        </View>
      </BottomSheetScrollView>
    </BottomSheet>
  );
}

/**
 * Figma's 60% charcoal panel. The blur underneath keeps the gauge from
 * reading through once the sheet is swiped up over it; at rest it sits on an
 * already-blurred part of the photo, so it looks as designed.
 */
function SheetBackground({ style, animatedIndex }: BottomSheetBackgroundProps) {
  const radiusStyle = useAnimatedStyle(() => {
    const radius = interpolate(
      animatedIndex.get(),
      TOP_TRANSITION,
      [TOP_RADIUS, 0],
      Extrapolation.CLAMP,
    );
    return { borderTopLeftRadius: radius, borderTopRightRadius: radius };
  });
  return (
    <Animated.View pointerEvents="none" style={[style, styles.background, radiusStyle]}>
      <BlurView intensity={50} tint="dark" style={StyleSheet.absoluteFill} />
    </Animated.View>
  );
}

/** The grab handle fades out as the sheet reaches the top, behind the header. */
function SheetHandle({ animatedIndex }: BottomSheetHandleProps) {
  return (
    <View style={styles.handleArea}>
      <FadingHandle animatedIndex={animatedIndex} />
    </View>
  );
}

function FadingHandle({ animatedIndex }: { animatedIndex: SharedValue<number> }) {
  const fadeStyle = useAnimatedStyle(() => ({
    opacity: interpolate(animatedIndex.get(), TOP_TRANSITION, [1, 0], Extrapolation.CLAMP),
  }));
  return (
    <Animated.View style={fadeStyle}>
      <Image source={require('../../assets/home/sheet-handle.png')} style={styles.handle} />
    </Animated.View>
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
  background: {
    backgroundColor: 'rgba(18, 18, 18, 0.6)',
    overflow: 'hidden',
  },
  // The handle's touch area runs from the sheet's top edge to the title, so
  // the whole strip can be grabbed.
  handleArea: {
    paddingTop: 11,
    paddingBottom: 4,
  },
  handle: {
    width: 33,
    height: 4,
    alignSelf: 'center',
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    // 16pt below the handle in Figma; the handle area already holds 4 of it.
    marginTop: TITLE_GAP,
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
