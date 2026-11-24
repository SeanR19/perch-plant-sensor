import { BlurView } from 'expo-blur';
import { GlassView, isLiquidGlassAvailable } from 'expo-glass-effect';
import { Image } from 'expo-image';
import { type ReactNode } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

const CAN_USE_LIQUID_GLASS = isLiquidGlassAvailable();

/** Figma fill on the two round buttons — used as the Liquid Glass tint. */
const BUTTON_FILL = 'rgba(213, 213, 213, 0.14)';
const BUTTON_SIZE = 48;

/** Menu button, Perch wordmark, and sparkles button (Figma 169:113–169:120). */
export function HomeHeader({
  onMenuPress,
  onSparklesPress,
}: {
  onMenuPress?: () => void;
  onSparklesPress?: () => void;
}) {
  return (
    // box-none: the gaps between the buttons pass touches to the sheet behind.
    <View style={styles.row} pointerEvents="box-none">
      <RoundGlassButton onPress={onMenuPress} accessibilityLabel="Menu">
        {/* Nudged half a point as in Figma, so the two-line glyph sits optically centred. */}
        <Image
          source={require('../../assets/home/menu.png')}
          style={{ width: 25, height: 25, transform: [{ translateX: 0.5 }, { translateY: 0.5 }] }}
        />
      </RoundGlassButton>

      <Image
        source={require('../../assets/home/perch-logo.png')}
        style={styles.logo}
        accessibilityLabel="Perch"
      />

      <RoundGlassButton onPress={onSparklesPress} accessibilityLabel="Insights">
        <Image
          source={require('../../assets/home/sparkles.png')}
          style={{ width: 23, height: 23, transform: [{ translateX: -0.5 }, { translateY: -0.5 }] }}
        />
      </RoundGlassButton>
    </View>
  );
}

function RoundGlassButton({
  children,
  onPress,
  accessibilityLabel,
}: {
  children: ReactNode;
  onPress?: () => void;
  accessibilityLabel: string;
}) {
  return (
    <Pressable onPress={onPress} accessibilityRole="button" accessibilityLabel={accessibilityLabel}>
      {CAN_USE_LIQUID_GLASS ? (
        <GlassView isInteractive tintColor={BUTTON_FILL} style={styles.button}>
          {children}
        </GlassView>
      ) : (
        <BlurView intensity={30} style={[styles.button, { backgroundColor: BUTTON_FILL }]}>
          {children}
        </BlurView>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    // Buttons sit 28pt from the left edge and 27pt from the right in Figma.
    paddingLeft: 28,
    paddingRight: 27,
  },
  button: {
    width: BUTTON_SIZE,
    height: BUTTON_SIZE,
    borderRadius: BUTTON_SIZE / 2,
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logo: {
    width: 65,
    height: 25.606,
    // Figma centres the wordmark 1pt right of the screen's centre line.
    marginLeft: 2,
  },
});
