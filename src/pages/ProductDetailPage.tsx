/**
 * Product Detail Page
 * ====================
 * Single product view with full details (No cart functionality)
 */

import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Package} from 'lucide-react';
// import {Check} from 'lucide-react';
import { getProductById } from '@/lib/productService';
import { Product /*, ColorVariant*/ } from '@/types';
import { formatPrice, getEmbeddableImageUrl } from '@/lib/utils';
import LoadingSpinner from '@/components/LoadingSpinner';

export default function ProductDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [product, setProduct] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedSize, setSelectedSize] = useState<string>('');
  // const [selectedColor, setSelectedColor] = useState<ColorVariant | null>(null);

  // Fetch product
  useEffect(() => {
    const fetchProduct = async () => {
      if (!id) return;
      setIsLoading(true);
      try {
        const prod = await getProductById(id);
        if (prod && prod.enabled) {
          setProduct(prod);
          // Set defaults
          if (prod.sizes && prod.sizes.length > 0) {
            setSelectedSize(prod.sizes[0]);
          }
          // if (prod.colors && prod.colors.length > 0) {
          //   setSelectedColor(prod.colors[0]);
          // }
        } else {
          setProduct(null);
        }
      } catch (error) {
        console.error('Error fetching product:', error);
        setProduct(null);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  if (isLoading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <LoadingSpinner message="Loading product..." />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            Product Not Found
          </h1>
          <p className="text-gray-600 mb-6">
            The product you're looking for doesn't exist or has been removed.
          </p>
          <button
            onClick={() => navigate('/products')}
            className="text-primary-600 hover:text-primary-700 font-medium flex items-center gap-2 mx-auto"
          >
            <ArrowLeft className="h-5 w-5" />
            Back to Products
          </button>
        </div>
      </div>
    );
  }

  const hasDiscount = product.discount > 0;

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6 transition-colors"
        >
          <ArrowLeft className="h-5 w-5" />
          <span className="font-medium">Back</span>
        </button>

        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-0">
            {/* Product Image - Takes 2 columns */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="relative lg:col-span-2 bg-gradient-to-br from-gray-50 to-gray-100"
            >
              <div className="sticky top-24 p-8">
                <div className="relative aspect-[3/4] bg-white rounded-xl shadow-inner overflow-hidden">
                  <img
                    src={getEmbeddableImageUrl(product.imageData)}
                    alt={product.name}
                    className="w-full h-full object-contain p-4"
                    onError={(e) => {
                      e.currentTarget.src = '/placeholder.jpg';
                    }}
                  />

                  {/* Discount Badge */}
                  {hasDiscount && (
                    <div className="absolute top-4 right-4">
                      <span className="bg-gradient-to-r from-red-500 to-red-600 text-white px-4 py-2 rounded-full text-sm font-bold shadow-lg">
                        -{product.discount}% OFF
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>

            {/* Product Details - Takes 3 columns */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="lg:col-span-3 p-8 lg:p-12"
            >
              {/* Category Badge */}
              <div className="inline-flex items-center gap-2 bg-primary-50 text-primary-700 px-4 py-2 rounded-full text-sm font-semibold uppercase tracking-wide mb-4">
                <Package className="h-4 w-4" />
                {product.category}
              </div>

              {/* Title */}
              <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 leading-tight mb-6">
                {product.name}
              </h1>

              {/* Price Section */}
              <div className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl p-6 mb-8">
                <div className="flex items-baseline gap-4 flex-wrap">
                  <span className="text-5xl font-bold text-gray-900">
                    {formatPrice(product.finalPrice)}
                  </span>
                  {hasDiscount && (
                    <>
                      <span className="text-2xl text-gray-500 line-through">
                        {formatPrice(product.price)}
                      </span>
                      <span className="bg-gradient-to-r from-red-500 to-red-600 text-white px-4 py-2 rounded-full text-base font-bold shadow-md">
                        Save {formatPrice(product.price - product.finalPrice)}
                      </span>
                    </>
                  )}
                </div>
              </div>

              {/* Description */}
              <div className="mb-8">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Product Description</h3>
                <p className="text-gray-600 leading-relaxed whitespace-pre-line text-base">
                  {product.description}
                </p>
              </div>

              {/* Size Selection */}
              {product.sizes && product.sizes.length > 0 && (
                <div className="mb-8 pb-8 border-b border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    Select Size
                  </h3>
                  <div className="flex flex-wrap gap-3">
                    {product.sizes.map((size) => (
                      <button
                        key={size}
                        onClick={() => setSelectedSize(size)}
                        className={`px-6 py-3 border-2 rounded-xl text-base font-semibold transition-all ${
                          selectedSize === size
                            ? 'border-primary-600 bg-primary-600 text-white shadow-lg scale-105'
                            : 'border-gray-300 text-gray-700 hover:border-primary-400 hover:shadow-md'
                        }`}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Color Selection - Temporarily Disabled */}
              {/* Color selection feature is commented out for now
              {product.colors && product.colors.length > 0 && (
                <div className="mb-8 pb-8 border-b border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    Select Color
                  </h3>
                  <p className="text-sm text-gray-600 mb-4">
                    Selected: <span className="font-semibold text-gray-900">{selectedColor?.name}</span>
                  </p>
                  <div className="flex flex-wrap gap-3">
                    {product.colors.map((color) => (
                      <button
                        key={color.hex}
                        onClick={() => setSelectedColor(color)}
                        className={`relative h-14 w-14 rounded-full border-4 transition-all shadow-md hover:shadow-lg hover:scale-110 ${
                          selectedColor?.hex === color.hex
                            ? 'border-primary-600 scale-110 ring-4 ring-primary-200'
                            : 'border-gray-300'
                        }`}
                        style={{ backgroundColor: color.hex }}
                        title={color.name}
                      >
                        {selectedColor?.hex === color.hex && (
                          <Check
                            className={`absolute inset-0 m-auto h-6 w-6 drop-shadow-lg ${
                              color.hex === '#FFFFFF' || color.hex === '#ffffff'
                                ? 'text-gray-900'
                                : 'text-white'
                            }`}
                          />
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              )}
              */}
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
