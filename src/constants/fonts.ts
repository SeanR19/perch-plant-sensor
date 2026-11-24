/**
 * Allo, the typeface from the Figma file. Each weight is its own family on
 * React Native — set `fontFamily` to one of these and leave `fontWeight` unset,
 * or iOS will try to synthesise a weight on top.
 *
 * Loaded in the root layout from src/assets/fonts.
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
