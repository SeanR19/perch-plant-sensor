/**
 * Allo, the typeface from the Figma file. Each weight is its own family on
 * React Native — set `fontFamily` to one of these and leave `fontWeight` unset,
 * or iOS will try to synthesise a weight on top.
 *
 * Loaded in the root layout from src/assets/fonts: the static .otf cuts from
 * the official Allo release (github.com/joshpuckett/allo, fonts/otf), under
 * the SIL Open Font License — see OFL.txt beside them. The allo-font npm
 * package is web-only (CSS and WOFF2), which iOS can't load.
 */
export const Allo = {
  light: 'Allo-Light',
  regular: 'Allo-Regular',
  medium: 'Allo-Medium',
  semibold: 'Allo-SemiBold',
} as const;

export const AlloFontFiles = {
  [Allo.light]: require('../assets/fonts/Allo-Light.otf'),
  [Allo.regular]: require('../assets/fonts/Allo-Regular.otf'),
  [Allo.medium]: require('../assets/fonts/Allo-Medium.otf'),
  [Allo.semibold]: require('../assets/fonts/Allo-SemiBold.otf'),
};
