import { BlurView } from 'expo-blur';
import { GlassView, isLiquidGlassAvailable } from 'expo-glass-effect';
import { useTabTrigger, type TabTriggerSlotProps } from 'expo-router/ui';
import { type LucideIcon } from 'lucide-react-native';
import { Children, isValidElement, useEffect, useState, type Ref } from 'react';
import { Pressable, StyleSheet, View, type ViewProps } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, {
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { scheduleOnRN } from 'react-native-worklets';

import { NavBarColors } from '@/constants/theme';

// Figma: Frame 49066 (90:1269) in Plotted | Product Design.
const BAR_WIDTH = 310;
const BAR_HEIGHT = 54;
/** Selection pill and tab hit area. */
const TAB_WIDTH = 81;
const TAB_HEIGHT = 46;
/** Gap between the pill's edge and the selection pill, on every side. */
const INSET = (BAR_HEIGHT - TAB_HEIGHT) / 2;
/** Tabs overlap so four 81pt tabs fit inside the bar's inner width. */
const TAB_OVERLAP = (TAB_WIDTH * 4 - (BAR_WIDTH - INSET * 2)) / 3;
/** Distance between the left edges of neighbouring tabs. */
const TAB_STEP = TAB_WIDTH - TAB_OVERLAP;
const ICON_SIZE = 23;
/** Distance from the bottom of the screen on a home-indicator iPhone. */
const BOTTOM_GAP = 14;

/**
 * How much the bubble swells while it's being dragged — enough to spill past
 * the bar's edges, like the iOS 26 tab bar. 46pt tall × 1.4 ≈ 64pt, about 5pt
 * beyond the 54pt bar top and bottom.
 */
const DRAG_SCALE_X = 1.2;
const DRAG_SCALE_Y = 1.4;
const SPRING = { damping: 18, stiffness: 220, mass: 0.8 };

const CAN_USE_LIQUID_GLASS = isLiquidGlassAvailable();

/**
 * How far scrolling content needs to clear at the bottom so the last item
 * isn't stuck under the floating bar.
 */
export function useNavBarInset() {
  const { bottom } = useSafeAreaInsets();
  return navBarBottom(bottom) + BAR_HEIGHT;
}

function navBarBottom(safeBottom: number) {
  // The home-indicator area is ~34pt; the design tucks the bar into it at 14pt
  // from the edge. Devices without one fall back to the same 14pt.
  return Math.max(safeBottom - 20, BOTTOM_GAP);
}

function tabLeft(index: number) {
  'worklet';
  return INSET + index * TAB_STEP;
}

/**
 * The floating glass pill. Rendered by `<TabList asChild>`, which passes the
 * TabTriggers through as children. TabList's own row styling is ignored in
 * favour of the design's.
 *
 * The selection bubble glides between tabs, and can be dragged along the bar
 * like the iOS 26 tab bar: it swells into clear glass under the finger and
 * settles on whichever tab it's released over.
 */
export function NavBar({ children, style: _tabListStyle, ...rest }: ViewProps) {
  const { bottom } = useSafeAreaInsets();

  // Tab order comes straight from the TabTriggers, so adding a tab in the
  // layout is all it takes.
  const names = Children.toArray(children)
    .filter(isValidElement)
    .map((child) => (child.props as { name: string }).name);
  const { switchTab, getTrigger } = useTabTrigger({ name: names[0] });
  const focusedIndex = Math.max(
    0,
    names.findIndex((name) => getTrigger(name)?.isFocused),
  );

  const x = useSharedValue(tabLeft(focusedIndex));
  /** 0 at rest, 1 while the bubble is held. */
  const held = useSharedValue(0);
  /** Whether the current touch turned into a drag (not just a tap). */
  const dragging = useSharedValue(false);
  const [isDragging, setIsDragging] = useState(false);

  // Follow taps (and any other navigation) by gliding to the focused tab.
  useEffect(() => {
    x.set(withSpring(tabLeft(focusedIndex), SPRING));
  }, [focusedIndex, x]);

  const selectIndex = (index: number) => switchTab(names[index], {});
  const lastIndex = names.length - 1;

  const pan = Gesture.Pan()
    // A little horizontal travel before it counts as a drag, so plain taps
    // still reach the tabs underneath.
    .activeOffsetX([-8, 8])
    .onStart((e) => {
      dragging.set(true);
      held.set(withSpring(1, SPRING));
      x.set(withSpring(clampBubble(e.x, lastIndex), SPRING));
      scheduleOnRN(setIsDragging, true);
    })
    .onUpdate((e) => {
      // Bubble centres under the finger, kept inside the bar.
      x.set(clampBubble(e.x, lastIndex));
    })
    // Finalize also fires for touches that never became a drag; those are
    // taps, which the tab underneath already handles.
    .onFinalize(() => {
      if (!dragging.get()) return;
      dragging.set(false);
      const nearest = Math.round((x.get() - INSET) / TAB_STEP);
      const index = Math.min(Math.max(nearest, 0), lastIndex);
      x.set(withSpring(tabLeft(index), SPRING));
      held.set(withSpring(0, SPRING));
      scheduleOnRN(setIsDragging, false);
      scheduleOnRN(selectIndex, index);
    });

  const bubbleStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: x.get() },
      { scaleX: interpolate(held.get(), [0, 1], [1, DRAG_SCALE_X]) },
      { scaleY: interpolate(held.get(), [0, 1], [1, DRAG_SCALE_Y]) },
    ],
  }));
  // The solid design fill fades out while held, letting the glass show.
  const fillStyle = useAnimatedStyle(() => ({ opacity: 1 - held.get() }));

  return (
    <View
      {...rest}
      style={[styles.wrapper, { bottom: navBarBottom(bottom) }]}
      pointerEvents="box-none"
    >
      <GestureDetector gesture={pan}>
        {/* The glass pill is only the backdrop. The bubble and tabs sit on top
            of it rather than inside it, so nothing clips the bubble when it
            swells past the bar's edges. */}
        <View style={styles.bar}>
          {CAN_USE_LIQUID_GLASS ? (
            // Liquid Glass brings its own material; the Figma fill goes in as
            // a tint rather than a background so it doesn't flatten the glass.
            <GlassView
              glassEffectStyle="regular"
              tintColor={NavBarColors.fill}
              style={styles.barBackground}
            />
          ) : (
            <BlurView
              intensity={40}
              style={[styles.barBackground, { backgroundColor: NavBarColors.fill }]}
            />
          )}
          <Animated.View style={[styles.bubble, bubbleStyle]} pointerEvents="none">
            {CAN_USE_LIQUID_GLASS && (
              <GlassView
                glassEffectStyle={{
                  style: isDragging ? 'clear' : 'none',
                  animate: true,
                  animationDuration: 0.2,
                }}
                style={styles.bubbleLayer}
              />
            )}
            <Animated.View
              style={[styles.bubbleLayer, { backgroundColor: NavBarColors.selection }, fillStyle]}
            />
          </Animated.View>
          <View style={styles.row}>{children}</View>
        </View>
      </GestureDetector>
    </View>
  );
}

