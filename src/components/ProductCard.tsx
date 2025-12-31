/**
 * Product Card Component
 * =======================
 * Professional product card with animations and full image display
 */

import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useState, useMemo } from 'react';
import { Heart, ShoppingBag, Eye } from 'lucide-react';
import { Product } from '@/types';
import { formatPrice, getEmbeddableImageUrl } from '@/lib/utils';

interface ProductCardProps {
  product: Product;
  index?: number;
}

export default function ProductCard({ product, index = 0 }: ProductCardProps) {
  const hasDiscount = product.discount > 0;
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  
  // Memoize the image URL to prevent recalculation on every render
  const imageUrl = useMemo(() => 
    getEmbeddableImageUrl(product.imageData), 
    [product.imageData]
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ 
        duration: 0.5, 
        delay: index * 0.1,
        ease: [0.25, 0.46, 0.45, 0.94]
      }}
      className="group relative"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Link to={`/products/${product.id}`} className="block">
        {/* Image Container - Full aspect ratio */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-gray-100 to-gray-200 aspect-[3/4] shadow-lg group-hover:shadow-2xl transition-shadow duration-500">
          {/* Shimmer loading effect */}
          {!imageLoaded && !imageError && (
            <div className="absolute inset-0 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 animate-shimmer" />
          )}
          
          {/* Main Image */}
          <motion.img
            src={imageError ? '/placeholder.jpg' : imageUrl}
            alt={product.name}
            className="w-full h-full object-cover object-center"
            style={{ 
              opacity: imageLoaded ? 1 : 0,
              transition: 'opacity 0.5s ease-in-out'
            }}
            animate={{ 
              scale: isHovered ? 1.08 : 1,
            }}
            transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
            loading="lazy"
            onLoad={() => setImageLoaded(true)}
            onError={() => {
              setImageError(true);
              setImageLoaded(true);
            }}
          />

          {/* Gradient Overlay on Hover */}
          <motion.div 
            className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"
            initial={{ opacity: 0 }}
            animate={{ opacity: isHovered ? 1 : 0 }}
            transition={{ duration: 0.3 }}
          />

          {/* Badges */}
          <div className="absolute top-3 left-3 flex flex-col gap-2 z-10">
            {hasDiscount && (
              <motion.span 
                className="bg-gradient-to-r from-red-500 to-pink-500 text-white px-3 py-1.5 rounded-full text-xs font-bold shadow-lg"
                initial={{ scale: 0, rotate: -10 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
              >
                -{product.discount}% OFF
              </motion.span>
            )}
          </div>

          {/* Quick Actions on Hover */}
          <motion.div 
            className="absolute top-3 right-3 flex flex-col gap-2 z-10"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: isHovered ? 1 : 0, x: isHovered ? 0 : 20 }}
            transition={{ duration: 0.3 }}
          >
            <button 
              className="p-2.5 bg-white/90 backdrop-blur-sm rounded-full shadow-lg hover:bg-white hover:scale-110 transition-all duration-200"
              onClick={(e) => { e.preventDefault(); }}
            >
              <Heart className="h-4 w-4 text-gray-700 hover:text-red-500" />
            </button>
            <button 
              className="p-2.5 bg-white/90 backdrop-blur-sm rounded-full shadow-lg hover:bg-white hover:scale-110 transition-all duration-200"
              onClick={(e) => { e.preventDefault(); }}
            >
              <Eye className="h-4 w-4 text-gray-700" />
            </button>
          </motion.div>

          {/* Add to Cart Button on Hover */}
          <motion.div 
            className="absolute bottom-4 left-4 right-4 z-10"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: isHovered ? 1 : 0, y: isHovered ? 0 : 20 }}
            transition={{ duration: 0.3, delay: 0.1 }}
          >
            <button 
              className="w-full py-3 bg-white/95 backdrop-blur-sm text-gray-900 font-semibold rounded-xl shadow-lg hover:bg-white transition-all duration-200 flex items-center justify-center gap-2 group/btn"
              onClick={(e) => { e.preventDefault(); }}
            >
              <ShoppingBag className="h-4 w-4 group-hover/btn:scale-110 transition-transform" />
              <span>Quick Add</span>
            </button>
          </motion.div>
        </div>

        {/* Product Info */}
        <motion.div 
          className="mt-4 px-1"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          {/* Category Tag */}
          <span className="text-xs font-medium text-primary-600 uppercase tracking-wider">
            {product.category}
          </span>

          {/* Product Name */}
          <h3 className="mt-1 text-base font-semibold text-gray-900 group-hover:text-primary-600 transition-colors duration-300 line-clamp-1">
            {product.name}
          </h3>

          {/* Price */}
          <div className="mt-2 flex items-center gap-2">
            <span className="text-lg font-bold text-gray-900">
              {formatPrice(product.finalPrice)}
            </span>
            {hasDiscount && (
              <span className="text-sm text-gray-400 line-through">
                {formatPrice(product.price)}
              </span>
            )}
          </div>

          {/* Colors Preview with animation */}
          {product.colors && product.colors.length > 0 && (
            <motion.div 
              className="mt-3 flex items-center gap-1.5"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              {product.colors.slice(0, 4).map((color, idx) => (
                <motion.div
                  key={idx}
                  className="h-5 w-5 rounded-full border-2 border-white shadow-sm ring-1 ring-gray-200 hover:ring-primary-400 transition-all cursor-pointer hover:scale-110"
                  style={{ backgroundColor: color.hex }}
                  title={color.name}
                  whileHover={{ scale: 1.2 }}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.3 + idx * 0.05 }}
                />
              ))}
              {product.colors.length > 4 && (
                <span className="text-xs text-gray-500 ml-1 font-medium">
                  +{product.colors.length - 4} more
                </span>
              )}
            </motion.div>
          )}
        </motion.div>
      </Link>
    </motion.div>
  );
}
