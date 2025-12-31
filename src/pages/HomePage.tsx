/**
 * Home Page
 * ==========
 * Professional landing page with hero section and featured products
 */

import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles, TrendingUp} from 'lucide-react';
import { motion } from 'framer-motion';
import { gsap } from 'gsap';
import { getEnabledProducts } from '@/lib/productService';
import { getEnabledCategories } from '@/lib/categoryService';
import { useSettingsStore } from '@/store/settingsStore';
import { Product, Category } from '@/types';
import ProductCard from '@/components/ProductCard';
import LoadingSpinner from '@/components/LoadingSpinner';


const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

// Color themes for categories
const getCategoryTheme = (index: number) => {
  const themes = [
    { gradient: 'from-slate-900 via-slate-800 to-slate-900', badge: 'text-primary-400', overlay: 'bg-primary-600/20' },
    { gradient: 'from-pink-900 via-rose-800 to-pink-900', badge: 'text-pink-400', overlay: 'bg-pink-500/20' },
    { gradient: 'from-amber-900 via-orange-800 to-amber-900', badge: 'text-amber-400', overlay: 'bg-amber-500/20' },
    { gradient: 'from-emerald-900 via-green-800 to-emerald-900', badge: 'text-emerald-400', overlay: 'bg-emerald-500/20' },
    { gradient: 'from-blue-900 via-indigo-800 to-blue-900', badge: 'text-blue-400', overlay: 'bg-blue-500/20' },
    { gradient: 'from-purple-900 via-violet-800 to-purple-900', badge: 'text-purple-400', overlay: 'bg-purple-500/20' },
  ];
  return themes[index % themes.length];
};

