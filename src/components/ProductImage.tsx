/**
 * Product Image Component
 * =======================
 * Handles Google Drive images with proper loading states
 */

import { useState, useMemo } from 'react';
import { getEmbeddableImageUrl } from '@/lib/utils';

interface ProductImageProps {
  src: string | undefined | null;
  alt: string;
  className?: string;
  fallback?: string;
}

export default function ProductImage({ 
  src, 
  alt, 
  className = '', 
  fallback = '/placeholder.jpg' 
}: ProductImageProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);
  
  // Memoize the URL to prevent recalculation
  const imageUrl = useMemo(() => getEmbeddableImageUrl(src), [src]);
  
  return (
    <div className={`relative bg-gray-100 overflow-hidden ${className}`}>
      {/* Loading placeholder */}
      {!isLoaded && !hasError && (
        <div className="absolute inset-0 bg-gray-200 animate-pulse" />
      )}
      
      <img
        src={hasError ? fallback : imageUrl}
        alt={alt}
        className={`w-full h-full object-cover transition-opacity duration-300 ${
          isLoaded ? 'opacity-100' : 'opacity-0'
        }`}
        loading="lazy"
        onLoad={() => setIsLoaded(true)}
        onError={() => {
          setHasError(true);
          setIsLoaded(true);
        }}
      />
    </div>
  );
}
