import { createAnimations } from '@tamagui/animations-react-native';
import { createInterFont } from '@tamagui/font-inter';
import { shorthands } from '@tamagui/shorthands';
import { radius, size, space, zIndex } from '@tamagui/themes';

import { createTamagui, createTokens, Theme, styled, SizableText, H1, YStack, Button as ButtonTamagui } from 'tamagui';

// 1. Define your color tokens (if not using @tamagui/colors directly)
// This is where you would map your specific hex codes to token names
const customColors = {
  // Light mode specific colors
  lightPrimary: '#007AFF',
  lightSecondary: '#E5E5EA',
  lightText: '#000000',
  lightBackground: '#FFFFFF',
  lightDarkGray: '#666666', // Example for your darkGray

  // Dark mode specific colors
  darkPrimary: '#0A84FF',
  darkSecondary: '#2C2C2E',
  darkText: '#FFFFFF',
  darkBackground: '#000000',
  darkDarkGray: '#999999', // Example for your darkGray
};

// 2. Create tokens
// Tamagui tokens are fundamental building blocks. Themes will reference these.
const tokens = createTokens({
  size, // Standard sizes from @tamagui/themes
  space, // Standard spacing from @tamagui/themes
  zIndex, // Standard zIndex from @tamagui/themes
  color: {
    ...customColors, // Spread your custom colors here
  },
  radius, // Standard radii from @tamagui/themes
});

// 3. Define your themes
// These themes will map semantic keys (like 'background', 'color', 'primary')
// to the actual color tokens.
const lightTheme = {
  background: tokens.color.lightBackground,
  backgroundHover: tokens.color.lightSecondary, // Example for hover states
  backgroundPress: tokens.color.lightSecondary,
  color: tokens.color.lightText,
  colorHover: tokens.color.lightText,
  colorPress: tokens.color.lightText,
  primary: tokens.color.lightPrimary, // Custom key for primary color
  darkGray: tokens.color.lightDarkGray, // Custom key for dark gray
  // Add other keys you use in your styles: borderColor, shadowColor, etc.
};

const darkTheme = {
  background: tokens.color.darkBackground,
  backgroundHover: tokens.color.darkSecondary,
  backgroundPress: tokens.color.darkSecondary,
  color: tokens.color.darkText,
  colorHover: tokens.color.darkText,
  colorPress: tokens.color.darkText,
  primary: tokens.color.darkPrimary,
  darkGray: tokens.color.darkDarkGray,
  // Add other keys you use
};

const themes = {
  light: lightTheme,
  dark: darkTheme,
};

const animations = createAnimations({
  bouncy: {
    damping: 10,
    mass: 0.9,
    stiffness: 100,
    type: 'spring',
  },
  lazy: {
    damping: 20,
    type: 'spring',
    stiffness: 60,
  },
  quick: {
    damping: 20,
    mass: 1.2,
    stiffness: 250,
    type: 'spring',
  },
});

const headingFont = createInterFont();

const bodyFont = createInterFont();

export const Container = styled(YStack, {
  flex: 1,
  padding: 24,
});

export const Main = styled(YStack, {
  flex: 1,
  justifyContent: 'space-between',
  maxWidth: 960,
});

export const Title = styled(H1, {
  color: '#000',
  size: '$12',
});

export const Subtitle = styled(SizableText, {
  color: '#38434D',
  size: '$9',
});

export const Button = styled(ButtonTamagui, {
  backgroundColor: '#6366F1',
  borderRadius: 28,
  hoverStyle: {
    backgroundColor: '#5a5fcf',
  },
  pressStyle: {
    backgroundColor: '#5a5fcf',
  },
  maxWidth: 500,

  // Shaddows
  shadowColor: '#000',
  shadowOffset: {
    height: 2,
    width: 0,
  },
  shadowOpacity: 0.25,
  shadowRadius: 3.84,

  // Button text
  color: '#FFFFFF',
  fontWeight: '600', // Is not passed down to the text. Probably a bug in Tamagui: https://github.com/tamagui/tamagui/issues/1156#issuecomment-1802594930
  fontSize: 16,
});

const config = createTamagui({
  light: {
    color: {
      background: 'gray',
      text: 'black',
    },
  },
  defaultFont: 'body',
  animations,
  shouldAddPrefersColorThemes: true,
  themeClassNameOnRoot: true,
  shorthands,
  fonts: {
    body: bodyFont,
    heading: headingFont,
  },
  themes,
  tokens,
});

type AppConfig = typeof config;

// Enable auto-completion of props shorthand (ex: jc="center") for Tamagui templates.
// Docs: https://tamagui.dev/docs/core/configuration

declare module 'tamagui' {
  interface TamaguiCustomConfig extends AppConfig {}
}

export default config;
