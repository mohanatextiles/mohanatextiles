import { clsx, type ClassValue } from 'clsx';

/**
 * Utility function to merge class names
 */
export function cn(...inputs: ClassValue[]) {
  return clsx(inputs);
}

/**
 * Format currency to Indian Rupees
 */
export function formatPrice(price: number): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price);
}

/**
 * Calculate discount percentage
 */
export function calculateDiscountPercentage(
  originalPrice: number,
  salePrice: number
): number {
  if (originalPrice <= 0) return 0;
  return Math.round(((originalPrice - salePrice) / originalPrice) * 100);
}

/**
 * Generate a URL-friendly slug from a string
 */
export function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

/**
 * Truncate text to a specified length
 */
export function truncate(text: string, length: number): string {
  if (text.length <= length) return text;
  return text.slice(0, length) + '...';
}

/**
 * Format date to readable string
 * Handles ISO strings, Date objects, and Firestore timestamps
 */
export function formatDate(date: Date | string | { seconds: number } | null | undefined): string {
  if (!date) return 'N/A';
  
  let d: Date;
  if (typeof date === 'string') {
    d = new Date(date);
  } else if ('seconds' in date) {
    d = new Date(date.seconds * 1000);
  } else {
    d = date;
  }
  
  if (isNaN(d.getTime())) return 'Invalid date';
  
  return new Intl.DateTimeFormat('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  }).format(d);
}

/**
 * Convert Google Drive URL to embeddable format
 * Uses backend proxy to avoid CORS issues
 */
export function getEmbeddableImageUrl(url: string | undefined | null): string {
  if (!url) return '/placeholder.jpg';
  
  // Local or data URLs - return as-is
  if (url.startsWith('data:')) return url;
  if (url.startsWith('/')) return url;
  if (url.startsWith('http://localhost')) return url;
  
  // Not a Google URL - return as-is
  if (!url.includes('google.com') && !url.includes('googleusercontent.com')) {
    return url;
  }
  
  // Extract file ID from ANY Google URL format
  let fileId = '';
  
  // Format: lh3.googleusercontent.com/d/FILE_ID
  const lh3Match = url.match(/googleusercontent\.com\/d\/([a-zA-Z0-9_-]+)/);
  if (lh3Match) fileId = lh3Match[1];
  
  // Format: drive.google.com/file/d/FILE_ID/view
  const fileMatch = url.match(/\/file\/d\/([a-zA-Z0-9_-]+)/);
  if (!fileId && fileMatch) fileId = fileMatch[1];
  
  // Format: drive.google.com/open?id=FILE_ID
  const openMatch = url.match(/open\?id=([a-zA-Z0-9_-]+)/);
  if (!fileId && openMatch) fileId = openMatch[1];
  
  // Format: id=FILE_ID (covers uc?export=view&id=, thumbnail?id=, etc)
  const idMatch = url.match(/[?&]id=([a-zA-Z0-9_-]+)/);
  if (!fileId && idMatch) fileId = idMatch[1];
  
  // Format: /d/FILE_ID (generic)
  const dMatch = url.match(/\/d\/([a-zA-Z0-9_-]+)/);
  if (!fileId && dMatch) fileId = dMatch[1];
  
  if (fileId) {
    // Use backend proxy to avoid CORS issues
    const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:8000';
    return `${apiUrl}/api/images/drive/${fileId}`;
  }
  
  // Fallback - use proxy with full URL
  const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:8000';
  return `${apiUrl}/api/images/proxy?url=${encodeURIComponent(url)}`;
}
