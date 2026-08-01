

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'https://qubanhygienecare.com';

export const getImageUrl = (url) => {
  if (!url) return '/images/placeholder.jpg';
  if (url.startsWith('http://') || url.startsWith('https://')) return url;
  if (url.startsWith('/uploads')) return `${BACKEND_URL}${url}`;
  return '/images/placeholder.jpg';
};

export const getProductImage = (product) => {
  const mainImage = product?.images?.find(img => img.isMain);
  const firstImage = product?.images?.[0];
  return getImageUrl(mainImage?.url || firstImage?.url);
};

export const getCategoryImage = (category) => {
  return getImageUrl(category?.image?.url);
};