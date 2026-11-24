import type { ConfigContext, ExpoConfig } from 'expo/config';

/**
 * Builds on app.json. The preview build (APP_VARIANT=preview, set in eas.json
 * and by `npm run update:preview`) gets its own name and bundle identifier, so
 * it installs alongside the development build instead of replacing it.
 */
export default ({ config }: ConfigContext): ExpoConfig => {
  const isPreview = process.env.APP_VARIANT === 'preview';
  if (!isPreview) return config as ExpoConfig;

  return {
    ...config,
    name: 'Perch Preview',
    slug: config.slug!,
    ios: {
      ...config.ios,
      bundleIdentifier: `${config.ios?.bundleIdentifier}.preview`,
    },
  };
};
