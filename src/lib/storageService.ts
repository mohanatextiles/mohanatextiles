/**
 * Storage Service
 * ===============
 * Handles image uploads via API
 */

import { apiFormRequest, apiRequest } from './api';

/**
 * Upload an image via API
 * @param file - The file to upload
 * @param folder - The storage folder (e.g., 'products')
 * @returns The download URL of the uploaded image
 */
export const uploadImage = async (
  file: File,
  folder: string = 'products'
): Promise<{ url: string | null; error: string | null }> => {
  try {
    // Validate before upload
    const validation = validateImage(file);
    if (!validation.valid) {
      return { url: null, error: validation.error };
    }
    
    // Create form data
    const formData = new FormData();
    formData.append('file', file);
    
    // Upload via API
    const response = await apiFormRequest<{ url: string }>(
      `/api/upload/image?folder=${folder}`,
      formData
    );
    
    return { url: response.url, error: null };
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Upload failed';
    console.error('Upload error:', errorMessage);
    return { url: null, error: errorMessage };
  }
};

/**
 * Delete an image via API
 * @param imageUrl - The full URL of the image to delete
 */
export const deleteImage = async (
  imageUrl: string
): Promise<{ success: boolean; error: string | null }> => {
  try {
    await apiRequest(`/api/upload/image?image_url=${encodeURIComponent(imageUrl)}`, {
      method: 'DELETE',
    });
    return { success: true, error: null };
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Delete failed';
    console.error('Delete error:', errorMessage);
    return { success: false, error: errorMessage };
  }
};

/**
 * Validate image file before upload
 * @param file - The file to validate
 * @returns Validation result
 */
export const validateImage = (
  file: File
): { valid: boolean; error: string | null } => {
  // Check file type
  const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
  if (!allowedTypes.includes(file.type)) {
    return { valid: false, error: 'Invalid file type. Only JPEG, PNG, GIF, and WebP are allowed.' };
  }

  // Check file size (max 5MB)
  const maxSize = 5 * 1024 * 1024; // 5MB
  if (file.size > maxSize) {
    return { valid: false, error: 'File size too large. Maximum size is 5MB.' };
  }

  return { valid: true, error: null };
};
