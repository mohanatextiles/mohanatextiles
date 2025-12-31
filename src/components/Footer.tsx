/**
 * Footer Component
 * =================
 * Professional site footer with links and info
 */

import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { MapPin, Phone, Mail } from 'lucide-react';
import { useSettingsStore } from '@/store/settingsStore';
import { useEffect, useState } from 'react';
import { getEnabledCategories } from '@/lib/categoryService';
import { Category } from '@/types';

export default function Footer() {
  const { settings } = useSettingsStore();
  const currentYear = new Date().getFullYear();
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    const fetchCategories = async () => {
      const cats = await getEnabledCategories();
      setCategories(cats);
    };
    fetchCategories();
  }, []);

  return (
    <footer className="bg-gradient-to-b from-gray-900 to-gray-950 text-white">
      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 lg:gap-16">
          {/* Brand */}
          <div>
            <motion.h3 
              className="text-3xl font-bold gradient-text mb-4"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
            >
              {settings.siteName}
            </motion.h3>
            <p className="text-gray-400 mb-6 leading-relaxed">
              {settings.siteDescription}. Premium quality textiles for the modern lifestyle.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold mb-6 text-white">Quick Links</h4>
            <ul className="space-y-3">
              <motion.li 
                whileHover={{ x: 4 }}
                transition={{ duration: 0.2 }}
              >
                <Link
                  to="/"
                  className="text-gray-400 hover:text-primary-400 transition-colors inline-flex items-center gap-2"
                >
                  <span className="h-1 w-1 bg-primary-500 rounded-full opacity-0 group-hover:opacity-100" />
                  Home
                </Link>
              </motion.li>
              <motion.li 
                whileHover={{ x: 4 }}
                transition={{ duration: 0.2 }}
              >
                <Link
                  to="/products"
                  className="text-gray-400 hover:text-primary-400 transition-colors inline-flex items-center gap-2"
                >
                  <span className="h-1 w-1 bg-primary-500 rounded-full opacity-0 group-hover:opacity-100" />
                  All Products
                </Link>
              </motion.li>
              {categories.map((category) => (
                <motion.li 
                  key={category.id}
                  whileHover={{ x: 4 }}
                  transition={{ duration: 0.2 }}
                >
                  <Link
                    to={`/products?category=${category.slug}`}
                    className="text-gray-400 hover:text-primary-400 transition-colors inline-flex items-center gap-2"
                  >
                    <span className="h-1 w-1 bg-primary-500 rounded-full opacity-0 group-hover:opacity-100" />
                    {category.name}
                  </Link>
                </motion.li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-lg font-semibold mb-6 text-white">Contact Us</h4>
            <ul className="space-y-4">
              <li className="flex items-start gap-3 text-gray-400">
                <MapPin className="h-5 w-5 text-primary-500 flex-shrink-0 mt-0.5" />
                <span className="text-sm">1/207E, Thiyagi Kumaran Colony, 3rd Street Anna Nagar, Tiruppur</span>
              </li>
              <li className="flex items-center gap-3 text-gray-400">
                <Phone className="h-5 w-5 text-primary-500 flex-shrink-0" />
                <a href="tel:+919976964703" className="hover:text-primary-400 transition-colors">
                  +91 99769 64703
                </a>
              </li>
              <li className="flex items-center gap-3 text-gray-400">
                <Mail className="h-5 w-5 text-primary-500 flex-shrink-0" />
                <a href="mailto:mohanatextiles2020@gmail.com" className="hover:text-primary-400 transition-colors text-sm">
                  mohanatextiles2020@gmail.com
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-gray-500 text-sm">
              © {currentYear} {settings.siteName}. All rights reserved.
            </p>
            <div className="flex items-center gap-6">
              <a href="#" className="text-gray-500 hover:text-gray-400 text-sm transition-colors">
                Privacy Policy
              </a>
              <a href="#" className="text-gray-500 hover:text-gray-400 text-sm transition-colors">
                Terms of Service
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
