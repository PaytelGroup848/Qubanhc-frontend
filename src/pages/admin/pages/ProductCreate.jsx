import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { adminService } from '../../../services/admin';
import ProductImageUpload from '../../../components/ProductImageUpload';
import toast from 'react-hot-toast';

export default function ProductCreate() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);
  const [error, setError] = useState('');
  const [categories, setCategories] = useState([]);
  const [form, setForm] = useState({
    name: '',
    description: '',
    shortDescription: '',
    category: '',
    subCategory: '',
    brand: '',
    price: '',
    originalPrice: '',
    stock: 0,
    trackInventory: true,
    lowStockThreshold: 5,
    taxClass: 'gst_18',
    images: [],
    specifications: [{ label: '', value: '' }],
    highlights: [],
    tags: [],
    isFeatured: false,
    seo: {
      metaTitle: '',
      metaDescription: '',
      keywords: [],
    },
  });

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      setPageLoading(true);
      const response = await adminService.getCategories();
      setCategories(response.data?.categories || []);
    } catch (err) {
      console.error('Error fetching categories:', err);
      setCategories([]);
    } finally {
      setPageLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (name.startsWith('seo.')) {
      const seoField = name.split('.')[1];
      setForm((prev) => ({
        ...prev,
        seo: {
          ...prev.seo,
          [seoField]: value,
        },
      }));
      return;
    }

    setForm((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleImagesChange = (newImages) => {
    setForm((prev) => ({ ...prev, images: newImages }));
  };

  const handleSpecificationChange = (index, field, value) => {
    const newSpecs = [...form.specifications];
    newSpecs[index][field] = value;
    setForm((prev) => ({ ...prev, specifications: newSpecs }));
  };

  const addSpecification = () => {
    setForm((prev) => ({
      ...prev,
      specifications: [...prev.specifications, { label: '', value: '' }],
    }));
  };

  const removeSpecification = (index) => {
    const newSpecs = form.specifications.filter((_, i) => i !== index);
    setForm((prev) => ({ ...prev, specifications: newSpecs }));
  };

  const handleTagsChange = (e) => {
    const tags = e.target.value.split(',').map((t) => t.trim()).filter((t) => t);
    setForm((prev) => ({ ...prev, tags }));
  };

  const validate = () => {
    if (!form.name.trim()) return 'Product name is required';
    if (!form.description.trim()) return 'Product description is required';
    if (!form.price || parseFloat(form.price) <= 0) return 'Valid price is required';
    if (!form.category) return 'Category is required';
    return null;
  };

// ✅AISA KARO — saari images bhejo as-is
const handleSubmit = async (e) => {
  e.preventDefault();
  const validationError = validate();
  if (validationError) {
    setError(validationError);
    toast.error(validationError);
    return;
  }
  setError('');
  setLoading(true);

  try {
    // Saari images bhejo — base64 bhi
    // Backend khud handle karega
    const allImages = form.images.map((img, index) => ({
      url: img.url,           // base64 ya normal URL dono
      publicId: img.publicId || null,
      isMain: img.isMain || index === 0,
      displayOrder: index,
    }));

    const productData = {
      name: form.name.trim(),
      description: form.description.trim(),
      shortDescription: form.shortDescription?.trim() || '',
      category: form.category,
      subCategory: form.subCategory || null,
      brand: form.brand || null,
      price: parseFloat(form.price),
      originalPrice: form.originalPrice ? parseFloat(form.originalPrice) : null,
      stock: parseInt(form.stock) || 0,
      trackInventory: form.trackInventory,
      lowStockThreshold: parseInt(form.lowStockThreshold) || 5,
      taxClass: form.taxClass,
      images: allImages,         // ← saari images
      specifications: form.specifications.filter((s) => s.label && s.value),
      highlights: form.highlights.filter((h) => h.trim()),
      tags: form.tags,
      isFeatured: form.isFeatured,
      seo: {
        metaTitle: form.seo.metaTitle?.trim() || '',
        metaDescription: form.seo.metaDescription?.trim() || '',
        keywords: form.seo.keywords?.filter((k) => k.trim()) || [],
      },
    };

    await adminService.createProduct(productData);

    toast.success('Product created successfully!');
    navigate('/admin/products');
  } catch (err) {
    const message = err.response?.data?.message || 'Something went wrong';
    setError(message);
    toast.error(message);
  } finally {
    setLoading(false);
  }
};

  if (pageLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600" />
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto">
      <button
        onClick={() => navigate('/admin/products')}
        className="flex items-center gap-2 text-gray-400 hover:text-gray-600 transition-colors mb-6"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
        </svg>
        Back to Products
      </button>

      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Add New Product</h1>
        <p className="text-sm text-gray-500 mt-1">Create a product listing</p>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-600 rounded-lg text-sm">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* General Information */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 sm:p-8 space-y-6">
          <h2 className="text-lg font-semibold text-gray-800">General Information</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Product Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                maxLength={300}
                className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none transition-all"
                placeholder="Product name"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description <span className="text-red-500">*</span>
              </label>
              <textarea
                name="description"
                value={form.description}
                onChange={handleChange}
                rows={5}
                className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none transition-all resize-y"
                placeholder="Detailed product description..."
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Short Description</label>
              <textarea
                name="shortDescription"
                value={form.shortDescription}
                onChange={handleChange}
                rows={2}
                maxLength={500}
                className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none transition-all resize-y"
                placeholder="Brief product summary..."
              />
              <p className="text-xs text-gray-400 mt-1">{form.shortDescription?.length || 0}/500 characters</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Category <span className="text-red-500">*</span>
              </label>
              <select
                name="category"
                value={form.category}
                onChange={handleChange}
                className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none transition-all bg-white"
              >
                <option value="">Select Category</option>
                {categories.map((cat) => (
                  <option key={cat._id} value={cat._id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Sub Category</label>
              <select
                name="subCategory"
                value={form.subCategory}
                onChange={handleChange}
                className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none transition-all bg-white"
              >
                <option value="">Select Sub Category</option>
                {categories.map((cat) => (
                  <option key={cat._id} value={cat._id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Brand</label>
              <input
                type="text"
                name="brand"
                value={form.brand}
                onChange={handleChange}
                className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none transition-all"
                placeholder="Brand name"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Tax Class</label>
              <select
                name="taxClass"
                value={form.taxClass}
                onChange={handleChange}
                className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none transition-all bg-white"
              >
                <option value="none">None</option>
                <option value="gst_5">GST 5%</option>
                <option value="gst_12">GST 12%</option>
                <option value="gst_18">GST 18%</option>
                <option value="gst_28">GST 28%</option>
              </select>
            </div>
          </div>
        </div>

        {/* Pricing & Inventory */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 sm:p-8 space-y-6">
          <h2 className="text-lg font-semibold text-gray-800">Pricing & Inventory</h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Price (₹) <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                name="price"
                value={form.price}
                onChange={handleChange}
                min="0"
                step="0.01"
                className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none transition-all"
                placeholder="999"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Original Price (₹)</label>
              <input
                type="number"
                name="originalPrice"
                value={form.originalPrice}
                onChange={handleChange}
                min="0"
                step="0.01"
                className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none transition-all"
                placeholder="1299"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Stock Quantity</label>
              <input
                type="number"
                name="stock"
                value={form.stock}
                onChange={handleChange}
                min="0"
                className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none transition-all"
                placeholder="100"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Low Stock Threshold</label>
              <input
                type="number"
                name="lowStockThreshold"
                value={form.lowStockThreshold}
                onChange={handleChange}
                min="0"
                className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none transition-all"
                placeholder="5"
              />
            </div>

            <div className="flex items-center gap-3 pt-5">
              <label className="text-sm font-medium text-gray-700">Track Inventory</label>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  name="trackInventory"
                  checked={form.trackInventory}
                  onChange={handleChange}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:bg-teal-600 peer-focus:ring-2 peer-focus:ring-teal-500 after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:after:translate-x-full" />
              </label>
            </div>

            <div className="flex items-center gap-3 pt-5">
              <label className="text-sm font-medium text-gray-700">Featured Product</label>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  name="isFeatured"
                  checked={form.isFeatured}
                  onChange={handleChange}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:bg-teal-600 peer-focus:ring-2 peer-focus:ring-teal-500 after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:after:translate-x-full" />
              </label>
            </div>
          </div>
        </div>

        {/* Product Images */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 sm:p-8 space-y-6">
          <div>
            <h2 className="text-lg font-semibold text-gray-800">Product Images</h2>
            <p className="text-sm text-gray-500 mt-1">
              Upload product images. First image will be used as thumbnail.
            </p>
          </div>

          <ProductImageUpload
            images={form.images}
            onChange={handleImagesChange}
            maxImages={5}
          />

          {form.images.length === 0 && (
            <p className="text-sm text-yellow-600">
              ⚠️ At least one image is recommended for better visibility
            </p>
          )}
        </div>

        {/* Specifications */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 sm:p-8 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-800">Specifications</h2>
            <button
              type="button"
              onClick={addSpecification}
              className="text-teal-600 hover:text-teal-700 text-sm font-medium"
            >
              + Add Specification
            </button>
          </div>

          {form.specifications.map((spec, index) => (
            <div key={index} className="flex gap-3 items-center">
              <div className="flex-1">
                <input
                  type="text"
                  placeholder="Label (e.g., Material)"
                  value={spec.label}
                  onChange={(e) => handleSpecificationChange(index, 'label', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none transition-all"
                />
              </div>
              <div className="flex-1">
                <input
                  type="text"
                  placeholder="Value (e.g., Cotton)"
                  value={spec.value}
                  onChange={(e) => handleSpecificationChange(index, 'value', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none transition-all"
                />
              </div>
              <button
                type="button"
                onClick={() => removeSpecification(index)}
                className="p-2 text-red-500 hover:text-red-700"
              >
                ✕
              </button>
            </div>
          ))}
        </div>

        {/* Tags & SEO */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 sm:p-8 space-y-6">
          <h2 className="text-lg font-semibold text-gray-800">Tags & SEO</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Tags</label>
              <input
                type="text"
                value={form.tags.join(', ')}
                onChange={handleTagsChange}
                className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none transition-all"
                placeholder="tag1, tag2, tag3"
              />
              <p className="text-xs text-gray-400 mt-1">Separate tags with commas</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Meta Title</label>
              <input
                type="text"
                name="seo.metaTitle"
                value={form.seo.metaTitle}
                onChange={handleChange}
                maxLength={60}
                className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none transition-all"
                placeholder="Meta title"
              />
              <p className="text-xs text-gray-400 mt-1">{form.seo.metaTitle?.length || 0}/60 characters</p>
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Meta Description</label>
              <textarea
                name="seo.metaDescription"
                value={form.seo.metaDescription}
                onChange={handleChange}
                rows={2}
                maxLength={160}
                className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none transition-all resize-y"
                placeholder="Meta description"
              />
              <p className="text-xs text-gray-400 mt-1">{form.seo.metaDescription?.length || 0}/160 characters</p>
            </div>
          </div>
        </div>

        {/* Submit Buttons */}
        <div className="flex items-center gap-4 pt-4 border-t border-gray-100">
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-2.5 bg-teal-600 text-white font-semibold rounded-lg hover:bg-teal-700 transition-colors disabled:opacity-50 flex items-center gap-2"
          >
            {loading ? (
              <>
                <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                Creating...
              </>
            ) : (
              'Create Product'
            )}
          </button>

          <button
            type="button"
            onClick={() => navigate('/admin/products')}
            className="px-6 py-2.5 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}