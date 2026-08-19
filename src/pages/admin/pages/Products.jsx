import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { adminService } from "../../../services/admin";
import ProductImageUpload from "../../../components/ProductImageUpload";
import toast from "react-hot-toast";

const emptyForm = {
  name: "",
  description: "",
  shortDescription: "",
  category: "",
  subCategory: "",
  brand: "",
  price: "",
  originalPrice: "",
  stock: 0,
  trackInventory: true,
  lowStockThreshold: 5,
  unitsPerPack: 6,
  taxClass: "gst_18",
  images: [],
  specifications: [{ label: "", value: "" }],
  highlights: [],
  tags: [],
  isFeatured: false,
  hasVariants: false,
  variants: [{ name: "", price: "", stock: 0 }],
  seo: {
    metaTitle: "",
    metaDescription: "",
    keywords: [],
  },
};

export default function Products() {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const [categories, setCategories] = useState([]);
  const [editTarget, setEditTarget] = useState(null);
  const [editForm, setEditForm] = useState({ ...emptyForm });
  const [editLoading, setEditLoading] = useState(false);
  const [editFetching, setEditFetching] = useState(false);
  const [editError, setEditError] = useState("");

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await adminService.getAllProducts({ limit: 50 });
      setProducts(response?.products || []);
    } catch (err) {
      console.error("Error fetching products:", err);
      setError("Failed to load products");
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await adminService.getCategories();
      setCategories(response.data?.categories || []);
    } catch (err) {
      console.error("Error fetching categories:", err);
    }
  };

  const handleAskDelete = (product) => {
    setDeleteTarget(product);
  };

  const handleCancelDelete = () => {
    if (deleting) return;
    setDeleteTarget(null);
  };

  const handleConfirmDelete = async () => {
    if (!deleteTarget?._id) return;

    try {
      setDeleting(true);
      await adminService.deleteProduct(deleteTarget._id);
      toast.success("Product deleted successfully");
      setDeleteTarget(null);
      await fetchProducts();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to delete product");
    } finally {
      setDeleting(false);
    }
  };

  const handleAddNew = () => {
    navigate("/admin/products/create");
  };

  const handleAskEdit = async (product) => {
    try {
      setEditFetching(true);
      setEditError("");
      const { product: p, variants: existingVariants } =
        await adminService.getProductById(product._id);

      if (!p) {
        throw new Error("Product not found");
      }

      setEditForm({
        name: p.name || "",
        description: p.description || "",
        shortDescription: p.shortDescription || "",
        category: p.category?._id || p.category || "",
        subCategory: p.subCategory?._id || p.subCategory || "",
        brand: p.brand || "",
        price: p.price || "",
        originalPrice: p.originalPrice || "",
        stock: p.stock ?? 0,
        trackInventory:
          p.trackInventory !== undefined ? p.trackInventory : true,
        lowStockThreshold: p.lowStockThreshold ?? 5,
        unitsPerPack:
          p.unitsPerPack && p.unitsPerPack >= 1 ? p.unitsPerPack : 1,
        taxClass: p.taxClass || "gst_18",
        images:
          p.images && p.images.length
            ? p.images.map((img, idx) => ({
                url: img.url,
                publicId: img.publicId || null,
                isMain: img.isMain || idx === 0,
                displayOrder: img.displayOrder || idx,
              }))
            : [],
        specifications:
          p.specifications && p.specifications.length
            ? p.specifications.map((s) => ({
                label: s.label || "",
                value: s.value || "",
              }))
            : [{ label: "", value: "" }],
        highlights: p.highlights || [],
        tags: p.tags || [],
        isFeatured: p.isFeatured || false,
        hasVariants: !!(p.hasVariants && existingVariants.length > 0),
        variants:
          existingVariants && existingVariants.length
            ? existingVariants.map((v) => ({
                name: v.name || "",
                price:
                  v.price !== undefined && v.price !== null
                    ? String(v.price)
                    : "",
                stock: v.stock ?? 0,
              }))
            : [{ name: "", price: "", stock: 0 }],
        seo: {
          metaTitle: p.seo?.metaTitle || "",
          metaDescription: p.seo?.metaDescription || "",
          keywords: p.seo?.keywords || [],
        },
      });
      setEditTarget(product);
    } catch (err) {
      const msg =
        err.response?.data?.message || "Failed to load product for editing";
      setEditError(msg);
      toast.error(msg);
    } finally {
      setEditFetching(false);
    }
  };

  const handleCancelEdit = () => {
    if (editLoading) return;
    setEditTarget(null);
    setEditForm({ ...emptyForm });
    setEditError("");
  };

  const handleEditChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (name.startsWith("seo.")) {
      const seoField = name.split(".")[1];
      setEditForm((prev) => ({
        ...prev,
        seo: {
          ...prev.seo,
          [seoField]: value,
        },
      }));
      return;
    }

    setEditForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleEditImagesChange = (newImages) => {
    setEditForm((prev) => ({ ...prev, images: newImages }));
  };

  const handleEditSpecificationChange = (index, field, value) => {
    const newSpecs = [...editForm.specifications];
    newSpecs[index][field] = value;
    setEditForm((prev) => ({ ...prev, specifications: newSpecs }));
  };

  const addEditSpecification = () => {
    setEditForm((prev) => ({
      ...prev,
      specifications: [...prev.specifications, { label: "", value: "" }],
    }));
  };

  const removeEditSpecification = (index) => {
    const newSpecs = editForm.specifications.filter((_, i) => i !== index);
    setEditForm((prev) => ({
      ...prev,
      specifications: newSpecs.length ? newSpecs : [{ label: "", value: "" }],
    }));
  };

  const handleEditTagsChange = (e) => {
    const tags = e.target.value
      .split(",")
      .map((t) => t.trim())
      .filter((t) => t);
    setEditForm((prev) => ({ ...prev, tags }));
  };

  const handleEditUnitsPerPackChange = (e) => {
    const val = parseInt(e.target.value);
    setEditForm((prev) => ({
      ...prev,
      unitsPerPack: isNaN(val) || val < 1 ? 1 : val,
    }));
  };

  const incrementEditUnitsPerPack = () => {
    setEditForm((prev) => ({
      ...prev,
      unitsPerPack: (prev.unitsPerPack || 1) + 1,
    }));
  };

  const decrementEditUnitsPerPack = () => {
    setEditForm((prev) => ({
      ...prev,
      unitsPerPack: Math.max(1, (prev.unitsPerPack || 1) - 1),
    }));
  };

  const addEditVariantRow = () => {
    setEditForm((prev) => ({
      ...prev,
      variants: [
        ...prev.variants,
        { name: "", price: prev.price || "", stock: 0 },
      ],
    }));
  };

  const removeEditVariantRow = (index) => {
    setEditForm((prev) => ({
      ...prev,
      variants: prev.variants.filter((_, i) => i !== index),
    }));
  };

  const handleEditVariantChange = (index, field, value) => {
    setEditForm((prev) => {
      const newVariants = [...prev.variants];
      newVariants[index][field] = value;
      return { ...prev, variants: newVariants };
    });
  };

  const validateEdit = () => {
    if (!editForm.name.trim()) return "Product name is required";
    if (!editForm.description.trim()) return "Product description is required";
    if (!editForm.category) return "Category is required";
    if (!editForm.hasVariants) {
      if (!editForm.price || parseFloat(editForm.price) <= 0)
        return "Valid price is required";
    } else {
      const validVariants = editForm.variants.filter(
        (v) => v.name && v.name.trim(),
      );
      if (validVariants.length === 0)
        return "At least one size with name is required when sizes are enabled";
      for (const v of validVariants) {
        if (!v.price || parseFloat(v.price) <= 0)
          return `Valid price required for size "${v.name}"`;
        if (v.stock === undefined || v.stock === null || parseInt(v.stock) < 0)
          return `Valid stock required for size "${v.name}"`;
      }
    }
    return null;
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    const validationError = validateEdit();
    if (validationError) {
      setEditError(validationError);
      toast.error(validationError);
      return;
    }
    setEditError("");
    setEditLoading(true);

    try {
      const allImages = editForm.images.map((img, index) => ({
        url: img.url,
        publicId: img.publicId || null,
        isMain: img.isMain || index === 0,
        displayOrder: index,
      }));

      const validVariants = editForm.hasVariants
        ? editForm.variants
            .filter((v) => v.name && v.name.trim())
            .map((v) => ({
              name: v.name.trim(),
              price: parseFloat(v.price) || parseFloat(editForm.price) || 0,
              originalPrice: editForm.originalPrice
                ? parseFloat(editForm.originalPrice)
                : null,
              stock: parseInt(v.stock) || 0,
              attributes: [{ name: "Size", value: v.name.trim() }],
            }))
        : [];

      const basePrice =
        editForm.hasVariants && validVariants.length
          ? Math.min(...validVariants.map((v) => v.price))
          : parseFloat(editForm.price);

      const baseStock =
        editForm.hasVariants && validVariants.length
          ? validVariants.reduce((s, v) => s + v.stock, 0)
          : parseInt(editForm.stock) || 0;

      const productData = {
        name: editForm.name.trim(),
        description: editForm.description.trim(),
        shortDescription: editForm.shortDescription?.trim() || "",
        category: editForm.category,
        subCategory: editForm.subCategory || null,
        brand: editForm.brand || null,
        price: basePrice,
        originalPrice: editForm.originalPrice
          ? parseFloat(editForm.originalPrice)
          : null,
        stock: baseStock,
        trackInventory: editForm.trackInventory,
        lowStockThreshold: parseInt(editForm.lowStockThreshold) || 5,
        unitsPerPack: parseInt(editForm.unitsPerPack) || 1,
        taxClass: editForm.taxClass,
        images: allImages,
        specifications: editForm.specifications.filter(
          (s) => s.label && s.value,
        ),
        highlights: (editForm.highlights || []).filter(
          (h) => typeof h === "string" && h.trim(),
        ),
        tags: editForm.tags,
        isFeatured: editForm.isFeatured,
        hasVariants: editForm.hasVariants && validVariants.length > 0,
        variants: validVariants,
        seo: {
          metaTitle: editForm.seo.metaTitle?.trim() || "",
          metaDescription: editForm.seo.metaDescription?.trim() || "",
          keywords:
            (editForm.seo.keywords || []).filter(
              (k) => typeof k === "string" && k.trim(),
            ) || [],
        },
      };

      await adminService.updateProduct(editTarget._id, productData);

      toast.success("Product updated successfully!");
      setEditTarget(null);
      setEditForm({ ...emptyForm });
      await fetchProducts();
    } catch (err) {
      const message = err.response?.data?.message || "Something went wrong";
      setEditError(message);
      toast.error(message);
    } finally {
      setEditLoading(false);
    }
  };

  const filtered = products.filter((p) =>
    p.name?.toLowerCase().includes(search.toLowerCase()),
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-600 rounded-lg p-4">
        {error}
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Products</h1>
          <p className="text-sm text-gray-500 mt-1">Manage your products</p>
        </div>
        <button
          onClick={handleAddNew}
          className="inline-flex items-center gap-2 px-4 py-2 bg-teal-600 text-white rounded-lg font-medium hover:bg-teal-700 transition-colors"
        >
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M12 6v6m0 0v6m0-6h6m-6 0H6"
            />
          </svg>
          Add Product
        </button>
      </div>

      {/* Search */}
      <div className="mb-4">
        <input
          type="text"
          placeholder="Search products..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full sm:w-64 px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-teal-500 focus:outline-none"
        />
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-gray-500 uppercase text-xs">
              <tr>
                <th className="px-6 py-3 text-left">Product</th>
                <th className="px-6 py-3 text-left">Category</th>
                <th className="px-6 py-3 text-center">Price</th>
                <th className="px-6 py-3 text-center">Stock</th>
                <th className="px-6 py-3 text-center">Status</th>
                {/* <th className="px-6 py-3 text-center">Featured</th> */}
                <th className="px-6 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filtered.length === 0 ? (
                <tr>
                  <td
                    colSpan={7}
                    className="px-6 py-12 text-center text-gray-500"
                  >
                    No products found.
                  </td>
                </tr>
              ) : (
                filtered.map((p) => (
                  <tr
                    key={p._id}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        {p.images?.[0]?.url && (
                          <img
                            src={p.images[0].url}
                            alt={p.name}
                            className="w-10 h-10 rounded-lg object-cover"
                          />
                        )}
                        <div>
                          <div className="font-medium text-gray-900">
                            {p.name}
                          </div>
                          <div className="text-xs text-gray-400">
                            SKU: {p.sku || "N/A"}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">{p.category?.name || "N/A"}</td>
                    <td className="px-6 py-4 text-center">
                      <div className="font-medium">
                        ₹{p.price?.toLocaleString()}
                      </div>
                      {p.originalPrice && (
                        <div className="text-xs text-gray-400 line-through">
                          ₹{p.originalPrice.toLocaleString()}
                        </div>
                      )}
                      {p.discountPercent > 0 && (
                        <div className="text-xs text-green-600">
                          {p.discountPercent}% off
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span
                        className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                          p.stock > 10
                            ? "bg-green-100 text-green-700"
                            : p.stock > 0
                              ? "bg-yellow-100 text-yellow-700"
                              : "bg-red-100 text-red-700"
                        }`}
                      >
                        {p.stock}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span
                        className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                          p.status === "active"
                            ? "bg-green-100 text-green-700"
                            : p.status === "draft"
                              ? "bg-gray-100 text-gray-600"
                              : p.status === "rejected"
                                ? "bg-red-100 text-red-700"
                                : "bg-yellow-100 text-yellow-700"
                        }`}
                      >
                        {p.status}
                      </span>
                    </td>
                    {/* <td className="px-6 py-4 text-center">
                      {p.isFeatured ? (
                        <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-700">
                          ★ Featured
                        </span>
                      ) : (
                        <span className="text-gray-400">-</span>
                      )}
                    </td> */}
                    <td className="px-6 py-4 text-right space-x-2">
                      <button
                        onClick={() => handleAskEdit(p)}
                        className="text-teal-600 hover:text-teal-800 text-xs font-medium transition-colors"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleAskDelete(p)}
                        className="text-red-500 hover:text-red-700 text-xs font-medium transition-colors"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {deleteTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
          <div className="w-full max-w-md rounded-xl bg-white shadow-2xl border border-gray-100 overflow-hidden">
            <div className="p-5 border-b border-gray-100">
              <div className="flex items-start gap-3">
                <div className="h-10 w-10 rounded-full bg-red-100 text-red-600 flex items-center justify-center flex-shrink-0">
                  <svg
                    className="h-5 w-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M12 9v4m0 4h.01M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"
                    />
                  </svg>
                </div>
                <div>
                  <h2 className="text-lg font-bold text-gray-900">
                    Delete product?
                  </h2>
                  <p className="mt-1 text-sm text-gray-500">
                    This will remove the product, variants, images, cart
                    entries, wishlists, and reviews.
                  </p>
                </div>
              </div>
            </div>

            <div className="p-5">
              <div className="flex items-center gap-3 rounded-lg bg-gray-50 p-3">
                {deleteTarget.images?.[0]?.url && (
                  <img
                    src={deleteTarget.images[0].url}
                    alt={deleteTarget.name}
                    className="h-12 w-12 rounded-lg object-cover"
                  />
                )}
                <div className="min-w-0">
                  <p className="font-semibold text-gray-900 truncate">
                    {deleteTarget.name}
                  </p>
                  <p className="text-xs text-gray-500">
                    SKU: {deleteTarget.sku || "N/A"}
                  </p>
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-3 px-5 py-4 bg-gray-50">
              <button
                onClick={handleCancelDelete}
                disabled={deleting}
                className="px-4 py-2 rounded-lg border border-gray-200 text-gray-700 font-medium hover:bg-white disabled:opacity-60"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmDelete}
                disabled={deleting}
                className="px-4 py-2 rounded-lg bg-red-600 text-white font-semibold hover:bg-red-700 disabled:opacity-60 min-w-28"
              >
                {deleting ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}

      {editTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4 py-6">
          <div className="w-full max-w-4xl rounded-xl bg-white shadow-2xl border border-gray-100 overflow-hidden flex flex-col max-h-[92vh]">
            <div className="p-5 border-b border-gray-100 flex items-center justify-between flex-shrink-0">
              <div>
                <h2 className="text-lg font-bold text-gray-900">
                  Edit Product
                </h2>
                <p className="text-sm text-gray-500 mt-0.5">
                  Update product details
                </p>
              </div>
              <button
                onClick={handleCancelEdit}
                disabled={editLoading || editFetching}
                className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 transition-colors disabled:opacity-50"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            {editFetching ? (
              <div className="flex items-center justify-center py-20 flex-shrink-0">
                <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-teal-600" />
              </div>
            ) : (
              <>
                {editError && (
                  <div className="mx-5 mt-4 p-3 bg-red-50 border border-red-200 text-red-600 rounded-lg text-sm">
                    {editError}
                  </div>
                )}

                <form
                  onSubmit={handleEditSubmit}
                  className="overflow-y-auto px-5 py-5 space-y-5"
                >
                  {/* General Information */}
                  <div className="bg-white rounded-xl border border-gray-100 p-5 space-y-4">
                    <h3 className="font-semibold text-gray-800">
                      General Information
                    </h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Product Name <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          name="name"
                          value={editForm.name}
                          onChange={handleEditChange}
                          maxLength={300}
                          className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none"
                          placeholder="Product name"
                        />
                      </div>

                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Description <span className="text-red-500">*</span>
                        </label>
                        <textarea
                          name="description"
                          value={editForm.description}
                          onChange={handleEditChange}
                          rows={3}
                          className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none resize-y"
                          placeholder="Detailed product description..."
                        />
                      </div>

                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Short Description
                        </label>
                        <textarea
                          name="shortDescription"
                          value={editForm.shortDescription}
                          onChange={handleEditChange}
                          rows={2}
                          maxLength={500}
                          className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none resize-y"
                          placeholder="Brief product summary..."
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Category <span className="text-red-500">*</span>
                        </label>
                        <select
                          name="category"
                          value={editForm.category}
                          onChange={handleEditChange}
                          className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none bg-white"
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
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Sub Category
                        </label>
                        <select
                          name="subCategory"
                          value={editForm.subCategory}
                          onChange={handleEditChange}
                          className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none bg-white"
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
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Brand
                        </label>
                        <input
                          type="text"
                          name="brand"
                          value={editForm.brand}
                          onChange={handleEditChange}
                          className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none"
                          placeholder="Brand name"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Tax Class
                        </label>
                        <select
                          name="taxClass"
                          value={editForm.taxClass}
                          onChange={handleEditChange}
                          className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none bg-white"
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
                  <div className="bg-white rounded-xl border border-gray-100 p-5 space-y-4">
                    <h3 className="font-semibold text-gray-800">
                      Pricing & Inventory
                    </h3>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Price (₹) <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="number"
                          name="price"
                          value={editForm.price}
                          onChange={handleEditChange}
                          min="0"
                          step="0.01"
                          className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none"
                          placeholder="999"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Original Price (₹MRP)
                        </label>
                        <input
                          type="number"
                          name="originalPrice"
                          value={editForm.originalPrice}
                          onChange={handleEditChange}
                          min="0"
                          step="0.01"
                          className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none"
                          placeholder="0"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Stock Quantity
                        </label>
                        <input
                          type="number"
                          name="stock"
                          value={editForm.stock}
                          onChange={handleEditChange}
                          min="0"
                          className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none"
                          placeholder="100"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Low Stock Threshold
                        </label>
                        <input
                          type="number"
                          name="lowStockThreshold"
                          value={editForm.lowStockThreshold}
                          onChange={handleEditChange}
                          min="0"
                          className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none"
                          placeholder="5"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Units per Pack
                        </label>
                        <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden focus-within:ring-2 focus-within:ring-teal-500 focus-within:border-transparent">
                          <button
                            type="button"
                            onClick={decrementEditUnitsPerPack}
                            disabled={editForm.unitsPerPack <= 1}
                            className="px-3 py-2 text-gray-600 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed border-r border-gray-200 font-semibold transition-colors"
                          >
                            −
                          </button>
                          <input
                            type="number"
                            name="unitsPerPack"
                            value={editForm.unitsPerPack}
                            onChange={handleEditUnitsPerPackChange}
                            min="1"
                            className="flex-1 px-3 py-2 text-center outline-none w-16"
                          />
                          <button
                            type="button"
                            onClick={incrementEditUnitsPerPack}
                            className="px-3 py-2 text-gray-600 hover:bg-gray-50 border-l border-gray-200 font-semibold transition-colors"
                          >
                            +
                          </button>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 pt-5">
                        <label className="text-sm font-medium text-gray-700">
                          Track Inventory
                        </label>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            name="trackInventory"
                            checked={editForm.trackInventory}
                            onChange={handleEditChange}
                            className="sr-only peer"
                          />
                          <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:bg-teal-600 peer-focus:ring-2 peer-focus:ring-teal-500 after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:after:translate-x-full" />
                        </label>
                      </div>

                      <div className="flex items-center gap-3 pt-5">
                        <label className="text-sm font-medium text-gray-700">
                          Featured Product
                        </label>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            name="isFeatured"
                            checked={editForm.isFeatured}
                            onChange={handleEditChange}
                            className="sr-only peer"
                          />
                          <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:bg-teal-600 peer-focus:ring-2 peer-focus:ring-teal-500 after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:after:translate-x-full" />
                        </label>
                      </div>
                    </div>
                  </div>

                  {/* Sizes / Variants */}
                  <div className="bg-white rounded-xl border border-gray-100 p-5 space-y-4">
                    <div className="flex items-center justify-between flex-wrap gap-3">
                      <div>
                        <h3 className="font-semibold text-gray-800">
                          Sizes &amp; Quantity
                        </h3>
                        <p className="text-sm text-gray-500 mt-1">
                          Enable for products with multiple sizes (diapers,
                          pads, S/M/L/XL/XXL etc.)
                        </p>
                      </div>
                      <label className="flex items-center gap-3 cursor-pointer">
                        <span className="text-sm font-medium text-gray-700">
                          Product has sizes
                        </span>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            name="hasVariants"
                            checked={editForm.hasVariants}
                            onChange={handleEditChange}
                            className="sr-only peer"
                          />
                          <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:bg-teal-600 peer-focus:ring-2 peer-focus:ring-teal-500 after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:after:translate-x-full" />
                        </label>
                      </label>
                    </div>

                    {editForm.hasVariants && (
                      <div className="space-y-3">
                        <div className="grid grid-cols-12 gap-3 text-xs font-semibold text-gray-400 uppercase tracking-wider px-1">
                          <div className="col-span-4">Size Name</div>
                          <div className="col-span-3">Price (₹)</div>
                          <div className="col-span-3">In Stock</div>
                          <div className="col-span-2" />
                        </div>

                        {editForm.variants.map((v, idx) => (
                          <div
                            key={idx}
                            className="grid grid-cols-12 gap-3 items-center"
                          >
                            <div className="col-span-4">
                              <input
                                type="text"
                                placeholder="e.g. S, M, L, XL, XXL"
                                value={v.name}
                                onChange={(e) =>
                                  handleEditVariantChange(
                                    idx,
                                    "name",
                                    e.target.value,
                                  )
                                }
                                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none"
                              />
                            </div>
                            <div className="col-span-3">
                              <input
                                type="number"
                                min="0"
                                step="0.01"
                                placeholder={String(editForm.price || "Price")}
                                value={v.price}
                                onChange={(e) =>
                                  handleEditVariantChange(
                                    idx,
                                    "price",
                                    e.target.value,
                                  )
                                }
                                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none"
                              />
                            </div>
                            <div className="col-span-3">
                              <input
                                type="number"
                                min="0"
                                placeholder="0"
                                value={v.stock}
                                onChange={(e) =>
                                  handleEditVariantChange(
                                    idx,
                                    "stock",
                                    e.target.value,
                                  )
                                }
                                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none"
                              />
                            </div>
                            <div className="col-span-2 flex justify-end">
                              <button
                                type="button"
                                onClick={() => removeEditVariantRow(idx)}
                                disabled={editForm.variants.length <= 1}
                                className="p-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                              >
                                ✕
                              </button>
                            </div>
                          </div>
                        ))}

                        <div className="pt-2">
                          <button
                            type="button"
                            onClick={addEditVariantRow}
                            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-dashed border-teal-300 text-teal-600 hover:bg-teal-50 text-sm font-medium transition-colors"
                          >
                            + Add Size
                          </button>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Product Images */}
                  <div className="bg-white rounded-xl border border-gray-100 p-5 space-y-4">
                    <div>
                      <h3 className="font-semibold text-gray-800">
                        Product Images
                      </h3>
                      <p className="text-sm text-gray-500 mt-1">
                        Upload product images. First image will be used as
                        thumbnail.
                      </p>
                    </div>
                    <ProductImageUpload
                      images={editForm.images}
                      onChange={handleEditImagesChange}
                      maxImages={10}
                    />
                  </div>

                  {/* Specifications */}
                  <div className="bg-white rounded-xl border border-gray-100 p-5 space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="font-semibold text-gray-800">
                        Specifications
                      </h3>
                      <button
                        type="button"
                        onClick={addEditSpecification}
                        className="text-teal-600 hover:text-teal-700 text-sm font-medium"
                      >
                        + Add Specification
                      </button>
                    </div>

                    {editForm.specifications.map((spec, index) => (
                      <div key={index} className="flex gap-3 items-center">
                        <div className="flex-1">
                          <input
                            type="text"
                            placeholder="Label (e.g., Material)"
                            value={spec.label}
                            onChange={(e) =>
                              handleEditSpecificationChange(
                                index,
                                "label",
                                e.target.value,
                              )
                            }
                            className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none"
                          />
                        </div>
                        <div className="flex-1">
                          <input
                            type="text"
                            placeholder="Value (e.g., Cotton)"
                            value={spec.value}
                            onChange={(e) =>
                              handleEditSpecificationChange(
                                index,
                                "value",
                                e.target.value,
                              )
                            }
                            className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none"
                          />
                        </div>
                        <button
                          type="button"
                          onClick={() => removeEditSpecification(index)}
                          className="p-2 text-red-500 hover:text-red-700"
                        >
                          ✕
                        </button>
                      </div>
                    ))}
                  </div>

                  {/* Tags & SEO */}
                  <div className="bg-white rounded-xl border border-gray-100 p-5 space-y-4">
                    <h3 className="font-semibold text-gray-800">Tags & SEO</h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Tags
                        </label>
                        <input
                          type="text"
                          value={editForm.tags.join(", ")}
                          onChange={handleEditTagsChange}
                          className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none"
                          placeholder="tag1, tag2, tag3"
                        />
                        <p className="text-xs text-gray-400 mt-1">
                          Separate tags with commas
                        </p>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Meta Title
                        </label>
                        <input
                          type="text"
                          name="seo.metaTitle"
                          value={editForm.seo.metaTitle}
                          onChange={handleEditChange}
                          maxLength={60}
                          className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none"
                          placeholder="Meta title"
                        />
                        <p className="text-xs text-gray-400 mt-1">
                          {editForm.seo.metaTitle?.length || 0}/60
                        </p>
                      </div>

                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Meta Description
                        </label>
                        <textarea
                          name="seo.metaDescription"
                          value={editForm.seo.metaDescription}
                          onChange={handleEditChange}
                          rows={2}
                          maxLength={160}
                          className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none resize-y"
                          placeholder="Meta description"
                        />
                        <p className="text-xs text-gray-400 mt-1">
                          {editForm.seo.metaDescription?.length || 0}/160
                        </p>
                      </div>
                    </div>
                  </div>
                </form>
              </>
            )}

            <div className="flex justify-end gap-3 px-5 py-4 bg-gray-50 border-t border-gray-100 flex-shrink-0">
              <button
                onClick={handleCancelEdit}
                disabled={editLoading || editFetching}
                className="px-4 py-2 rounded-lg border border-gray-200 text-gray-700 font-medium hover:bg-white disabled:opacity-60"
              >
                Cancel
              </button>
              <button
                onClick={handleEditSubmit}
                disabled={editLoading || editFetching}
                className="px-5 py-2 rounded-lg bg-teal-600 text-white font-semibold hover:bg-teal-700 disabled:opacity-60 min-w-28 flex items-center justify-center gap-2"
              >
                {editLoading ? (
                  <>
                    <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                        fill="none"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                      />
                    </svg>
                    Saving...
                  </>
                ) : (
                  "Save Changes"
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
