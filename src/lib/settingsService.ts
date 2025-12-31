/**
 * Settings Service
 * ================
 * Handles site-wide settings via API
 */

import { apiRequest } from './api';
import { SiteSettings } from '@/types';

/**
 * Default site settings
 */
const defaultSettings: SiteSettings = {
  homepageEnabled: true,
  productsPageEnabled: true,
  siteName: 'Mohona Textiles',
  siteDescription: 'Premium quality clothing for men and women',
};

/**
 * Get site settings
 */
export const getSiteSettings = async (): Promise<SiteSettings> => {
  try {
    return await apiRequest<SiteSettings>('/api/settings');
  } catch (error) {
    console.error('Error fetching settings:', error);
    return defaultSettings;
  }
};

/**
 * Update site settings
 */
export const updateSiteSettings = async (
  settings: Partial<SiteSettings>
): Promise<boolean> => {
  try {
    await apiRequest<SiteSettings>('/api/settings', {
      method: 'PUT',
      body: JSON.stringify(settings),
    });
    return true;
  } catch (error) {
    console.error('Error updating settings:', error);
    return false;
  }
};

/**
 * Subscribe to settings changes (polling-based)
 */
export const subscribeToSettings = (
  callback: (settings: SiteSettings) => void,
  intervalMs: number = 10000
): (() => void) => {
  // Initial fetch
  getSiteSettings().then(callback);
  
  // Set up polling
  const intervalId = setInterval(async () => {
    const settings = await getSiteSettings();
    callback(settings);
  }, intervalMs);
  
  // Return cleanup function
  return () => clearInterval(intervalId);
};

/**
 * Initialize default settings (no longer needed with API)
 */
export const initializeSettings = async (): Promise<boolean> => {
  // Settings are initialized on the backend
  return true;
};
