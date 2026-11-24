import { GlassView, isLiquidGlassAvailable } from 'expo-glass-effect';
import { BlurView } from 'expo-blur';
import { type TabTriggerSlotProps } from 'expo-router/ui';
import { type LucideIcon } from 'lucide-react-native';
import { type Ref } from 'react';
import { Pressable, StyleSheet, View, type ViewProps } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

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
const ICON_SIZE = 23;
/** Distance from the bottom of the screen on a home-indicator iPhone. */
const BOTTOM_GAP = 14;

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

/**
 * The floating glass pill. Rendered by `<TabList asChild>`, which passes the
 * TabTriggers through as children. TabList's own row styling is ignored in
 * favour of the design's.
 */
export function NavBar({ children, style: _tabListStyle, ...rest }: ViewProps) {
  const { bottom } = useSafeAreaInsets();
  const row = <View style={styles.row}>{children}</View>;

  return (
    <View
      {...rest}
      style={[styles.wrapper, { bottom: navBarBottom(bottom) }]}
      pointerEvents="box-none"
    >
      {CAN_USE_LIQUID_GLASS ? (
        // Liquid Glass brings its own material; the Figma fill goes in as a
        // tint rather than a background so it doesn't flatten the glass.
        <GlassView
          glassEffectStyle="regular"
          isInteractive
          tintColor={NavBarColors.fill}
          style={styles.bar}
        >
          {row}
        </GlassView>
      ) : (
        <BlurView intensity={40} style={[styles.bar, { backgroundColor: NavBarColors.fill }]}>
          {row}
        </BlurView>
      )}
    </View>
  );
}

/**
 * One icon tab. Used as `<TabTrigger asChild><NavTab icon={…} /></TabTrigger>`,
 * which supplies `isFocused` and `onPress`.
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
      {isFocused && <View style={styles.selection} />}
      {/* Wrapped so the icon stacks above the absolutely positioned selection
          on web too, where positioned elements otherwise paint on top. */}
      <View>
        <Icon
          size={ICON_SIZE}
          color={NavBarColors.icon}
          strokeWidth={strokeWidth}
          absoluteStrokeWidth
        />
      </View>
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
    borderRadius: BAR_HEIGHT / 2,
    overflow: 'hidden',
    justifyContent: 'center',
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
  selection: {
    ...StyleSheet.absoluteFill,
    borderRadius: TAB_HEIGHT / 2,
    backgroundColor: NavBarColors.selection,
  },
});