function clampBubble(fingerX: number, lastIndex: number) {
  'worklet';
  return Math.min(Math.max(fingerX - TAB_WIDTH / 2, tabLeft(0)), tabLeft(lastIndex));
}

/**
 * One icon tab. Used as `<TabTrigger asChild><NavTab icon={…} /></TabTrigger>`,
 * which supplies `isFocused` and `onPress`. The selection bubble is drawn by
 * NavBar, behind the tabs.
 */
export function NavTab({
  icon: Icon,
  strokeWidth,
  isFocused,
  style: _triggerStyle,
  ref,
  ...pressableProps
}: TabTriggerSlotProps & {
  icon: LucideIcon;
  /** Stroke in points, as drawn in Figma. */
  strokeWidth: number;
  ref?: Ref<View>;
}) {
  return (
    <Pressable
      {...pressableProps}
      ref={ref}
      accessibilityRole="tab"
      accessibilityState={{ selected: isFocused }}
      style={styles.tab}
    >
      <Icon
        size={ICON_SIZE}
        color={NavBarColors.icon}
        strokeWidth={strokeWidth}
        absoluteStrokeWidth
      />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    position: 'absolute',
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  bar: {
    width: BAR_WIDTH,
    height: BAR_HEIGHT,
    justifyContent: 'center',
  },
  barBackground: {
    ...StyleSheet.absoluteFill,
    borderRadius: BAR_HEIGHT / 2,
    overflow: 'hidden',
  },
  row: {
    flexDirection: 'row',
    paddingHorizontal: INSET,
  },
  tab: {
    width: TAB_WIDTH,
    height: TAB_HEIGHT,
    marginRight: -TAB_OVERLAP,
    alignItems: 'center',
    justifyContent: 'center',
  },
  bubble: {
    position: 'absolute',
    left: 0,
    top: INSET,
    width: TAB_WIDTH,
    height: TAB_HEIGHT,
  },
  bubbleLayer: {
    ...StyleSheet.absoluteFill,
    borderRadius: TAB_HEIGHT / 2,
    overflow: 'hidden',
  },
});
