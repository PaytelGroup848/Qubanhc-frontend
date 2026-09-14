import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";
import blogService from "../services/blog";

const DEFAULT_CATEGORIES = [
  "Baby-Diaper",
  "Baby-Wipes",
  "Adult-Diapers",
  "sanitary-pads",
  "others",
];

const BlogForm = ({ mode, blog, categories = [], onSuccess, onCancel }) => {
  const [formData, setFormData] = useState({
    title: "",
    excerpt: "Qubanhc",
    content: "",
    category: "",
    tags: "",
    readTime: 5,
    isPublished: true,
    isFeatured: false,
    publishedAt: new Date().toISOString().split("T")[0],
    seoTitle: "",
    seoDescription: "",
    imageAlt: "blog-image",
    featuredImage: null,
  });
  const [loading, setLoading] = useState(false);
  const [imagePreview, setImagePreview] = useState("");

  // Use default categories if none provided
  const availableCategories = DEFAULT_CATEGORIES;

  useEffect(() => {
    if (mode === "edit" && blog) {
      setFormData({
        title: blog.title || "",
        excerpt: blog.excerpt || "Qubanhc",
        content: blog.content || "",
        category: blog.category || "",
        tags: blog.tags ? blog.tags.join(", ") : "",
        readTime: blog.readTime || 5,
        isPublished: blog.isPublished !== undefined ? blog.isPublished : true,
        isFeatured: blog.isFeatured !== undefined ? blog.isFeatured : false,
        publishedAt: blog.publishedAt
          ? new Date(blog.publishedAt).toISOString().split("T")[0]
          : new Date().toISOString().split("T")[0],
        seoTitle: blog.seoTitle || "",
        seoDescription: blog.seoDescription || "",
        imageAlt: blog.imageAlt || "blog-image",
        featuredImage: null,
      });
      if (blog.featuredImage) {
        setImagePreview(blog.featuredImage);
      }
    }
  }, [mode, blog]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData((prev) => ({ ...prev, featuredImage: file }));
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !formData.title ||
      !formData.excerpt ||
      !formData.content ||
      !formData.category
    ) {
      toast.error("Please fill in all required fields");
      return;
    }

    if (!formData.featuredImage && mode === "create") {
      toast.error("Featured image is required");
      return;
    }

    setLoading(true);

    try {
      const formDataToSend = new FormData();
      Object.keys(formData).forEach((key) => {
        if (key === "featuredImage") {
          if (formData[key]) {
            formDataToSend.append(key, formData[key]);
          }
        } else if (formData[key] !== null && formData[key] !== undefined) {
          formDataToSend.append(key, formData[key]);
        }
      });

      let response;
      if (mode === "create") {
        response = await blogService.createBlog(formDataToSend);
      } else {
        response = await blogService.updateBlog(blog._id, formDataToSend);
      }

      if (response.success) {
        toast.success(
          mode === "create"
            ? "Blog created successfully"
            : "Blog updated successfully",
        );
        onSuccess();
      }
    } catch (error) {
      console.error("Error saving blog:", error);
      toast.error(error.response?.data?.message || "Failed to save blog");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6">
      <h2 className="mb-6 text-2xl font-bold text-gray-900">
        {mode === "create" ? "Create New Blog" : "Edit Blog"}
      </h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Title *
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Category *
            </label>
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500"
              required
            >
              <option value="">Select Category</option>
              {availableCategories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Rest of the form remains the same */}
        {/* <div>
          <label className="block text-sm font-medium text-gray-700">
            Short Summary *
          </label>
          <textarea
            name="excerpt"
            value={formData.excerpt}
            onChange={handleChange}
            rows="2"
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500"
          />
        </div> */}

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Content *
          </label>
          <textarea
            name="content"
            value={formData.content}
            onChange={handleChange}
            rows="10"
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500"
            required
          />
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Tags (comma separated)
            </label>
            <input
              type="text"
              name="tags"
              value={formData.tags}
              onChange={handleChange}
              placeholder="e.g. Baby-Diaper, Baby-Wipes, sanitary-pads"
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500"
            />
          </div>

          {/* <div>
            <label className="block text-sm font-medium text-gray-700">
              Read Time (minutes)
            </label>
            <input
              type="number"
              name="readTime"
              value={formData.readTime}
              onChange={handleChange}
              min="1"
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500"
            />
          </div> */}

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Publish Date
            </label>
            <input
              type="date"
              name="publishedAt"
              value={formData.publishedAt}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              SEO Title
            </label>
            <input
              type="text"
              name="seoTitle"
              value={formData.seoTitle}
              onChange={handleChange}
              maxLength="60"
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500"
            />
            <p className="mt-1 text-xs text-gray-500">
              {formData.seoTitle.length}/60 characters
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              SEO Description
            </label>
            <input
              type="text"
              name="seoDescription"
              value={formData.seoDescription}
              onChange={handleChange}
              maxLength="160"
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500"
            />
            <p className="mt-1 text-xs text-gray-500">
              {formData.seoDescription.length}/160 characters
            </p>
          </div>
        </div>

        {/* <div>
          <label className="block text-sm font-medium text-gray-700">
            Image Alt Text
          </label>
          <input
            type="text"
            name="imageAlt"
            value={formData.imageAlt}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500"
          />
        </div> */}

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Featured Image {mode === "create" && "*"}
          </label>
          <input
            type="file"
            name="featuredImage"
            accept="image/*"
            onChange={handleFileChange}
            className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:rounded-md file:border-0 file:bg-indigo-50 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-indigo-700 hover:file:bg-indigo-100"
          />
          {imagePreview && (
            <div className="mt-2">
              <img
                src={imagePreview}
                alt="Preview"
                className="h-32 w-48 rounded-lg object-cover"
              />
            </div>
          )}
        </div>

        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              name="isPublished"
              checked={formData.isPublished}
              onChange={handleChange}
              className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
            />
            <label className="text-sm font-medium text-gray-700">
              Publish immediately
            </label>
          </div>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              name="isFeatured"
              checked={formData.isFeatured}
              onChange={handleChange}
              className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
            />
            <label className="text-sm font-medium text-gray-700">
              Feature this post
            </label>
          </div>
        </div>

        <div className="flex justify-end gap-3  pt-4">
          <button
            type="button"
            onClick={onCancel}
            className="rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 disabled:opacity-50"
          >
            {loading
              ? "Saving..."
              : mode === "create"
                ? "Create Blog"
                : "Update Blog"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default BlogForm;
