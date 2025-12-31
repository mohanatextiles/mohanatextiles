/**
 * Settings Store (Zustand)
 * ========================
 * Global state management for site settings
 */

import { create } from 'zustand';
import { SiteSettings } from '@/types';
import { getSiteSettings } from '@/lib/settingsService';

interface SettingsState {
  settings: SiteSettings;
  isLoading: boolean;
  setSettings: (settings: SiteSettings) => void;
  setIsLoading: (isLoading: boolean) => void;
  refreshSettings: () => Promise<void>;
  fetchSettings: () => Promise<void>;
}

const defaultSettings: SiteSettings = {
  homepageEnabled: true,
  productsPageEnabled: true,
  siteName: 'Mohona Textiles',
  siteDescription: 'Premium quality clothing for men and women',
  driveFolderId: '1ms1u6tuw22Bsl1SsGpR1zXtkR_zsgddx',
};

export const useSettingsStore = create<SettingsState>()((set) => ({
  settings: defaultSettings,
  isLoading: true,
  setSettings: (settings) => set({ settings }),
  setIsLoading: (isLoading) => set({ isLoading }),
  refreshSettings: async () => {
    try {
      const settings = await getSiteSettings();
      set({ settings });
    } catch (error) {
      console.error('Failed to refresh settings:', error);
    }
  },
  fetchSettings: async () => {
    try {
      const settings = await getSiteSettings();
      set({ settings });
    } catch (error) {
      console.error('Failed to fetch settings:', error);
    }
  },
}));

/**
 * Initialize settings - fetch once on app start
 */
export const initializeSettings = async () => {
  const { setSettings, setIsLoading } = useSettingsStore.getState();
  
  try {
    const settings = await getSiteSettings();
    setSettings(settings);
  } catch (error) {
    console.error('Failed to load settings:', error);
  } finally {
    setIsLoading(false);
  }
};