export default function HomePage() {
  const heroRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);
  
  const { settings } = useSettingsStore();
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch featured products and categories
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const [products, cats] = await Promise.all([
          getEnabledProducts(),
          getEnabledCategories()
        ]);
        setFeaturedProducts(products.slice(0, 8));
        setCategories(cats);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  // GSAP Hero Animation
  useEffect(() => {
    if (!heroRef.current) return;

    const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

    tl.fromTo(
      titleRef.current,
      { opacity: 0, y: 60, scale: 0.95 },
      { opacity: 1, y: 0, scale: 1, duration: 1.2 }
    )
      .fromTo(
        subtitleRef.current,
        { opacity: 0, y: 40 },
        { opacity: 1, y: 0, duration: 0.8 },
        '-=0.6'
      )
      .fromTo(
        ctaRef.current,
        { opacity: 0, y: 30, scale: 0.9 },
        { opacity: 1, y: 0, scale: 1, duration: 0.6 },
        '-=0.4'
      );
  }, []);

  // Check if homepage is disabled
  if (!settings.homepageEnabled) {
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
            Our homepage is currently under maintenance. Please check back later.
          </p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="overflow-hidden">
      {/* Hero Section */}
      <section
        ref={heroRef}
        className="relative min-h-[90vh] flex items-center bg-gradient-to-br from-slate-50 via-white to-primary-50 overflow-hidden"
      >
        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-96 h-96 bg-primary-200/30 rounded-full blur-3xl animate-float" />
          <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-pink-200/30 rounded-full blur-3xl animate-float" style={{ animationDelay: '1s' }} />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-to-r from-primary-100/20 to-pink-100/20 rounded-full blur-3xl" />
        </div>

        {/* Hero Pattern */}
        <div className="absolute inset-0 hero-pattern opacity-50" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 py-20">
          <div className="text-center">
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center gap-2 bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full shadow-lg mb-8"
            >
              <Sparkles className="h-4 w-4 text-primary-600" />
              <span className="text-sm font-medium text-gray-700">New Collection 2026</span>
            </motion.div>

            <h1
              ref={titleRef}
              className="text-5xl md:text-7xl lg:text-8xl font-bold mb-8 leading-tight"
            >
              <span className="text-gray-900">Welcome to</span>
              <br />
              <span className="gradient-text">{settings.siteName}</span>
            </h1>
            
            <p
              ref={subtitleRef}
              className="text-xl md:text-2xl text-gray-600 mb-12 max-w-3xl mx-auto leading-relaxed"
            >
              {settings.siteDescription}. Discover premium fabrics and timeless designs 
              that elevate your style.
            </p>
            
            <div ref={ctaRef} className="flex gap-4 justify-center flex-wrap">
              {categories.length > 0 ? (
                <>
                  {categories.slice(0, 2).map((cat, index) => (
                    <Link 
                      key={cat.id}
                      to={`/products?category=${cat.slug}`} 
                      className={index === 0 ? "btn-primary text-lg" : "btn-secondary text-lg"}
                    >
                      Shop {cat.name} {index === 0 ? <ArrowRight className="h-5 w-5" /> : <Sparkles className="h-5 w-5" />}
                    </Link>
                  ))}
                </>
              ) : (
                <Link to="/products" className="btn-primary text-lg">
                  Shop Now <ArrowRight className="h-5 w-5" />
                </Link>
              )}
            </div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <motion.div 
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <div className="w-6 h-10 border-2 border-gray-400 rounded-full flex justify-center pt-2">
            <div className="w-1.5 h-3 bg-gray-400 rounded-full" />
          </div>
        </motion.div>
      </section>

      {/* Featured Products */}
      <section className="py-20 bg-gradient-to-b from-white to-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <span className="inline-flex items-center gap-2 text-primary-600 font-medium mb-4">
              <TrendingUp className="h-5 w-5" />
              Trending Now
            </span>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Featured Products
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Handpicked selections curated just for you
            </p>
          </motion.div>

          {isLoading ? (
            <div className="flex justify-center py-12">
              <LoadingSpinner message="Loading products..." />
            </div>
          ) : featuredProducts.length > 0 ? (
            <motion.div 
              className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 md:gap-8"
              variants={staggerContainer}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-50px" }}
            >
              {featuredProducts.map((product, index) => (
                <ProductCard key={product.id} product={product} index={index} />
              ))}
            </motion.div>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-500">No products available</p>
            </div>
          )}

          <motion.div 
            className="text-center mt-16"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
          >
            <Link
              to="/products"
              className="btn-primary"
            >
              View All Products <ArrowRight className="h-5 w-5" />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Collections Banner */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            className="text-center mb-12"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Shop by Collection
            </h2>
            <p className="text-gray-600">Explore our curated collections</p>
          </motion.div>

          {categories.length > 0 ? (
            <div className={`grid grid-cols-1 ${categories.length === 1 ? '' : categories.length === 2 ? 'md:grid-cols-2' : 'md:grid-cols-3'} gap-8`}>
              {categories.map((category, index) => {
                const theme = getCategoryTheme(index);
                return (
                  <motion.div
                    key={category.id}
                    initial={{ opacity: 0, y: 50 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                  >
                    <Link
                      to={`/products?category=${category.slug}`}
                      className="group relative h-[500px] rounded-3xl overflow-hidden block shadow-2xl"
                    >
                      <div className={`absolute inset-0 bg-gradient-to-br ${theme.gradient}`} />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent z-10" />
                      
                      {/* Animated Overlay */}
                      <div className={`absolute inset-0 ${theme.overlay} opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-10`} />
                      
                      {/* Content */}
                      <div className="absolute bottom-0 left-0 right-0 p-8 z-20">
                        <motion.div
                          initial={{ y: 20 }}
                          whileHover={{ y: 0 }}
                          className="transform group-hover:-translate-y-2 transition-transform duration-500"
                        >
                          <span className={`${theme.badge} font-medium mb-2 block`}>
                            {category.description || 'Discover More'}
                          </span>
                          <h3 className="text-4xl font-bold text-white mb-3">
                            {category.name}
                          </h3>
                          <p className="text-white/80 mb-6">
                            Explore our {category.name.toLowerCase()} collection
                          </p>
                          <span className="inline-flex items-center gap-2 text-white font-semibold group-hover:gap-4 transition-all">
                            Shop Now <ArrowRight className="h-5 w-5" />
                          </span>
                        </motion.div>
                      </div>
                    </Link>
                  </motion.div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-500">No categories available</p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
