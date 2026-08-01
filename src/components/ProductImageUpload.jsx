import { useState, useRef } from 'react';
import { X, Upload, Star } from 'lucide-react';

export default function ProductImageUpload({ 
  images = [], 
  onChange, 
  maxImages = 5,
  productId = null,
}) {
  const [uploading, setUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const fileInputRef = useRef(null);

  // Upload images to backend
  const uploadImages = async (files) => {
    if (images.length + files.length > maxImages) {
      alert(`You can upload maximum ${maxImages} images`);
      return;
    }

    setUploading(true);
    setUploadProgress(0);

    try {
      const formData = new FormData();
      for (const file of files) {
        formData.append('images', file);
      }

      // ✅ FIX: Check if productId exists, otherwise use direct upload
      // For new products (without ID), we'll use a different approach
      // We'll convert images to base64 and store in state
      if (!productId) {
        // For new products, read files as base64 and store locally
        const readerPromises = files.map((file) => {
          return new Promise((resolve) => {
            const reader = new FileReader();
            reader.onload = (e) => {
              resolve({
                url: e.target.result,
                publicId: `temp_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
                isMain: images.length === 0,
                displayOrder: images.length,
                file: file,
              });
            };
            reader.readAsDataURL(file);
          });
        });

        const newImages = await Promise.all(readerPromises);
        onChange([...images, ...newImages]);
        setUploadProgress(100);
        setUploading(false);
        return;
      }

      // If productId exists, upload to server
      const url = `/api/v1/upload/products/${productId}/images`;
      
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
        },
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: 'Upload failed' }));
        throw new Error(errorData.message || 'Upload failed');
      }

      const data = await response.json();
      
      if (data.success) {
        const newImages = data.data.images || [];
        onChange([...images, ...newImages]);
        setUploadProgress(100);
      } else {
        alert(data.message || 'Upload failed');
      }
    } catch (error) {
      alert(error.message || 'Failed to upload images');
    } finally {
      setUploading(false);
      setUploadProgress(0);
    }
  };

  // Handle file selection
  const handleFileSelect = (e) => {
    const files = Array.from(e.target.files);
    if (files.length > 0) {
      uploadImages(files);
    }
    e.target.value = ''; // Reset input
  };

  // Handle drop
  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      uploadImages(files);
    }
  };

  // Handle drag events
  const handleDragOver = (e) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setDragOver(false);
  };

  // Remove image
  const removeImage = async (index) => {
    const image = images[index];
    
    // If image has publicId and productId, delete from server
    if (image.publicId && productId && !image.publicId.startsWith('temp_')) {
      try {
        const response = await fetch(`/api/v1/upload/products/${productId}/images/${image.publicId}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
          },
        });
        
        if (!response.ok) {
          const errorData = await response.json().catch(() => ({ message: 'Delete failed' }));
          throw new Error(errorData.message || 'Delete failed');
        }
        
        const data = await response.json();
        if (!data.success) {
          alert(data.message || 'Failed to delete image');
          return;
        }
      } catch (error) {
        alert(error.message || 'Failed to delete image');
        return;
      }
    }

    const newImages = images.filter((_, i) => i !== index);
    
    // If main image removed, set first as main
    if (image.isMain && newImages.length > 0) {
      newImages[0].isMain = true;
    }
    
    onChange(newImages);
  };

  // Set as main image
  const setMainImage = async (index) => {
    const image = images[index];
    
    // If product exists and image is not temp, update on server
    if (productId && image.publicId && !image.publicId.startsWith('temp_')) {
      try {
        const response = await fetch(`/api/v1/upload/products/${productId}/images/${image.publicId}/main`, {
          method: 'PUT',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
          },
        });
        
        if (!response.ok) {
          const errorData = await response.json().catch(() => ({ message: 'Update failed' }));
          throw new Error(errorData.message || 'Update failed');
        }
        
        const data = await response.json();
        if (!data.success) {
          alert(data.message || 'Failed to update main image');
          return;
        }
      } catch (error) {
        alert(error.message || 'Failed to update main image');
        return;
      }
    }

    const newImages = images.map((img, i) => ({
      ...img,
      isMain: i === index,
    }));
    onChange(newImages);
  };

  return (
    <div className="space-y-4">
      {/* Upload Area */}
      <div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onClick={() => fileInputRef.current?.click()}
        className={`
          border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all
          ${dragOver ? 'border-teal-500 bg-teal-50' : 'border-gray-300 hover:border-teal-400'}
          ${images.length >= maxImages ? 'opacity-50 cursor-not-allowed' : ''}
          ${uploading ? 'opacity-50 cursor-wait' : ''}
        `}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          multiple
          className="hidden"
          onChange={handleFileSelect}
          disabled={images.length >= maxImages || uploading}
        />
        
        <div className="flex flex-col items-center gap-2">
          {uploading ? (
            <>
              <div className="w-12 h-12 border-4 border-teal-500 border-t-transparent rounded-full animate-spin" />
              <p className="text-gray-600 font-medium">Uploading... {uploadProgress}%</p>
              <div className="w-full max-w-xs h-2 bg-gray-200 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-teal-500 transition-all duration-300"
                  style={{ width: `${uploadProgress}%` }}
                />
              </div>
            </>
          ) : (
            <>
              <Upload className="w-12 h-12 text-gray-400" />
              <p className="text-gray-600 font-medium">
                {productId ? 'Drop images here or click to upload' : 'Select images (stored locally)'}
              </p>
              <p className="text-sm text-gray-400">
                PNG, JPG, WEBP (Max {maxImages} images, 5MB each)
              </p>
              <p className="text-xs text-gray-400">
                {productId ? 'First image will be main thumbnail' : 'Images will be uploaded when product is created'}
              </p>
            </>
          )}
        </div>
      </div>

      {/* Image Grid */}
      {images.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {images.map((img, index) => (
            <div
              key={index}
              className="relative group rounded-lg overflow-hidden border border-gray-200 bg-gray-50"
            >
              <img
                src={img.url}
                alt={`Product ${index + 1}`}
                className="w-full h-32 object-cover"
              />
              
              {/* Main/Thumbnail Badge */}
              {img.isMain && (
                <div className="absolute top-2 left-2 bg-teal-600 text-white text-xs px-2 py-0.5 rounded-full flex items-center gap-1">
                  <Star className="w-3 h-3" />
                  Main
                </div>
              )}
              
              {/* Image Order Badge */}
              <div className="absolute bottom-2 left-2 bg-black/60 text-white text-xs px-2 py-0.5 rounded-full">
                {index + 1}/{images.length}
              </div>
              
              {/* Overlay Actions */}
              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-all flex items-center justify-center gap-2">
                {/* Set as Main Button */}
                {!img.isMain && (
                  <button
                    onClick={() => setMainImage(index)}
                    className="p-1.5 bg-teal-600 hover:bg-teal-700 rounded-full text-white transition-colors"
                    title="Set as main image"
                  >
                    <Star className="w-4 h-4" />
                  </button>
                )}
                
                {/* Delete Button */}
                <button
                  onClick={() => removeImage(index)}
                  className="p-1.5 bg-red-600 hover:bg-red-700 rounded-full text-white transition-colors"
                  title="Remove image"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}