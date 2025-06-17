export default {
  expo: {
    name: 'nine-2-five',
    slug: 'nine-2-five',
    version: '1.0.0',
    scheme: 'nine-2-five',
    web: {
      bundler: 'metro',
      output: 'static',
      favicon: './assets/favicon.png',
    },
    plugins: ['expo-router', 'expo-font', 'expo-background-task', 'expo-notifications'],
    experiments: {
      typedRoutes: true,
      tsconfigPaths: true,
    },
    orientation: 'portrait',
    icon: './assets/icon.png',
    userInterfaceStyle: 'automatic',
    splash: {
      image: './assets/splash.png',
      resizeMode: 'contain',
      backgroundColor: '#ffffff',
    },
    assetBundlePatterns: ['**/*'],
    ios: {
      supportsTablet: true,
    },
    android: {
      useNextNotificationsApi: true,
      adaptiveIcon: {
        foregroundImage: './assets/adaptive-icon.png',
        backgroundColor: '#ffffff',
      },
      package: 'com.chandlerbong.nine2five',
    },
    extra: {
      router: {},
      eas: {
        projectId: '44a7cba6-95c3-421a-b34f-0016a7ee207b',
      },
    },
  },
};
