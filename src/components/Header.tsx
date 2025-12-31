/**
 * Header Component
 * =================
 * Professional navigation header with animations
 */

import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSettingsStore } from '@/store/settingsStore';
import { getEnabledCategories } from '@/lib/categoryService';
import { Category } from '@/types';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const location = useLocation();
  const { settings } = useSettingsStore();

  // Fetch categories
  useEffect(() => {
    const fetchCategories = async () => {
      const cats = await getEnabledCategories();
      setCategories(cats);
    };
    fetchCategories();
  }, []);

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Build nav links dynamically
  const navLinks = [
    { name: 'Home', href: '/' },
    { name: 'Products', href: '/products' },
    ...categories.map(cat => ({
      name: cat.name,
      href: `/products?category=${cat.slug}`
    }))
  ];

  return (
    <motion.header 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled 
          ? 'bg-white/95 backdrop-blur-md shadow-lg' 
          : 'bg-white/80 backdrop-blur-sm'
      }`}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <motion.span 
              className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-primary-600 to-primary-800 bg-clip-text text-transparent"
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.2 }}
            >
              {settings.siteName}
            </motion.span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => {
              const isActive = location.pathname === link.href || 
                (link.href !== '/' && location.pathname.startsWith(link.href.split('?')[0]));
              
              return (
                <Link
                  key={link.name}
                  to={link.href}
                  className="relative px-4 py-2 group"
                >
                  <span className={`text-sm font-medium transition-colors duration-200 ${
                    isActive ? 'text-primary-600' : 'text-gray-700 group-hover:text-primary-600'
                  }`}>
                    {link.name}
                  </span>
                  {/* Animated underline */}
                  <motion.span 
                    className="absolute bottom-0 left-4 right-4 h-0.5 bg-primary-600 rounded-full"
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: isActive ? 1 : 0 }}
                    whileHover={{ scaleX: 1 }}
                    transition={{ duration: 0.2 }}
                  />
                </Link>
              );
            })}
          </nav>

          {/* Right Side Actions */}
          <div className="flex items-center gap-2">
            {/* Mobile Menu Button */}
            <motion.button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-3 text-gray-600 hover:text-primary-600 hover:bg-primary-50 rounded-full transition-colors"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {isMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </motion.button>
          </div>
        </div>

        {/* Mobile Navigation */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="md:hidden overflow-hidden"
            >
              <nav className="py-4 border-t border-gray-100">
                {navLinks.map((link, idx) => {
                  const isActive = location.pathname === link.href;
                  
                  return (
                    <motion.div
                      key={link.name}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.1 }}
                    >
                      <Link
                        to={link.href}
                        onClick={() => setIsMenuOpen(false)}
                        className={`block py-3 px-4 rounded-lg font-medium transition-colors ${
                          isActive 
                            ? 'text-primary-600 bg-primary-50' 
                            : 'text-gray-700 hover:text-primary-600 hover:bg-gray-50'
                        }`}
                      >
                        {link.name}
                      </Link>
                    </motion.div>
                  );
                })}
              </nav>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.header>
  );
}
