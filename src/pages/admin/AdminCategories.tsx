/**
 * Admin Categories Page
 * ======================
 * Manage product categories
 */

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Trash2, X, FolderTree } from 'lucide-react';
import toast from 'react-hot-toast';
import {
  getAllCategories,
  createCategory,
  deleteCategory,
  seedCategories as seedDefaultCategories,
} from '@/lib/productService';
import { Category } from '@/types';
import { slugify, formatDate } from '@/lib/utils';

export default function AdminCategories() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [newCategoryDescription, setNewCategoryDescription] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fetch categories
  useEffect(() => {
    const fetchCategories = async () => {
      setIsLoading(true);
      try {
        const cats = await getAllCategories();
        setCategories(cats);
      } catch (error) {
        console.error('Error fetching categories:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCategories();
  }, []);

  // Handle create category
  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!newCategoryName.trim()) {
      toast.error('Please enter a category name');
      return;
    }

    setIsSubmitting(true);

    try {
      const slug = slugify(newCategoryName);
      const id = await createCategory(
        newCategoryName,
        slug,
        newCategoryDescription
      );

      if (id) {
        toast.success('Category created');
        // Refresh categories
        const cats = await getAllCategories();
        setCategories(cats);
        setIsModalOpen(false);
        setNewCategoryName('');
        setNewCategoryDescription('');
      } else {
        toast.error('Failed to create category');
      }
    } catch (error) {
      toast.error('An error occurred');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle delete category
  const handleDelete = async (category: Category) => {
    if (
      !confirm(
        `Are you sure you want to delete "${category.name}"? Products in this category will not be deleted.`
      )
    ) {
      return;
    }

    const success = await deleteCategory(category.id);
    if (success) {
      toast.success('Category deleted');
      setCategories(categories.filter((c) => c.id !== category.id));
    } else {
      toast.error('Failed to delete category');
    }
  };

  // Seed default categories via API
  const seedCategories = async () => {
    setIsSubmitting(true);
    try {
      const cats = await seedDefaultCategories();
      setCategories(cats);
      toast.success('Default categories created');
    } catch (error) {
      toast.error('Failed to seed categories');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Categories</h1>
          <p className="text-gray-600 mt-1">
            Manage product categories ({categories.length} categories)
          </p>
        </div>
        <div className="flex gap-2">
          {categories.length === 0 && (
            <button
              onClick={seedCategories}
              disabled={isSubmitting}
              className="flex items-center gap-2 bg-gray-600 text-white px-4 py-2 rounded-md hover:bg-gray-700 transition-colors disabled:opacity-50"
            >
              <FolderTree className="h-5 w-5" />
              Seed Defaults
            </button>
          )}
          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 bg-primary-600 text-white px-4 py-2 rounded-md hover:bg-primary-700 transition-colors"
          >
            <Plus className="h-5 w-5" />
            Add Category
          </button>
        </div>
      </div>

      {/* Categories Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {isLoading ? (
          <div className="col-span-full text-center py-12 text-gray-500">
            Loading categories...
          </div>
        ) : categories.length === 0 ? (
          <div className="col-span-full bg-white rounded-lg shadow-sm p-12 text-center">
            <FolderTree className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No categories yet
            </h3>
            <p className="text-gray-600 mb-4">
              Create your first category or seed the default ones.
            </p>
          </div>
        ) : (
          categories.map((category) => (
            <motion.div
              key={category.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-lg shadow-sm p-6"
            >
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    {category.name}
                  </h3>
                  <p className="text-sm text-gray-500 mt-1">
                    Slug: {category.slug}
                  </p>
                  {category.description && (
                    <p className="text-sm text-gray-600 mt-2">
                      {category.description}
                    </p>
                  )}
                  <p className="text-xs text-gray-400 mt-3">
                    Created: {formatDate(category.createdAt)}
                  </p>
                </div>
                <button
                  onClick={() => handleDelete(category)}
                  className="p-2 text-red-600 hover:bg-red-50 rounded"
                  title="Delete"
                >
                  <Trash2 className="h-5 w-5" />
                </button>
              </div>
            </motion.div>
          ))
        )}
      </div>

      {/* Add Category Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
            onClick={() => setIsModalOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-lg shadow-xl w-full max-w-md"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal Header */}
              <div className="flex items-center justify-between p-6 border-b">
                <h2 className="text-xl font-bold text-gray-900">
                  Add New Category
                </h2>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="p-2 text-gray-400 hover:text-gray-600 rounded"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* Modal Form */}
              <form onSubmit={handleCreate} className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Category Name *
                  </label>
                  <input
                    type="text"
                    value={newCategoryName}
                    onChange={(e) => setNewCategoryName(e.target.value)}
                    placeholder="e.g., Men's Clothing"
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    required
                  />
                  {newCategoryName && (
                    <p className="text-xs text-gray-500 mt-1">
                      Slug: {slugify(newCategoryName)}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description
                  </label>
                  <textarea
                    value={newCategoryDescription}
                    onChange={(e) => setNewCategoryDescription(e.target.value)}
                    placeholder="Optional description..."
                    rows={3}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  />
                </div>

                <div className="flex gap-4 pt-4">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="flex-1 px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 disabled:opacity-50"
                  >
                    {isSubmitting ? 'Creating...' : 'Create Category'}
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
