import { useId } from 'react';
import { StyleSheet, type StyleProp, type ViewStyle } from 'react-native';
import Svg, { Defs, LinearGradient, Rect, Stop } from 'react-native-svg';

export type GradientStop = { offset: number; color: string };

const RGBA = /^rgba\(\s*([\d.]+)\s*,\s*([\d.]+)\s*,\s*([\d.]+)\s*,\s*([\d.]+)\s*\)$/;

/**
 * Splits an rgba() colour into the props a react-native-svg <Stop> needs.
 *
 * On iOS and Android, react-native-svg throws away the alpha in `stopColor`
 * and uses `stopOpacity` instead (default 1), so `rgba(0, 0, 0, 0)` draws as
 * solid black. Browsers keep the alpha, which is why it only shows on device.
 */
export function stopProps(color: string): { stopColor: string; stopOpacity: number } {
  const match = color.match(RGBA);
  if (!match) return { stopColor: color, stopOpacity: 1 };
  const [, r, g, b, a] = match;
  return { stopColor: `rgb(${r}, ${g}, ${b})`, stopOpacity: Number(a) };
}

/**
 * A linear gradient fill, drawn with react-native-svg (already in the build,
 * so no native rebuild for expo-linear-gradient). Fills its container unless a
 * style says otherwise.
 */
export function Gradient({
  stops,
  direction = 'vertical',
  style,
}: {
  stops: GradientStop[];
  /** Vertical runs top → bottom; horizontal runs left → right. */
  direction?: 'vertical' | 'horizontal';
  style?: StyleProp<ViewStyle>;
}) {
  // SVG ids can't contain the colons React puts in useId values.
  const id = `g${useId().replace(/[^a-zA-Z0-9]/g, '')}`;
  const horizontal = direction === 'horizontal';

  return (
    // Sized through style: a bare SVG falls back to 300×150, and on web the
    // percentage width/height props are dropped.
    <Svg style={[styles.fill, style]} pointerEvents="none">
      <Defs>
        <LinearGradient
          id={id}
          x1="0"
          y1="0"
          x2={horizontal ? '1' : '0'}
          y2={horizontal ? '0' : '1'}
        >
          {stops.map((stop) => (
            <Stop key={stop.offset} offset={stop.offset} {...stopProps(stop.color)} />
          ))}
        </LinearGradient>
      </Defs>
      <Rect width="100%" height="100%" fill={`url(#${id})`} />
    </Svg>
  );
}

const styles = StyleSheet.create({
  fill: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
  },
});
