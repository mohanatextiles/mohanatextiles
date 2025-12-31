/**
 * Product Service
 * ===============
 * Handles all API operations for products
 */

import { apiRequest } from './api';
import { Product, ProductFormData, Category, DashboardStats } from '@/types';

/**
 * Get all enabled products (for customer view)
 */
export const getEnabledProducts = async (): Promise<Product[]> => {
  try {
    return await apiRequest<Product[]>('/api/products');
  } catch (error) {
    console.error('Error fetching products:', error);
    return [];
  }
};

/**
 * Get products by category (for customer view)
 */
export const getProductsByCategory = async (category: string): Promise<Product[]> => {
  try {
    return await apiRequest<Product[]>(`/api/products?category=${category}`);
  } catch (error) {
    console.error('Error fetching products by category:', error);
    return [];
  }
};

/**
 * Get single product by ID
 */
export const getProductById = async (id: string): Promise<Product | null> => {
  try {
    return await apiRequest<Product>(`/api/products/${id}`);
  } catch (error) {
    console.error('Error fetching product:', error);
    return null;
  }
};

/**
 * Get all products (for admin view)
 */
export const getAllProducts = async (): Promise<Product[]> => {
  try {
    return await apiRequest<Product[]>('/api/products/admin/all');
  } catch (error) {
    console.error('Error fetching all products:', error);
    return [];
  }
};

/**
 * Get product statistics for dashboard
 */
export const getProductStats = async (): Promise<DashboardStats> => {
  try {
    return await apiRequest<DashboardStats>('/api/products/stats');
  } catch (error) {
    console.error('Error fetching product stats:', error);
    return {
      totalProducts: 0,
      enabledProducts: 0,
      categories: [],
    };
  }
};

/**
 * Create a new product
 */
export const createProduct = async (
  data: ProductFormData,
  imageData: string
): Promise<string | null> => {
  try {
    const response = await apiRequest<Product>(`/api/products?image_data=${encodeURIComponent(imageData)}`, {
      method: 'POST',
      body: JSON.stringify({
        name: data.name,
        category: data.category,
        price: data.price,
        discount: data.discount,
        description: data.description,
        enabled: data.enabled,
        sizes: data.sizes,
        colors: data.colors,
      }),
    });
    return response.id;
  } catch (error) {
    console.error('Error creating product:', error);
    return null;
  }
};

/**
 * Update an existing product
 */
export const updateProduct = async (
  id: string,
  data: Partial<ProductFormData>,
  imageData?: string
): Promise<boolean> => {
  try {
    const updateData: Record<string, unknown> = {};
    
    if (data.name !== undefined) updateData.name = data.name;
    if (data.category !== undefined) updateData.category = data.category;
    if (data.price !== undefined) updateData.price = data.price;
    if (data.discount !== undefined) updateData.discount = data.discount;
    if (data.description !== undefined) updateData.description = data.description;
    if (data.enabled !== undefined) updateData.enabled = data.enabled;
    if (data.sizes !== undefined) updateData.sizes = data.sizes;
    if (data.colors !== undefined) updateData.colors = data.colors;
    if (imageData) updateData.image_data = imageData;
    
    await apiRequest<Product>(`/api/products/${id}`, {
      method: 'PUT',
      body: JSON.stringify(updateData),
    });
    return true;
  } catch (error) {
    console.error('Error updating product:', error);
    return false;
  }
};

/**
 * Toggle product enabled status
 */
export const toggleProductEnabled = async (
  id: string,
  enabled: boolean
): Promise<boolean> => {
  try {
    await apiRequest(`/api/products/${id}/toggle-enabled?enabled=${enabled}`, {
      method: 'PATCH',
    });
    return true;
  } catch (error) {
    console.error('Error toggling product:', error);
    return false;
  }
};

/**
 * Delete a product
 */
export const deleteProduct = async (id: string): Promise<boolean> => {
  try {
    await apiRequest(`/api/products/${id}`, {
      method: 'DELETE',
    });
    return true;
  } catch (error) {
    console.error('Error deleting product:', error);
    return false;
  }
};

// ============== CATEGORIES ==============

/**
 * Get all enabled categories
 */
export const getCategories = async (): Promise<Category[]> => {
  try {
    return await apiRequest<Category[]>('/api/categories');
  } catch (error) {
    console.error('Error fetching categories:', error);
    return [];
  }
};

/**
 * Get all categories (admin)
 */
export const getAllCategories = async (): Promise<Category[]> => {
  try {
    return await apiRequest<Category[]>('/api/categories/admin/all');
  } catch (error) {
    console.error('Error fetching all categories:', error);
    return [];
  }
};

/**
 * Create a category
 */
export const createCategory = async (
  name: string,
  slug: string,
  description?: string
): Promise<string | null> => {
  try {
    const response = await apiRequest<Category>('/api/categories', {
      method: 'POST',
      body: JSON.stringify({ name, slug, description: description || '' }),
    });
    return response.id;
  } catch (error) {
    console.error('Error creating category:', error);
    return null;
  }
};

/**
 * Delete a category
 */
export const deleteCategory = async (id: string): Promise<boolean> => {
  try {
    await apiRequest(`/api/categories/${id}`, {
      method: 'DELETE',
    });
    return true;
  } catch (error) {
    console.error('Error deleting category:', error);
    return false;
  }
};

/**
 * Seed default categories
 */
export const seedCategories = async (): Promise<Category[]> => {
  try {
    return await apiRequest<Category[]>('/api/categories/seed', {
      method: 'POST',
    });
  } catch (error) {
    console.error('Error seeding categories:', error);
    return [];
  }
};
