/**
 * Authentication Service
 * ======================
 * Handles API authentication for admin users
 */

import { apiRequest } from './api';
import { AdminUser, AuthResponse } from '@/types';

/**
 * Sign in admin user with email and password
 */
export const signInAdmin = async (
  email: string,
  password: string
): Promise<{ user: AdminUser | null; token: string | null; error: string | null }> => {
  try {
    const response = await apiRequest<AuthResponse>('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
    
    // Store token in sessionStorage (persists on refresh, clears on close)
    sessionStorage.setItem('auth_token', response.access_token);
    
    return { user: response.user, token: response.access_token, error: null };
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Authentication failed';
    console.error('Sign in error:', errorMessage);
    return { user: null, token: null, error: errorMessage };
  }
};

/**
 * Sign out current user
 */
export const signOutAdmin = async (): Promise<{ error: string | null }> => {
  try {
    // Remove token from sessionStorage
    sessionStorage.removeItem('auth_token');
    return { error: null };
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Sign out failed';
    return { error: errorMessage };
  }
};

/**
 * Get current authenticated user from token
 */
export const getCurrentUser = async (): Promise<AdminUser | null> => {
  const token = sessionStorage.getItem('auth_token');
  if (!token) return null;
  
  try {
    const response = await apiRequest<AdminUser>('/api/auth/me');
    return response;
  } catch {
    // Token expired or invalid
    sessionStorage.removeItem('auth_token');
    return null;
  }
};

/**
 * Check if user has valid token
 */
export const hasValidToken = (): boolean => {
  return !!sessionStorage.getItem('auth_token');
};

/**
 * Verify token with API
 */
export const verifyToken = async (): Promise<{ valid: boolean; user: AdminUser | null }> => {
  const token = sessionStorage.getItem('auth_token');
  if (!token) return { valid: false, user: null };
  
  try {
    // Use /api/auth/me to verify token and get user
    const user = await apiRequest<AdminUser>('/api/auth/me');
    return { valid: true, user };
  } catch {
    // Token invalid - don't remove yet, let the caller decide
    return { valid: false, user: null };
  }
};
