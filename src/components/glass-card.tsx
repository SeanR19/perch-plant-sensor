import { BlurView } from 'expo-blur';
import { GlassView, isLiquidGlassAvailable } from 'expo-glass-effect';
import { type ReactNode } from 'react';
import { StyleSheet, type StyleProp, type ViewStyle } from 'react-native';

import { useTheme } from '@/hooks/use-theme';

// Resolved once: the answer cannot change while the app is running, and the
// check crosses into a native module.
const CAN_USE_LIQUID_GLASS = isLiquidGlassAvailable();

/**
 * A panel on Apple's Liquid Glass material (iOS 26+). Below iOS 26 — and on
 * web/Android — GlassView renders as a bare View, so a blur stands in to keep
 * the panel from going transparent.
 */
export function GlassCard({
  children,
  style,
}: {
  children: ReactNode;
  style?: StyleProp<ViewStyle>;
}) {
  const c = useTheme();
  const base = [styles.card, { borderColor: c.glassBorder }, style];

  // Liquid Glass carries its own material, so the tint goes through tintColor
  // rather than backgroundColor — an opaque background would sit in front of
  // the glass and flatten it back into a plain panel.
  if (CAN_USE_LIQUID_GLASS) {
    return (
      <GlassView glassEffectStyle="regular" tintColor={c.glassTint} style={base}>
        {children}
      </GlassView>
    );
  }

  return (
    <BlurView intensity={40} style={[base, { backgroundColor: c.glassTint }]}>
      {children}
    </BlurView>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 24,
    borderWidth: 1,
    overflow: 'hidden',
  },
});
