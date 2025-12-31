/**
 * Admin Dashboard Page
 * =====================
 * Professional overview with stats and quick actions
 */

import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Package, FolderTree, Eye, TrendingUp, Plus, Settings as SettingsIcon, ArrowUpRight, Activity } from 'lucide-react';
import { getAllProducts, getProductStats } from '@/lib/productService';
import { useSettingsStore } from '@/store/settingsStore';
import { Product, DashboardStats } from '@/types';
import ProductImage from '@/components/ProductImage';
import { motion } from 'framer-motion';

export default function AdminDashboard() {
  const { settings } = useSettingsStore();
  const [stats, setStats] = useState<DashboardStats>({
    totalProducts: 0,
    enabledProducts: 0,
    categories: [],
  });
  const [recentProducts, setRecentProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch dashboard data
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        // Fetch stats from API
        const productStats = await getProductStats();
        setStats(productStats);

        // Get recent products
        const products = await getAllProducts();
        setRecentProducts(products.slice(0, 5));
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const statCards = [
    {
      title: 'Total Products',
      value: stats.totalProducts,
      icon: Package,
      color: 'from-blue-500 to-blue-600',
      bgColor: 'bg-blue-50',
      textColor: 'text-blue-600',
      link: '/admin/products',
    },
    {
      title: 'Enabled Products',
      value: stats.enabledProducts,
      icon: Eye,
      color: 'from-green-500 to-green-600',
      bgColor: 'bg-green-50',
      textColor: 'text-green-600',
      link: '/admin/products',
    },
    {
      title: 'Categories',
      value: stats.categories.length,
      icon: FolderTree,
      color: 'from-purple-500 to-purple-600',
      bgColor: 'bg-purple-50',
      textColor: 'text-purple-600',
      link: '/admin/categories',
    },
    {
      title: 'Activity',
      value: 'Live',
      icon: Activity,
      color: 'from-orange-500 to-orange-600',
      bgColor: 'bg-orange-50',
      textColor: 'text-orange-600',
      link: '/admin',
    },
  ];

  return (
    <div>
      {/* Header */}
      <motion.div 
        className="mb-8"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
          Dashboard
        </h1>
        <p className="text-gray-600 mt-2 flex items-center gap-2">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
          Welcome to your admin panel
        </p>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {statCards.map((stat, index) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Link
              to={stat.link}
              className="bg-white rounded-2xl shadow-sm p-6 hover:shadow-xl transition-all duration-300 border border-gray-100 group block relative overflow-hidden"
            >
              <div className={`absolute inset-0 bg-gradient-to-br ${stat.color} opacity-0 group-hover:opacity-5 transition-opacity duration-300`} />
              <div className="flex items-center gap-4 relative z-10">
                <div className={`${stat.bgColor} p-4 rounded-xl group-hover:scale-110 transition-transform duration-300`}>
                  <stat.icon className={`h-7 w-7 ${stat.textColor}`} />
                </div>
                <div className="flex-1">
                  <p className="text-sm text-gray-600 font-medium">{stat.title}</p>
                  <p className="text-3xl font-bold text-gray-900 mt-1">
                    {isLoading ? (
                      <span className="inline-block w-16 h-8 bg-gray-200 animate-pulse rounded" />
                    ) : (
                      stat.value
                    )}
                  </p>
                </div>
                <ArrowUpRight className="h-5 w-5 text-gray-400 group-hover:text-primary-600 group-hover:translate-x-1 group-hover:-translate-y-1 transition-all" />
              </div>
            </Link>
          </motion.div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Quick Actions Card */}
        <motion.div 
          className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
        >
          <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
            <TrendingUp className="h-6 w-6 text-primary-600" />
            Quick Actions
          </h2>
          <div className="space-y-3">
            <Link
              to="/admin/products"
              className="flex items-center gap-3 p-4 bg-gradient-to-r from-primary-50 to-primary-100 rounded-xl hover:from-primary-100 hover:to-primary-200 transition-all duration-300 group"
            >
              <div className="p-2 bg-white rounded-lg shadow-sm group-hover:scale-110 transition-transform">
                <Plus className="h-5 w-5 text-primary-600" />
              </div>
              <span className="text-primary-700 font-semibold flex-1">Add New Product</span>
              <ArrowUpRight className="h-5 w-5 text-primary-600 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
            </Link>
            <Link
              to="/admin/categories"
              className="flex items-center gap-3 p-4 bg-gradient-to-r from-purple-50 to-purple-100 rounded-xl hover:from-purple-100 hover:to-purple-200 transition-all duration-300 group"
            >
              <div className="p-2 bg-white rounded-lg shadow-sm group-hover:scale-110 transition-transform">
                <FolderTree className="h-5 w-5 text-purple-600" />
              </div>
              <span className="text-purple-700 font-semibold flex-1">Manage Categories</span>
              <ArrowUpRight className="h-5 w-5 text-purple-600 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
            </Link>
            <Link
              to="/admin/settings"
              className="flex items-center gap-3 p-4 bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl hover:from-gray-100 hover:to-gray-200 transition-all duration-300 group"
            >
              <div className="p-2 bg-white rounded-lg shadow-sm group-hover:scale-110 transition-transform">
                <SettingsIcon className="h-5 w-5 text-gray-600" />
              </div>
              <span className="text-gray-700 font-semibold flex-1">Site Settings</span>
              <ArrowUpRight className="h-5 w-5 text-gray-600 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
            </Link>
          </div>
        </motion.div>

        {/* Site Status Card */}
        <motion.div 
          className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5 }}
        >
          <h2 className="text-xl font-bold text-gray-900 mb-6">
            Site Status
          </h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
              <span className="text-gray-700 font-medium">Homepage</span>
              <span
                className={`px-4 py-2 rounded-lg text-sm font-bold shadow-sm ${
                  settings.homepageEnabled
                    ? 'bg-green-500 text-white'
                    : 'bg-red-500 text-white'
                }`}
              >
                {settings.homepageEnabled ? '● Enabled' : '○ Disabled'}
              </span>
            </div>
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
              <span className="text-gray-700 font-medium">Products Page</span>
              <span
                className={`px-4 py-2 rounded-lg text-sm font-bold shadow-sm ${
                  settings.productsPageEnabled
                    ? 'bg-green-500 text-white'
                    : 'bg-red-500 text-white'
                }`}
              >
                {settings.productsPageEnabled ? '● Enabled' : '○ Disabled'}
              </span>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Recent Products */}
      <motion.div 
        className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
      >
        <div className="p-6 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-white">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-gray-900">
              Recent Products
            </h2>
            <Link
              to="/admin/products"
              className="text-sm text-primary-600 hover:text-primary-700 font-semibold flex items-center gap-1 group"
            >
              View All
              <ArrowUpRight className="h-4 w-4 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
            </Link>
          </div>
        </div>
        <div className="divide-y divide-gray-100">
          {isLoading ? (
            <div className="p-8 text-center text-gray-500">
              <div className="inline-block w-8 h-8 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin" />
            </div>
          ) : recentProducts.length > 0 ? (
            recentProducts.map((product, index) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.7 + index * 0.1 }}
                className="p-5 flex items-center gap-4 hover:bg-gray-50 transition-colors group"
              >
                <div className="relative">
                  <ProductImage
                    src={product.imageData}
                    alt={product.name}
                    className="h-16 w-16 rounded-xl object-cover shadow-sm ring-2 ring-gray-100 group-hover:ring-primary-200 transition-all"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-gray-900 truncate group-hover:text-primary-600 transition-colors">
                    {product.name}
                  </p>
                  <p className="text-sm text-gray-500 capitalize mt-1 flex items-center gap-2">
                    <FolderTree className="h-3 w-3" />
                    {product.category}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-gray-900 text-lg">
                    ₹{product.finalPrice.toLocaleString()}
                  </p>
                  <span
                    className={`inline-block mt-1 text-xs px-3 py-1 rounded-full font-semibold ${
                      product.enabled
                        ? 'bg-green-100 text-green-700'
                        : 'bg-red-100 text-red-700'
                    }`}
                  >
                    {product.enabled ? '● Enabled' : '○ Disabled'}
                  </span>
                </div>
              </motion.div>
            ))
          ) : (
            <div className="p-8 text-center text-gray-500">
              <Package className="h-12 w-12 mx-auto text-gray-300 mb-3" />
              <p className="font-medium">No products yet.</p>
              <Link
                to="/admin/products"
                className="text-primary-600 hover:underline font-semibold mt-2 inline-block"
              >
                Add your first product →
              </Link>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
}
