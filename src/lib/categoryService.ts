/**
 * Category Service
 * ================
 * API calls for categories
 */

import { apiRequest } from './api';
import { Category } from '@/types';

/**
 * Get all enabled categories
 */
export const getEnabledCategories = async (): Promise<Category[]> => {
  try {
    const categories = await apiRequest<Category[]>('/api/categories');
    return categories;
  } catch (error) {
    console.error('Error fetching categories:', error);
    return [];
  }
};
