import { create } from 'zustand';
import { getSettings, updateSettings, Settings } from '../db';

type Theme = 'light' | 'dark' | 'ink';
type FontSize = 'small' | 'medium' | 'large';

interface SettingsStore extends Settings {
  isLoaded: boolean;
  loadSettings: () => Promise<void>;
  setTheme: (theme: Theme) => Promise<void>;
  setFontSize: (size: FontSize) => Promise<void>;
}

export const useSettingsStore = create<SettingsStore>((set, get) => ({
  id: 'user-settings',
  theme: 'light',
  fontSize: 'medium',
  isLoaded: false,

  loadSettings: async () => {
    try {
      const settings = await getSettings();
      if (settings) {
        set({
          theme: settings.theme,
          fontSize: settings.fontSize,
          isLoaded: true
        });
      } else {
        set({ isLoaded: true });
      }
      const { theme, fontSize } = get();
      applyTheme(theme);
      applyFontSize(fontSize);
    } catch (err) {
      set({ isLoaded: true });
    }
  },

  setTheme: async (theme: Theme) => {
    set({ theme });
    await updateSettings({ theme });
    applyTheme(theme);
  },

  setFontSize: async (fontSize: FontSize) => {
    set({ fontSize });
    await updateSettings({ fontSize });
    applyFontSize(fontSize);
  }
}));

function applyTheme(theme: Theme) {
  document.documentElement.setAttribute('data-theme', theme);
}

function applyFontSize(fontSize: FontSize) {
  document.documentElement.setAttribute('data-font-size', fontSize);
}
