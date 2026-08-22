import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { adminService } from "../../../services/admin";
import toast from "react-hot-toast";

// ─── Constants ────────────────────────────────────────────────────────────────
const MAX_FILE_SIZE_MB = 5;
const ALLOWED_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp"];

// ─── Helper: convert File → base64 string ────────────────────────────────────
const fileToBase64 = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result);
    reader.onerror = () => reject(new Error("Failed to read file"));
    reader.readAsDataURL(file);
  });

// ─── Component ────────────────────────────────────────────────────────────────
export default function CategoryEdit() {
  const navigate = useNavigate();
  const { id } = useParams();

  const [loading, setLoading] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);
  const [error, setError] = useState("");
  const [categories, setCategories] = useState([]);

  // Image state
  const [existingImageUrl, setExistingImageUrl] = useState(null); // URL already saved in DB
  const [imagePreview, setImagePreview] = useState(null); // For <img> preview
  const [imageBase64, setImageBase64] = useState(null); // New base64 to upload
  const [imageChanged, setImageChanged] = useState(false); // Did user change the image?
  const [imageError, setImageError] = useState("");

  const [form, setForm] = useState({
    name: "",
    description: "",
    parent: "",
    displayOrder: 0,
    isFeatured: false,
    isActive: true,
    seo: {
      metaTitle: "",
      metaDescription: "",
      keywords: [],
    },
  });

  useEffect(() => {
    Promise.all([fetchCategory(), fetchCategories()]);
  }, [id]);

  // ─── Fetch current category data ───────────────────────────────────────────
  const fetchCategory = async () => {
    try {
      const response = await adminService.getCategoryById(id);
      const cat = response.data?.category;
      if (!cat) throw new Error("Category not found");

      setForm({
        name: cat.name || "",
        description: cat.description || "",
        parent: cat.parent?._id || cat.parent || "",
        displayOrder: cat.displayOrder ?? 0,
        isFeatured: cat.isFeatured ?? false,
        isActive: cat.isActive ?? true,
        seo: {
          metaTitle: cat.seo?.metaTitle || "",
          metaDescription: cat.seo?.metaDescription || "",
          keywords: cat.seo?.keywords || [],
        },
      });

      // Set existing image URL (already a full URL from backend)
      if (cat.image?.url) {
        setExistingImageUrl(cat.image.url);
        setImagePreview(cat.image.url);
      }
    } catch (err) {
      console.error("Error fetching category:", err);
      toast.error("Failed to load category");
      navigate("/admin/categories");
    }
  };

  // ─── Fetch all categories for parent dropdown ───────────────────────────────
  const fetchCategories = async () => {
    try {
      setPageLoading(true);
      const response = await adminService.getCategories();
      setCategories(response.data?.categories || []);
    } catch (err) {
      console.error("Error fetching categories:", err);
    } finally {
      setPageLoading(false);
    }
  };

  // ─── Form field change handler ──────────────────────────────────────────────
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (name.startsWith("seo.")) {
      const seoField = name.split(".")[1];
      setForm((prev) => ({
        ...prev,
        seo: { ...prev.seo, [seoField]: value },
      }));
      return;
    }

    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  // ─── Image selection handler ────────────────────────────────────────────────
  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setImageError("");

    if (!ALLOWED_TYPES.includes(file.type)) {
      setImageError("Only JPG, PNG, and WEBP images are allowed");
      return;
    }

    if (file.size > MAX_FILE_SIZE_MB * 1024 * 1024) {
      setImageError(`Image must be smaller than ${MAX_FILE_SIZE_MB}MB`);
      return;
    }

    try {
      const base64 = await fileToBase64(file);
      setImageBase64(base64);
      setImagePreview(base64);
      setImageChanged(true);
    } catch {
      setImageError("Failed to process image. Please try again.");
    }

    e.target.value = "";
  };

  // ─── Remove image ───────────────────────────────────────────────────────────
  const removeImage = () => {
    setImageBase64(null);
    setImagePreview(null);
    setImageChanged(true); // Signal that image was explicitly removed
    setExistingImageUrl(null);
    setImageError("");
  };

  // ─── Reset to existing image ────────────────────────────────────────────────
  const resetToExistingImage = () => {
    setImageBase64(null);
    setImagePreview(existingImageUrl);
    setImageChanged(false);
    setImageError("");
  };

  // ─── Validation ─────────────────────────────────────────────────────────────
  const validate = () => {
    if (!form.name.trim()) return "Category name is required";
    if (form.name.trim().length < 2)
      return "Category name must be at least 2 characters";
    if (form.name.length > 100)
      return "Category name cannot exceed 100 characters";
    return null;
  };

  // ─── Submit ─────────────────────────────────────────────────────────────────
  const handleSubmit = async (e) => {
    e.preventDefault();

    const validationError = validate();
    if (validationError) {
      setError(validationError);
      toast.error(validationError);
      return;
    }

    setError("");
    setLoading(true);

    try {
      const updateData = {
        name: form.name.trim(),
        description: form.description?.trim() || "",
        parent: form.parent || null,
        displayOrder: parseInt(form.displayOrder) || 0,
        isFeatured: form.isFeatured || false,
        isActive: form.isActive,
        seo: {
          metaTitle: form.seo.metaTitle?.trim() || "",
          metaDescription: form.seo.metaDescription?.trim() || "",
          keywords: form.seo.keywords?.filter((k) => k.trim()) || [],
        },
      };

      // ✅ KEY FIX: Only send image if it changed
      if (imageChanged) {
        if (imageBase64) {
          // New image selected → send base64 string
          updateData.image = imageBase64;
        } else {
          // Image explicitly removed → send null to clear it
          updateData.image = null;
        }
      }
      // If imageChanged is false, don't include image in payload at all
      // (backend won't touch the existing image)

      await adminService.updateCategory(id, updateData);
      toast.success("Category updated successfully! ✅");
      navigate("/admin/categories");
    } catch (err) {
      const message = err.response?.data?.message || "Something went wrong";
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
    <div className="max-w-5xl mx-auto">
      {/* Back button */}
      <button
        onClick={() => navigate("/admin/categories")}
        className="flex items-center gap-2 text-gray-400 hover:text-gray-600 transition-colors mb-6"
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
            d="M10 19l-7-7m0 0l7-7m-7 7h18"
          />
        </svg>
        Back to Categories
      </button>

      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Edit Category</h1>
        <p className="text-sm text-gray-500 mt-1">
          Update category details, image and SEO
        </p>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-600 rounded-lg text-sm">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* ── General Information ── */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 sm:p-8 space-y-6">
          <h2 className="text-lg font-semibold text-gray-800 border-b border-gray-100 pb-3">
            General Information
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                maxLength={100}
                className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none transition-all"
              />
              <p className="text-xs text-gray-400 mt-1">
                {form.name.length}/100 characters
              </p>
            </div>

            {/* Parent Category */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Parent Category
              </label>
              <select
                name="parent"
                value={form.parent}
                onChange={handleChange}
                className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none transition-all bg-white"
              >
                <option value="">None (Top Level)</option>
                {categories
                  .filter((cat) => cat._id !== id) // Exclude self
                  .map((cat) => (
                    <option key={cat._id} value={cat._id}>
                      {"— ".repeat(Math.max(0, (cat.level || 1) - 1))}
                      {cat.name}
                    </option>
                  ))}
              </select>
            </div>

            {/* Display Order */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Display Order
              </label>
              <input
                type="number"
                name="displayOrder"
                value={form.displayOrder}
                onChange={handleChange}
                min="0"
                className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none transition-all"
              />
            </div>

            {/* Toggles row */}
            <div className="flex flex-col gap-3 pt-1">
              {/* Featured */}
              <div className="flex items-center gap-3">
                <label className="text-sm font-medium text-gray-700 w-28">
                  Featured
                </label>
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
                <span className="text-sm text-gray-500">
                  {form.isFeatured ? "Yes" : "No"}
                </span>
              </div>

              {/* Active */}
              <div className="flex items-center gap-3">
                <label className="text-sm font-medium text-gray-700 w-28">
                  Active
                </label>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    name="isActive"
                    checked={form.isActive}
                    onChange={handleChange}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:bg-green-500 peer-focus:ring-2 peer-focus:ring-green-400 after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:after:translate-x-full" />
                </label>
                <span className="text-sm text-gray-500">
                  {form.isActive ? "Active" : "Inactive"}
                </span>
              </div>
            </div>

            {/* Description */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <textarea
                name="description"
                value={form.description}
                onChange={handleChange}
                rows={3}
                maxLength={500}
                className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none transition-all resize-y"
              />
              <p className="text-xs text-gray-400 mt-1">
                {form.description?.length || 0}/500 characters
              </p>
            </div>
          </div>
        </div>

        {/* ── Category Image ── */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 sm:p-8">
          <h2 className="text-lg font-semibold text-gray-800 border-b border-gray-100 pb-3 mb-6">
            Category Image
          </h2>

          <div className="flex flex-col sm:flex-row items-start gap-6">
            {/* Preview */}
            <div className="flex-shrink-0">
              {imagePreview ? (
                <div className="relative w-40 h-40 rounded-xl overflow-hidden border border-gray-200 shadow-sm">
                  <img
                    src={imagePreview}
                    alt="Category"
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.style.display = "none";
                    }}
                  />
                  <button
                    type="button"
                    onClick={removeImage}
                    className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1.5 hover:bg-red-600 transition shadow"
                  >
                    <svg
                      className="w-3.5 h-3.5"
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
              ) : (
                <div className="w-40 h-40 rounded-xl border-2 border-dashed border-gray-300 flex flex-col items-center justify-center bg-gray-50 text-gray-400">
                  <svg
                    className="w-10 h-10 mb-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="1.5"
                      d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                  <span className="text-xs text-center">No image</span>
                </div>
              )}
            </div>

            {/* Controls */}
            <div className="flex flex-col gap-3">
              <label className="cursor-pointer inline-flex items-center gap-2 px-4 py-2.5 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors text-sm font-medium w-fit">
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"
                  />
                </svg>
                {imagePreview ? "Change Image" : "Upload Image"}
                <input
                  type="file"
                  accept="image/jpeg,image/jpg,image/png,image/webp"
                  onChange={handleImageChange}
                  className="hidden"
                />
              </label>

              {/* Show reset button only if user changed image and there was an existing one */}
              {imageChanged && existingImageUrl && (
                <button
                  type="button"
                  onClick={resetToExistingImage}
                  className="inline-flex items-center gap-2 px-4 py-2.5 border border-gray-300 text-gray-600 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium w-fit"
                >
                  ↩ Restore original image
                </button>
              )}

              <div className="text-xs text-gray-400 space-y-0.5">
                <p>• Recommended size: 400×400px</p>
                <p>• Formats: JPG, PNG, WEBP</p>
                <p>• Max size: {MAX_FILE_SIZE_MB}MB</p>
              </div>

              {imageError && (
                <p className="text-xs text-red-500 font-medium">{imageError}</p>
              )}

              {imageChanged && imageBase64 && (
                <p className="text-xs text-amber-600 font-medium flex items-center gap-1">
                  ⚠ New image selected — will be saved on update
                </p>
              )}

              {imageChanged && !imageBase64 && (
                <p className="text-xs text-red-500 font-medium flex items-center gap-1">
                  ⚠ Image removed — will be cleared on update
                </p>
              )}
            </div>
          </div>
        </div>

        {/* ── SEO ── */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 sm:p-8 space-y-6">
          <h2 className="text-lg font-semibold text-gray-800 border-b border-gray-100 pb-3">
            Search Engine Optimization
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Meta Title
              </label>
              <input
                type="text"
                name="seo.metaTitle"
                value={form.seo.metaTitle}
                onChange={handleChange}
                maxLength={60}
                className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none transition-all"
              />
              <p className="text-xs text-gray-400 mt-1">
                {form.seo.metaTitle?.length || 0}/60 characters
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Keywords
              </label>
              <input
                type="text"
                name="seo.keywords"
                value={form.seo.keywords?.join(", ") || ""}
                onChange={(e) => {
                  const keywords = e.target.value
                    .split(",")
                    .map((k) => k.trim())
                    .filter(Boolean);
                  setForm((prev) => ({
                    ...prev,
                    seo: { ...prev.seo, keywords },
                  }));
                }}
                className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none transition-all"
              />
              <p className="text-xs text-gray-400 mt-1">Separate with commas</p>
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Meta Description
              </label>
              <textarea
                name="seo.metaDescription"
                value={form.seo.metaDescription}
                onChange={handleChange}
                rows={2}
                maxLength={160}
                className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none transition-all resize-y"
              />
              <p className="text-xs text-gray-400 mt-1">
                {form.seo.metaDescription?.length || 0}/160 characters
              </p>
            </div>
          </div>
        </div>

        {/* ── Submit ── */}
        <div className="flex items-center gap-4 pt-4 border-t border-gray-100">
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-2.5 bg-teal-600 text-white font-semibold rounded-lg hover:bg-teal-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {loading ? (
              <>
                <svg
                  className="animate-spin h-4 w-4"
                  viewBox="0 0 24 24"
                  fill="none"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
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
              <>
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M5 13l4 4L19 7"
                  />
                </svg>
                Save Changes
              </>
            )}
          </button>

          <button
            type="button"
            onClick={() => navigate("/admin/categories")}
            className="px-6 py-2.5 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
