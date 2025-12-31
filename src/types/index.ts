/**
 * TypeScript Type Definitions
 * ===========================
 * All types used throughout the application
 */

// Product type from API
export interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  discount: number;
  finalPrice: number;
  description: string;
  imageData: string;
  enabled: boolean;
  sizes: string[];
  colors: ColorVariant[];
  createdAt: string;
  updatedAt?: string;
}

// Color variant for products
export interface ColorVariant {
  name: string;
  hex: string;
}

// Category type
export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  enabled: boolean;
  createdAt: string;
}

// Site settings from API
export interface SiteSettings {
  homepageEnabled: boolean;
  productsPageEnabled: boolean;
  siteName: string;
  siteDescription: string;
  driveFolderId: string;
}

// Admin user type
export interface AdminUser {
  id: string;
  email: string;
  displayName?: string;
  isAdmin: boolean;
}

// Auth response from API
export interface AuthResponse {
  access_token: string;
  token_type: string;
  user: AdminUser;
}

// Form data for creating/editing products
export interface ProductFormData {
  name: string;
  category: string;
  price: number;
  discount: number;
  description: string;
  enabled: boolean;
  sizes: string[];
  colors: ColorVariant[];
}

// API response types
export interface ApiResponse<T> {
  data: T | null;
  error: string | null;
}

// Dashboard stats
export interface DashboardStats {
  totalProducts: number;
  enabledProducts: number;
  categories: string[];
}
