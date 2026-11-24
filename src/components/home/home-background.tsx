import { BlurView } from 'expo-blur';
import { Image } from 'expo-image';
import { StyleSheet, useWindowDimensions, View } from 'react-native';

import { Gradient } from '@/components/gradient';

/** Width of the Figma frame (WP-Version-Blackhawk-Mobile, 169:65). */
const DESIGN_WIDTH = 375;
/** Bottom edge of the photo layers and the blur, in Figma points. */
const BACKGROUND_BOTTOM = 838;
/**
 * Where the blur-to-black layer starts, in Figma points from the top. Figma
 * has 302, just above the stat cards, but its hard top edge sat too high on
 * the phone. Raise or lower this to move it; the bottom stays put.
 */
const BLUR_TOP = 420;

/**
 * The fixed backdrop behind the home screen: the fern photo, the moonlit
 * monstera on top of it, and two gradients that darken toward the bottom.
 * Layer boxes are straight from Figma, scaled to the screen width so the
 * photos still cover wider phones.
 *
 * Not included: the Figma "image 1" raindrop layer, which is at 1% opacity
 * and doesn't show in the design.
 */
export function HomeBackground() {
  const { width } = useWindowDimensions();
  const s = width / DESIGN_WIDTH;
  const box = (left: number, top: number, w: number, h: number) => ({
    position: 'absolute' as const,
    left: left * s,
    top: top * s,
    width: w * s,
    height: h * s,
  });

  return (
    <View style={styles.root} pointerEvents="none">
      <Image source={require('../../assets/home/sky.jpg')} style={box(-91, 0, 559, 838)} contentFit="cover" />
      <Image
        source={require('../../assets/home/monstera-canopy.jpg')}
        style={box((DESIGN_WIDTH - 383) / 2, 0, 383, 623)}
        contentFit="cover"
      />

      {/* Rectangle 1: a 13.5px backdrop blur, fading to black at the bottom. */}
      <View style={box(0, BLUR_TOP, DESIGN_WIDTH, BACKGROUND_BOTTOM - BLUR_TOP)}>
        <BlurView intensity={20} style={StyleSheet.absoluteFill} />
        <Gradient
          stops={[
            { offset: 0, color: 'rgba(0, 0, 0, 0)' },
            { offset: 1, color: 'rgb(0, 0, 0)' },
          ]}
        />
      </View>

      {/* Rectangle 2: Figma puts black at 405.6% of the height, so at the
          rectangle's bottom edge it has only reached 100/405.6 ≈ 25%. */}
      <View style={box(0, 0, DESIGN_WIDTH, 476)}>
        <Gradient
          stops={[
            { offset: 0, color: 'rgba(0, 0, 0, 0)' },
            { offset: 1, color: 'rgba(0, 0, 0, 0.2466)' },
          ]}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    ...StyleSheet.absoluteFill,
    backgroundColor: '#F6F2EF',
    overflow: 'hidden',
  },
});
