/**
 * Scheme-aware colours, keyed by role. Only the placeholder tabs use these so
 * far — the home screen takes its colours straight from Figma, since it sits
 * on a dark photo in both schemes. Both schemes must define every key; the
 * ThemeColors type enforces it.
 */

const light = {
  background: '#F3F1EA',
  textPrimary: '#1E3A2B',
  textSecondary: '#5E7466',
} as const;

const dark: Record<keyof typeof light, string> = {
  background: '#0B1410',
  textPrimary: '#EAF2EC',
  textSecondary: '#9DB3A5',
};

export const Colors = { light, dark } as const;

export type ThemeColors = Record<keyof typeof light, string>;
export type ThemeColor = keyof typeof light;
