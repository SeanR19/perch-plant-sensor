/**
 * The app's palette, keyed by role rather than by hue, so a component asks for
 * `textSecondary` and gets whatever the active scheme says that is. Both
 * schemes must define every key — the ThemeColors type enforces it.
 *
 * Placeholder values until the Figma tokens are pulled in.
 */

const light = {
  background: '#F3F1EA',
  /** Soft colour blobs behind the glass so the material has something to refract. */
  glow1: '#B8D8A8',
  glow2: '#E9D8A6',
  glow3: '#A8CFC4',

  textPrimary: '#1E3A2B',
  textSecondary: '#5E7466',

  primary: '#2F6B45',
  onPrimary: '#FFFFFF',

  /** Tint laid over Liquid Glass (and the fill of the blur fallback). */
  glassTint: 'rgba(255, 255, 255, 0.35)',
  glassBorder: 'rgba(255, 255, 255, 0.6)',

  good: '#3B8E5A',
  warn: '#C98A1B',
  bad: '#C2553D',
  track: 'rgba(30, 58, 43, 0.12)',
} as const;

const dark: Record<keyof typeof light, string> = {
  background: '#0B1410',
  glow1: '#1F4D33',
  glow2: '#4A3F1C',
  glow3: '#1B4A45',

  textPrimary: '#EAF2EC',
  textSecondary: '#9DB3A5',

  primary: '#6BBF84',
  onPrimary: '#0B1410',

  glassTint: 'rgba(20, 35, 28, 0.35)',
  glassBorder: 'rgba(255, 255, 255, 0.12)',

  good: '#6BBF84',
  warn: '#E0A93B',
  bad: '#E07A62',
  track: 'rgba(234, 242, 236, 0.12)',
};

export const Colors = { light, dark } as const;

export type ThemeColors = Record<keyof typeof light, string>;
export type ThemeColor = keyof typeof light;

export const Spacing = {
  one: 4,
  two: 8,
  three: 16,
  four: 24,
  five: 32,
} as const;

/** Nav bar, straight from Figma (90:1269). Same in both schemes for now. */
export const NavBarColors = {
  fill: 'rgba(143, 143, 143, 0.14)',
  selection: '#D9D9D9',
  icon: '#FFFFFF',
} as const;
