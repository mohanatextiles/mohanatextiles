/**
 * Products Page
 * ==============
 * Professional product listing with category filtering
 */

import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Filter, SlidersHorizontal, Grid3X3, LayoutGrid, X } from 'lucide-react';
import { getEnabledProducts, getProductsByCategory, getCategories } from '@/lib/productService';
import { useSettingsStore } from '@/store/settingsStore';
import { Product, Category } from '@/types';
import ProductCard from '@/components/ProductCard';
import LoadingSpinner from '@/components/LoadingSpinner';

export default function ProductsPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const { settings } = useSettingsStore();
  
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);
  const [gridCols, setGridCols] = useState<3 | 4>(4);

  const currentCategory = searchParams.get('category') || 'all';

  // Fetch categories
  useEffect(() => {
    const fetchCategories = async () => {
      const cats = await getCategories();
      setCategories(cats);
    };
    fetchCategories();
  }, []);

  // Fetch products based on category
  useEffect(() => {
    const fetchProducts = async () => {
      setIsLoading(true);
      try {
        let prods: Product[];
        if (currentCategory && currentCategory !== 'all') {
          prods = await getProductsByCategory(currentCategory);
        } else {
          prods = await getEnabledProducts();
        }
        setProducts(prods);
      } catch (error) {
        console.error('Error fetching products:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, [currentCategory]);

  // Handle category change
  const handleCategoryChange = (category: string) => {
    if (category === 'all') {
      searchParams.delete('category');
    } else {
      searchParams.set('category', category);
    }
    setSearchParams(searchParams);
  };

  // Check if products page is disabled
  if (!settings.productsPageEnabled) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <motion.div 
          className="text-center"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            Coming Soon
          </h1>
          <p className="text-gray-600">
            Our products page is currently under maintenance. Please check back later.
          </p>
        </motion.div>
      </div>
    );
  }

  // Predefined categories
  const defaultCategories = [
    { id: 'all', name: 'All Products', slug: 'all' },
    { id: 'mens', name: "Men's", slug: 'mens' },
    { id: 'womens', name: "Women's", slug: 'womens' },
    { id: 'accessories', name: 'Accessories', slug: 'accessories' },
  ];

  const displayCategories = categories.length > 0
    ? [{ id: 'all', name: 'All Products', slug: 'all', enabled: true } as unknown as Category, ...categories]
    : defaultCategories;

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Hero Header */}
      <motion.div 
        className="relative bg-gradient-to-br from-primary-600 via-primary-700 to-primary-800 overflow-hidden"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        {/* Background Pattern */}
        <div className="absolute inset-0 hero-pattern opacity-10" />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 relative z-10">
          <motion.h1 
            className="text-4xl md:text-5xl font-bold text-white mb-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            {currentCategory === 'all'
              ? 'All Products'
              : currentCategory.charAt(0).toUpperCase() + currentCategory.slice(1) + ' Collection'}
          </motion.h1>
          <motion.p 
            className="text-lg text-white/80 max-w-2xl"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            Discover our curated collection of premium quality textiles crafted for elegance and comfort
          </motion.p>
        </div>
      </motion.div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Filter Bar */}
        <motion.div 
          className="flex flex-wrap items-center justify-between gap-4 mb-8 bg-white rounded-2xl shadow-sm p-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          {/* Category Pills - Desktop */}
          <div className="hidden lg:flex items-center gap-2 overflow-x-auto pb-1">
            {displayCategories.map((cat, idx) => (
              <motion.button
                key={cat.id}
                onClick={() => handleCategoryChange(cat.slug)}
                className={`px-5 py-2.5 rounded-full text-sm font-medium whitespace-nowrap transition-all duration-300 ${
                  currentCategory === cat.slug || (currentCategory === 'all' && cat.slug === 'all')
                    ? 'bg-primary-600 text-white shadow-lg shadow-primary-500/30'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.1 * idx }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                {cat.name}
              </motion.button>
            ))}
          </div>

          {/* Mobile Filter Button */}
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="lg:hidden flex items-center gap-2 px-4 py-2.5 bg-gray-100 rounded-full text-sm font-medium text-gray-700"
          >
            <SlidersHorizontal className="h-4 w-4" />
            Filters
          </button>

          {/* Grid Toggle & Count */}
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-500">
              {products.length} product{products.length !== 1 ? 's' : ''}
            </span>
            <div className="hidden md:flex items-center gap-1 bg-gray-100 rounded-lg p-1">
              <button
                onClick={() => setGridCols(3)}
                className={`p-2 rounded-md transition-colors ${
                  gridCols === 3 ? 'bg-white shadow-sm' : 'hover:bg-gray-200'
                }`}
              >
                <Grid3X3 className="h-4 w-4 text-gray-600" />
              </button>
              <button
                onClick={() => setGridCols(4)}
                className={`p-2 rounded-md transition-colors ${
                  gridCols === 4 ? 'bg-white shadow-sm' : 'hover:bg-gray-200'
                }`}
              >
                <LayoutGrid className="h-4 w-4 text-gray-600" />
              </button>
            </div>
          </div>
        </motion.div>

        {/* Mobile Filters Overlay */}
        <AnimatePresence>
          {showFilters && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 z-50 lg:hidden"
              onClick={() => setShowFilters(false)}
            >
              <motion.div
                initial={{ x: '-100%' }}
                animate={{ x: 0 }}
                exit={{ x: '-100%' }}
                transition={{ type: 'spring', damping: 25 }}
                className="absolute left-0 top-0 bottom-0 w-80 bg-white shadow-2xl p-6"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold flex items-center gap-2">
                    <Filter className="h-5 w-5" />
                    Categories
                  </h3>
                  <button 
                    onClick={() => setShowFilters(false)}
                    className="p-2 hover:bg-gray-100 rounded-full"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>
                <div className="space-y-2">
                  {displayCategories.map((cat) => (
                    <button
                      key={cat.id}
                      onClick={() => {
                        handleCategoryChange(cat.slug);
                        setShowFilters(false);
                      }}
                      className={`w-full text-left px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                        currentCategory === cat.slug || (currentCategory === 'all' && cat.slug === 'all')
                          ? 'bg-primary-100 text-primary-700'
                          : 'text-gray-600 hover:bg-gray-100'
                      }`}
                    >
                      {cat.name}
                    </button>
                  ))}
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Products Grid */}
        <main>
          {isLoading ? (
            <div className="flex justify-center py-20">
              <LoadingSpinner message="Loading products..." />
            </div>
          ) : products.length > 0 ? (
            <motion.div 
              className={`grid gap-6 ${
                gridCols === 4 
                  ? 'grid-cols-2 md:grid-cols-3 lg:grid-cols-4' 
                  : 'grid-cols-2 md:grid-cols-3'
              }`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              {products.map((product, index) => (
                <ProductCard key={product.id} product={product} index={index} />
              ))}
            </motion.div>
          ) : (
            <motion.div 
              className="text-center py-20 bg-white rounded-2xl shadow-sm"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
            >
              <div className="text-6xl mb-4">🛍️</div>
              <p className="text-gray-500 text-lg mb-4">
                No products found in this category
              </p>
              <button
                onClick={() => handleCategoryChange('all')}
                className="btn-primary"
              >
                View all products
              </button>
            </motion.div>
          )}
        </main>
      </div>
    </div>
  );
}
