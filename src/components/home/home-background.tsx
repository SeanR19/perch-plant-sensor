import { BlurView } from 'expo-blur';
import { Image } from 'expo-image';
import { StyleSheet, useWindowDimensions, View } from 'react-native';

import { Gradient } from '@/components/gradient';

/** Width of the Figma frame (WP-Version-Blackhawk-Mobile, 169:65). */
const DESIGN_WIDTH = 375;

// Rectangle 1 (Figma 169:68) runs from y 302 to 838. Its fill is a gradient
// from clear to black over that whole height; its background blur is
// *progressive*: none at all until 32% of the way down (y ≈ 474), then
// ramping up to a 27px blur at the bottom.
const RECT_TOP = 302;
const RECT_BOTTOM = 838;
const BLUR_START = RECT_TOP + 0.3209 * (RECT_BOTTOM - RECT_TOP);

/**
 * expo-blur can't fade a blur in, so the ramp is built from stacked bands:
 * each starts a step lower and adds a little more blur, so the strength
 * climbs in small, hard-to-see steps rather than one hard edge. (A true
 * gradient-masked blur needs @react-native-masked-view, a native rebuild.)
 */
const BLUR_BANDS = 8;
/** Blur added by each band; the bottom, under all of them, gets the total. */
const BLUR_INTENSITY_PER_BAND = 8;

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
      <Image
        source={require('../../assets/home/sky.jpg')}
        style={box(-91, 0, 559, 838)}
        contentFit="cover"
      />
      <Image
        source={require('../../assets/home/monstera-canopy.jpg')}
        style={box((DESIGN_WIDTH - 383) / 2, 0, 383, 623)}
        contentFit="cover"
      />

      {/* Rectangle 1: the progressive blur, then the clear-to-black fill on top. */}
      {Array.from({ length: BLUR_BANDS }, (_, i) => {
        const top = BLUR_START + ((RECT_BOTTOM - BLUR_START) * i) / BLUR_BANDS;
        return (
          <BlurView
            key={i}
            // Dark tint, so stacking the bands deepens toward the black the
            // gradient is heading for, rather than washing the photo out grey.
            tint="dark"
            intensity={BLUR_INTENSITY_PER_BAND}
            style={box(0, top, DESIGN_WIDTH, RECT_BOTTOM - top)}
          />
        );
      })}
      <View style={box(0, RECT_TOP, DESIGN_WIDTH, RECT_BOTTOM - RECT_TOP)}>
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
