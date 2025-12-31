/**
 * Admin Products Page
 * ====================
 * Full CRUD operations for products with image upload
 */

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Plus,
  Edit2,
  Trash2,
  Eye,
  EyeOff,
  X,
  Search,
  Sparkles,
  ExternalLink,
} from 'lucide-react';
import toast from 'react-hot-toast';
import {
  getAllProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  toggleProductEnabled,
} from '@/lib/productService';
import { Product, ProductFormData } from '@/types';
import { formatPrice } from '@/lib/utils';
import { apiRequest } from '@/lib/api';
import { useSettingsStore } from '@/store/settingsStore';
import ProductImage from '@/components/ProductImage';

// Default form values
const defaultFormData: ProductFormData = {
  name: '',
  category: 'mens',
  price: 0,
  discount: 0,
  description: '',
  enabled: true,
  sizes: ['S', 'M', 'L', 'XL'],
  colors: [{ name: 'Black', hex: '#000000' }],
};

export default function AdminProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [categories, setCategories] = useState<string[]>(['mens', 'womens', 'accessories', 'kids']);
  
  // Get settings for Drive folder ID
  const { fetchSettings } = useSettingsStore();

  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [formData, setFormData] = useState<ProductFormData>(defaultFormData);
  const [imagePreview, setImagePreview] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isGeneratingAI, setIsGeneratingAI] = useState(false);

  // Color input states
  const [newColorName, setNewColorName] = useState('');
  const [newColorHex, setNewColorHex] = useState('#000000');
  
  // Size input state
  const [newSize, setNewSize] = useState('');
  
  // Google Drive URL
  const [driveUrl, setDriveUrl] = useState('');
  const [driveFolderUrl, setDriveFolderUrl] = useState('');

  // Fetch config on mount (Drive folder URL)
  useEffect(() => {
    fetchSettings();
    // Fetch Drive folder URL from config
    apiRequest<{ driveFolderUrl: string }>('/api/auth/config')
      .then(data => {
        if (data.driveFolderUrl) {
          setDriveFolderUrl(data.driveFolderUrl);
        }
      })
      .catch(console.error);
  }, [fetchSettings]);

  // Fetch categories
  const fetchCategories = async () => {
    try {
      const response = await apiRequest<any[]>('/api/categories');
      if (response && response.length > 0) {
        setCategories(response.map(cat => cat.slug || cat.name.toLowerCase()));
      }
    } catch (error) {
      console.error('Failed to fetch categories:', error);
    }
  };

  // Fetch products
  const fetchProducts = async () => {
    try {
      const prods = await getAllProducts();
      setProducts(prods);
    } catch (error) {
      console.error('Failed to fetch products:', error);
      toast.error('Failed to load products');
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch products on mount
  useEffect(() => {
    fetchCategories();
    fetchProducts();
  }, []);

  // Filter products based on search
  useEffect(() => {
    if (searchQuery) {
      const filtered = products.filter(
        (p) =>
          p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.category.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredProducts(filtered);
    } else {
      setFilteredProducts(products);
    }
  }, [products, searchQuery]);

  // Open modal for new product
  const handleAddNew = () => {
    setEditingProduct(null);
    setFormData(defaultFormData);
    setImagePreview('');
    setDriveUrl('');
    setIsModalOpen(true);
  };

  // Open modal for editing
  const handleEdit = (product: Product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      category: product.category,
      price: product.price,
      discount: product.discount,
      description: product.description,
      enabled: product.enabled,
      sizes: product.sizes || [],
      colors: product.colors || [],
    });
    setImagePreview(product.imageData || '');
    setDriveUrl(product.imageData || '');
    setIsModalOpen(true);
  };

  // Open Google Drive folder in new tab
  const handleBrowseDrive = () => {
    const folderUrl = driveFolderUrl || 'https://drive.google.com/drive/folders/1ms1u6tuw22Bsl1SsGpR1zXtkR_zsgddx';
    window.open(folderUrl, '_blank');
    toast.success('Drive folder opened! Copy the image link and paste it below.', { duration: 4000 });
  };

  // Extract file ID from various Google Drive URL formats and convert to direct URL
  const extractDriveUrl = (input: string): string => {
    if (!input) return '';
    
    // Already a lh3 googleusercontent URL (best format)
    if (input.includes('lh3.googleusercontent.com')) return input;
    
    // Extract file ID from different formats
    let fileId = '';
    
    // Format: https://drive.google.com/file/d/FILE_ID/view
    const fileMatch = input.match(/\/file\/d\/([a-zA-Z0-9_-]+)/);
    if (fileMatch) fileId = fileMatch[1];
    
    // Format: https://drive.google.com/open?id=FILE_ID
    const openMatch = input.match(/[?&]id=([a-zA-Z0-9_-]+)/);
    if (!fileId && openMatch) fileId = openMatch[1];
    
    // Format: https://drive.google.com/uc?export=view&id=FILE_ID
    const ucMatch = input.match(/uc\?export=view&id=([a-zA-Z0-9_-]+)/);
    if (!fileId && ucMatch) fileId = ucMatch[1];
    
    // Format: Just the file ID
    if (!fileId && /^[a-zA-Z0-9_-]{20,}$/.test(input)) fileId = input;
    
    if (fileId) {
      // Use lh3.googleusercontent.com format - works better for embedding
      return `https://lh3.googleusercontent.com/d/${fileId}`;
    }
    
    return input; // Return as-is if can't parse
  };

  // Generate AI description from image
  const handleGenerateAIDescription = async () => {
    if (!driveUrl) {
      toast.error('Please select an image from Google Drive first');
      return;
    }

    if (!formData.name) {
      toast.error('Please enter product name first');
      return;
    }

    setIsGeneratingAI(true);

    try {
      // Fetch image from Drive URL and convert to blob
      const imageResponse = await fetch(driveUrl);
      const blob = await imageResponse.blob();
      
      const formDataToSend = new FormData();
      formDataToSend.append('image', blob, 'image.jpg');
      formDataToSend.append('product_name', formData.name);
      formDataToSend.append('category', formData.category);

      const token = localStorage.getItem('admin_token');
      const response = await fetch('http://localhost:8000/api/ai-products/generate-description', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: formDataToSend,
      });

      const result = await response.json();

      if (result.success) {
        setFormData({ ...formData, description: result.description });
        toast.success('AI description generated!');
      } else {
        setFormData({ ...formData, description: result.description });
        toast.error(result.error || 'AI generation failed, using fallback');
      }
    } catch (error) {
      console.error('AI generation error:', error);
      toast.error('Failed to generate description. Try manually entering it.');
    } finally {
      setIsGeneratingAI(false);
    }
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name || !formData.price) {
      toast.error('Please fill in all required fields');
      return;
    }

    if (!editingProduct && !driveUrl) {
      toast.error('Please select an image from Google Drive');
      return;
    }

    setIsSubmitting(true);

    try {
      // Use Drive URL if available, otherwise keep existing image
      const imageData = driveUrl || editingProduct?.imageData || '';

      if (editingProduct) {
        // Update existing product
        const success = await updateProduct(editingProduct.id, formData, driveUrl ? imageData : undefined);
        if (success) {
          toast.success('Product updated successfully');
          setIsModalOpen(false);
          fetchProducts();
        } else {
          toast.error('Failed to update product');
        }
      } else {
        // Create new product
        const productId = await createProduct(formData, imageData);
        if (productId) {
          toast.success('Product created successfully');
          setIsModalOpen(false);
          fetchProducts();
        } else {
          toast.error('Failed to create product');
        }
      }
    } catch (error) {
      toast.error('An error occurred');
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle product deletion
  const handleDelete = async (product: Product) => {
    if (!confirm(`Are you sure you want to delete "${product.name}"?`)) return;

    const success = await deleteProduct(product.id);
    if (success) {
      toast.success('Product deleted');
      fetchProducts(); // Refresh the list
    } else {
      toast.error('Failed to delete product');
    }
  };

  // Toggle product enabled status
  const handleToggleEnabled = async (product: Product) => {
    const success = await toggleProductEnabled(product.id, !product.enabled);
    if (success) {
      toast.success(product.enabled ? 'Product disabled' : 'Product enabled');
      fetchProducts(); // Refresh the list
    } else {
      toast.error('Failed to update product');
    }
  };

  // Add a new color
  const addColor = () => {
    if (!newColorName.trim()) {
      toast.error('Please enter a color name');
      return;
    }
    setFormData({
      ...formData,
      colors: [...formData.colors, { name: newColorName, hex: newColorHex }],
    });
    setNewColorName('');
    setNewColorHex('#000000');
  };

  // Remove a color
  const removeColor = (index: number) => {
    setFormData({
      ...formData,
      colors: formData.colors.filter((_, i) => i !== index),
    });
  };

  // Add a size
  const addSize = () => {
    if (newSize.trim() && !formData.sizes.includes(newSize.trim())) {
      setFormData({
        ...formData,
        sizes: [...formData.sizes, newSize.trim()],
      });
      setNewSize('');
    }
  };

  // Remove a size
  const removeSize = (index: number) => {
    setFormData({
      ...formData,
      sizes: formData.sizes.filter((_, i) => i !== index),
    });
  };

  // Categories are now fetched from state

  return (
    <div>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Products</h1>
          <p className="text-gray-600 mt-1">
            Manage your product catalog ({products.length} products)
          </p>
        </div>
        <button
          onClick={handleAddNew}
          className="flex items-center gap-2 bg-primary-600 text-white px-4 py-2 rounded-md hover:bg-primary-700 transition-colors"
        >
          <Plus className="h-5 w-5" />
          Add Product
        </button>
      </div>

      {/* Search */}
      <div className="mb-6">
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search products..."
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
          />
        </div>
      </div>

      {/* Products Table */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Product
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Category
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Price
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {isLoading ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-gray-500">
                    Loading products...
                  </td>
                </tr>
              ) : filteredProducts.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-gray-500">
                    No products found
                  </td>
                </tr>
              ) : (
                filteredProducts.map((product) => (
                  <tr key={product.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-4">
                        <ProductImage
                          src={product.imageData}
                          alt={product.name}
                          className="h-12 w-12 rounded"
                        />
                        <div>
                          <p className="font-medium text-gray-900 line-clamp-1">
                            {product.name}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="capitalize text-gray-600">
                        {product.category}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div>
                        <p className="font-medium text-gray-900">
                          {formatPrice(product.finalPrice)}
                        </p>
                        {product.discount > 0 && (
                          <p className="text-xs text-gray-500 line-through">
                            {formatPrice(product.price)}
                          </p>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex px-2 py-1 text-xs font-medium rounded ${
                          product.enabled
                            ? 'bg-green-100 text-green-700'
                            : 'bg-red-100 text-red-700'
                        }`}
                      >
                        {product.enabled ? 'Enabled' : 'Disabled'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleToggleEnabled(product)}
                          className={`p-2 rounded hover:bg-gray-100 ${
                            product.enabled ? 'text-green-600' : 'text-red-600'
                          }`}
                          title={product.enabled ? 'Disable' : 'Enable'}
                        >
                          {product.enabled ? (
                            <Eye className="h-4 w-4" />
                          ) : (
                            <EyeOff className="h-4 w-4" />
                          )}
                        </button>
                        <button
                          onClick={() => handleEdit(product)}
                          className="p-2 text-blue-600 rounded hover:bg-gray-100"
                          title="Edit"
                        >
                          <Edit2 className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(product)}
                          className="p-2 text-red-600 rounded hover:bg-gray-100"
                          title="Delete"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Product Form Modal */}
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
              className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal Header */}
              <div className="flex items-center justify-between p-6 border-b sticky top-0 bg-white z-10">
                <h2 className="text-xl font-bold text-gray-900">
                  {editingProduct ? 'Edit Product' : 'Add New Product'}
                </h2>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="p-2 text-gray-400 hover:text-gray-600 rounded"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* Modal Form */}
              <form onSubmit={handleSubmit} className="p-6 space-y-6">
                {/* Image Selection */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Product Image *
                  </label>
                  <div className="space-y-3">
                    {/* Image Preview */}
                    {(imagePreview || driveUrl) && (
                      <div className="flex items-center gap-4">
                        <img
                          src={imagePreview || driveUrl}
                          alt="Preview"
                          className="h-32 w-32 object-cover rounded-lg border"
                          onError={(e) => {
                            e.currentTarget.src = '/placeholder.jpg';
                          }}
                        />
                        <button
                          type="button"
                          onClick={() => {
                            setImagePreview('');
                            setDriveUrl('');
                          }}
                          className="text-red-500 hover:text-red-700"
                        >
                          <X className="h-5 w-5" />
                        </button>
                      </div>
                    )}
                    
                    {/* Google Drive URL Input with Browse Button */}
                    <div className="flex gap-2">
                      <input
                        type="url"
                        value={driveUrl}
                        onChange={(e) => {
                          const url = extractDriveUrl(e.target.value);
                          setDriveUrl(url);
                          setImagePreview(url);
                        }}
                        placeholder="Paste Google Drive image link here..."
                        className="flex-1 px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                      />
                      <button
                        type="button"
                        onClick={handleBrowseDrive}
                        className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 whitespace-nowrap"
                        title="Open Google Drive folder"
                      >
                        <ExternalLink className="h-4 w-4" />
                        Browse Drive
                      </button>
                    </div>
                    
                    <p className="text-xs text-gray-500">
                      💡 Click "Browse Drive" → Right-click image → "Get link" → Paste here
                    </p>
                  </div>
                </div>

                {/* Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Product Name *
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    required
                  />
                </div>

                {/* Category */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Category *
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) =>
                      setFormData({ ...formData, category: e.target.value })
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  >
                    {categories.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat.charAt(0).toUpperCase() + cat.slice(1)}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Price and Discount */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Price (₹) *
                    </label>
                    <input
                      type="number"
                      value={formData.price === 0 ? '' : formData.price}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          price: e.target.value === '' ? 0 : parseFloat(e.target.value),
                        })
                      }
                      min="0"
                      step="0.01"
                      placeholder="Enter price"
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Discount (%)
                    </label>
                    <input
                      type="number"
                      value={formData.discount}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          discount: parseFloat(e.target.value) || 0,
                        })
                      }
                      min="0"
                      max="100"
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    />
                  </div>
                </div>

                {/* Description */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="block text-sm font-medium text-gray-700">
                      Description
                    </label>
                    <button
                      type="button"
                      onClick={handleGenerateAIDescription}
                      disabled={isGeneratingAI || !driveUrl || !formData.name}
                      className="flex items-center gap-2 px-3 py-1 text-sm bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-md hover:from-purple-700 hover:to-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                      title="Generate description using AI"
                    >
                      <Sparkles className={`h-4 w-4 ${isGeneratingAI ? 'animate-spin' : ''}`} />
                      {isGeneratingAI ? 'Generating...' : 'AI Generate'}
                    </button>
                  </div>
                  <textarea
                    value={formData.description}
                    onChange={(e) =>
                      setFormData({ ...formData, description: e.target.value })
                    }
                    rows={4}
                    placeholder="Enter description or use AI to generate from image..."
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  />
                </div>

                {/* Sizes */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Available Sizes
                  </label>
                  <div className="flex flex-wrap gap-2 mb-3">
                    {formData.sizes.map((size, index) => (
                      <div
                        key={index}
                        className="flex items-center gap-2 bg-gray-100 px-3 py-1 rounded"
                      >
                        <span className="text-sm font-medium">{size}</span>
                        <button
                          type="button"
                          onClick={() => removeSize(index)}
                          className="text-red-500 hover:text-red-700"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={newSize}
                      onChange={(e) => setNewSize(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addSize())}
                      placeholder="Enter size (e.g., S, M, L, XL, 32, 34)"
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-md text-sm"
                    />
                    <button
                      type="button"
                      onClick={addSize}
                      className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 text-sm"
                    >
                      Add
                    </button>
                  </div>
                </div>

                {/* Colors */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Available Colors
                  </label>
                  <div className="flex flex-wrap gap-2 mb-3">
                    {formData.colors.map((color, index) => (
                      <div
                        key={index}
                        className="flex items-center gap-2 bg-gray-100 px-3 py-1 rounded"
                      >
                        <div
                          className="h-4 w-4 rounded-full border"
                          style={{ backgroundColor: color.hex }}
                        />
                        <span className="text-sm">{color.name}</span>
                        <button
                          type="button"
                          onClick={() => removeColor(index)}
                          className="text-red-500 hover:text-red-700"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={newColorName}
                      onChange={(e) => setNewColorName(e.target.value)}
                      placeholder="Color name"
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-md text-sm"
                    />
                    <input
                      type="color"
                      value={newColorHex}
                      onChange={(e) => setNewColorHex(e.target.value)}
                      className="w-12 h-10 border border-gray-300 rounded cursor-pointer"
                    />
                    <button
                      type="button"
                      onClick={addColor}
                      className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 text-sm"
                    >
                      Add
                    </button>
                  </div>
                </div>

                {/* Toggles */}
                <div className="flex flex-wrap gap-6">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.enabled}
                      onChange={(e) =>
                        setFormData({ ...formData, enabled: e.target.checked })
                      }
                      className="h-4 w-4 text-primary-600 rounded"
                    />
                    <span className="text-sm text-gray-700">Enabled</span>
                  </label>
                </div>

                {/* Submit Button */}
                <div className="flex gap-4 pt-4 border-t">
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
                    {isSubmitting
                      ? 'Saving...'
                      : editingProduct
                      ? 'Update Product'
                      : 'Create Product'}
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
