/**
 * Admin Settings Page
 * ====================
 * Site-wide settings and page toggles
 */

import { useState } from 'react';
import { Settings, Globe, Save, RefreshCw } from 'lucide-react';
import toast from 'react-hot-toast';
import { useSettingsStore } from '@/store/settingsStore';
import { updateSiteSettings } from '@/lib/settingsService';

export default function AdminSettings() {
  const { settings, setSettings } = useSettingsStore();
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Local form state
  const [formData, setFormData] = useState({
    siteName: settings.siteName,
    siteDescription: settings.siteDescription,
    homepageEnabled: settings.homepageEnabled,
    productsPageEnabled: settings.productsPageEnabled,
  });

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const success = await updateSiteSettings(formData);
      if (success) {
        setSettings({ ...settings, ...formData });
        toast.success('Settings saved successfully');
      } else {
        toast.error('Failed to save settings');
      }
    } catch (error) {
      toast.error('An error occurred');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Reset to defaults
  const handleReset = () => {
    setFormData({
      siteName: 'Mohona Textiles',
      siteDescription: 'Premium quality clothing for men and women',
      homepageEnabled: true,
      productsPageEnabled: true,
    });
  };

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
          <Settings className="h-8 w-8" />
          Settings
        </h1>
        <p className="text-gray-600 mt-1">
          Configure site-wide settings and page visibility
        </p>
      </div>

      <form onSubmit={handleSubmit} className="max-w-2xl space-y-8">
        {/* Site Information */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <Globe className="h-5 w-5 text-primary-600" />
            Site Information
          </h2>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Site Name
              </label>
              <input
                type="text"
                value={formData.siteName}
                onChange={(e) =>
                  setFormData({ ...formData, siteName: e.target.value })
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Site Description
              </label>
              <textarea
                value={formData.siteDescription}
                onChange={(e) =>
                  setFormData({ ...formData, siteDescription: e.target.value })
                }
                rows={3}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              />
            </div>
          </div>
        </div>

        {/* Page Visibility */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Page Visibility
          </h2>
          <p className="text-sm text-gray-600 mb-4">
            Control which pages are visible to customers. Disabled pages will
            show a "Coming Soon" message.
          </p>

          <div className="space-y-4">
            <label className="flex items-center justify-between p-4 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100 transition-colors">
              <div>
                <span className="font-medium text-gray-900">Homepage</span>
                <p className="text-sm text-gray-500">
                  The main landing page with hero section and featured products
                </p>
              </div>
              <input
                type="checkbox"
                checked={formData.homepageEnabled}
                onChange={(e) =>
                  setFormData({ ...formData, homepageEnabled: e.target.checked })
                }
                className="h-5 w-5 text-primary-600 rounded"
              />
            </label>

            <label className="flex items-center justify-between p-4 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100 transition-colors">
              <div>
                <span className="font-medium text-gray-900">Products Page</span>
                <p className="text-sm text-gray-500">
                  The product listing page with all products and filters
                </p>
              </div>
              <input
                type="checkbox"
                checked={formData.productsPageEnabled}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    productsPageEnabled: e.target.checked,
                  })
                }
                className="h-5 w-5 text-primary-600 rounded"
              />
            </label>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-4">
          <button
            type="button"
            onClick={handleReset}
            className="flex items-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
          >
            <RefreshCw className="h-4 w-4" />
            Reset to Defaults
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 disabled:opacity-50"
          >
            <Save className="h-4 w-4" />
            {isSubmitting ? 'Saving...' : 'Save Settings'}
          </button>
        </div>
      </form>
    </div>
  );
}
