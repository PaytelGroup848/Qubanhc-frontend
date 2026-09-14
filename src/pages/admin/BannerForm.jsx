import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";
import bannerService from "../../services/banner";

const BannerForm = ({ mode, banner, onSuccess, onCancel }) => {
  const [formData, setFormData] = useState({
    title: "",
    subtitle: "",
    description: "",
    type: "hero",
    position: 0,
    ctaText: "",
    ctaLink: "",
    isActive: true,
    startDate: new Date().toISOString().split("T")[0],
    endDate: "",
    image: null,
    imageAlt: "",
  });
  const [loading, setLoading] = useState(false);
  const [imagePreview, setImagePreview] = useState("");

  useEffect(() => {
    if (mode === "edit" && banner) {
      setFormData({
        title: banner.title || "",
        subtitle: banner.subtitle || "",
        description: banner.description || "",
        type: banner.type || "hero",
        position: banner.position || 0,
        ctaText: banner.ctaText || "",
        ctaLink: banner.ctaLink || "",
        isActive: banner.isActive !== undefined ? banner.isActive : true,
        startDate: banner.startDate
          ? new Date(banner.startDate).toISOString().split("T")[0]
          : new Date().toISOString().split("T")[0],
        endDate: banner.endDate
          ? new Date(banner.endDate).toISOString().split("T")[0]
          : "",
        image: null,
        imageAlt: banner.imageAlt || banner.title || "",
      });
      if (banner.image) {
        setImagePreview(banner.image);
      }
    }
  }, [mode, banner]);

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
      setFormData((prev) => ({ ...prev, image: file }));
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.title) {
      toast.error("Title is required");
      return;
    }

    if (!formData.image && mode === "create") {
      toast.error("Image is required");
      return;
    }

    setLoading(true);

    try {
      // Create FormData
      const formDataToSend = new FormData();

      // Append all text fields
      formDataToSend.append("title", formData.title);
      formDataToSend.append("subtitle", formData.subtitle || "");
      formDataToSend.append("description", formData.description || "");
      formDataToSend.append("type", formData.type);
      formDataToSend.append("position", String(formData.position));
      formDataToSend.append("ctaText", formData.ctaText || "");
      formDataToSend.append("ctaLink", formData.ctaLink || "");
      formDataToSend.append("isActive", String(formData.isActive));
      formDataToSend.append("startDate", formData.startDate);
      formDataToSend.append("imageAlt", formData.imageAlt || "customImage");

      if (formData.endDate) {
        formDataToSend.append("endDate", formData.endDate);
      }

      // Append image file if exists
      if (formData.image) {
        formDataToSend.append("image", formData.image);
      }

      // Log FormData contents for debugging
      for (let pair of formDataToSend.entries()) {
        console.log(pair[0] + ": " + pair[1]);
      }

      let response;
      if (mode === "create") {
        response = await bannerService.createBanner(formDataToSend);
      } else {
        response = await bannerService.updateBanner(banner._id, formDataToSend);
      }

      if (response.success) {
        toast.success(
          mode === "create"
            ? "Banner created successfully"
            : "Banner updated successfully",
        );
        onSuccess();
      }
    } catch (error) {
      console.error("Error saving banner:", error);
      toast.error(error.response?.data?.message || "Failed to save banner");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-h-[90vh] overflow-y-auto p-6">
      <h2 className="mb-6 text-2xl font-bold text-gray-900">
        {mode === "create" ? "Create New Banner" : "Edit Banner"}
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
              Subtitle
            </label>
            <input
              type="text"
              name="subtitle"
              value={formData.subtitle}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Description
          </label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows="3"
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500"
          />
        </div>

        {/* <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Type
            </label>
            <select
              name="type"
              value={formData.type}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500"
            >
              <option value="hero">Hero</option>
              <option value="promotional">Promotional</option>
            </select>
          </div>

       
        </div> */}

        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Position (lower = higher priority)
            </label>
            <input
              type="number"
              name="position"
              value={formData.position}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Button Text
            </label>
            <input
              type="text"
              name="ctaText"
              value={formData.ctaText}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Redirect Link (by clicking button)
            </label>
            <input
              type="text"
              name="ctaLink"
              value={formData.ctaLink}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
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

          {/* <div>
            <label className="block text-sm font-medium text-gray-700">
              Start Date
            </label>
            <input
              type="date"
              name="startDate"
              value={formData.startDate}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500"
            />
          </div> */}

          {/* <div>
            <label className="block text-sm font-medium text-gray-700">
              End Date (Optional)
            </label>
            <input
              type="date"
              name="endDate"
              value={formData.endDate}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500"
            />
          </div> */}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Banner Image {mode === "create" && "*"}
          </label>
          <input
            type="file"
            name="image"
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

        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            name="isActive"
            checked={formData.isActive}
            onChange={handleChange}
            className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
          />
          <label className="text-sm font-medium text-gray-700">Active</label>
        </div>

        <div className="flex justify-end gap-3 pt-4">
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
                ? "Create Banner"
                : "Update Banner"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default BannerForm;
