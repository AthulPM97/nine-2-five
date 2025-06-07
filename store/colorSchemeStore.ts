import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

export type ColorScheme = 'light' | 'dark';

interface ColorSchemeState {
  colorScheme: ColorScheme;
  setColorScheme: (scheme: ColorScheme) => void;
  toggleColorScheme: () => void;
}

const useColorSchemeStore = create<ColorSchemeState>()(
  persist(
    (set, get) => ({
      colorScheme: 'light',
      setColorScheme: (scheme) => set({ colorScheme: scheme }),
      toggleColorScheme: () =>
        set({ colorScheme: get().colorScheme === 'light' ? 'dark' : 'light' }),
    }),
    {
      name: 'color-scheme-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);

export default useColorSchemeStore;
