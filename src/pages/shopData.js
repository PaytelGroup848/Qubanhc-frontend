// Simulates a database – admin can edit this file or later replace with API
export const categories = [
  { id: 1, name: 'Diapers', slug: 'diapers', icon: '🩲' },
  { id: 2, name: 'Adult Diapers', slug: 'adult-diapers', icon: '👴' },
  { id: 3, name: 'Wipes', slug: 'wipes', icon: '🧻' },
  { id: 4, name: 'Sanitary Pads', slug: 'sanitary-pads', icon: '🌸' },
  { id: 5, name: 'Adult Care', slug: 'adult-care', icon: '❤️' },
];

export const allProducts = [
  // Wipes
  { id: 101, name: 'Alcohol-Free Baby Wipes (80pcs)', categorySlug: 'wipes', price: 249, originalPrice: 299, rating: 4.5, reviews: 98, image: '/images/wipes.jpg', type: 'baby', bestSeller: true, inStock: true },
  { id: 102, name: 'Disinfectant Wipes (50pcs)', categorySlug: 'wipes', price: 199, originalPrice: 249, rating: 4.6, reviews: 156, image: '/images/disinfect-wipes.jpg', type: 'surface', bestSeller: false, inStock: true },
  { id: 103, name: 'Biodegradable Wipes (3x80)', categorySlug: 'wipes', price: 349, originalPrice: 399, rating: 4.7, reviews: 203, image: '/images/bio-wipes.jpg', type: 'eco', bestSeller: true, inStock: true },

  // Sanitary Pads
  { id: 201, name: 'Ultra Thin Sanitary Pads (10pcs)', categorySlug: 'sanitary-pads', price: 149, originalPrice: 199, rating: 4.7, reviews: 345, image: '/images/pads.jpg', type: 'regular', bestSeller: true, inStock: true },
  { id: 202, name: 'Heavy Flow Pads (8pcs)', categorySlug: 'sanitary-pads', price: 179, originalPrice: 229, rating: 4.8, reviews: 412, image: '/images/heavy-pads.jpg', type: 'heavy', bestSeller: false, inStock: true },
  { id: 203, name: 'Organic Cotton Pads (12pcs)', categorySlug: 'sanitary-pads', price: 249, originalPrice: 299, rating: 4.9, reviews: 567, image: '/images/organic-pads.jpg', type: 'organic', bestSeller: true, inStock: true },
  { id: 204, name: 'Pantyliners (30pcs)', categorySlug: 'sanitary-pads', price: 99, originalPrice: 129, rating: 4.4, reviews: 234, image: '/images/pantyliner.jpg', type: 'liner', bestSeller: false, inStock: true },

  // Diapers
  { id: 301, name: 'Premium Adult Diaper (XL, 10pcs)', categorySlug: 'adult-diapers', price: 899, originalPrice: 1099, rating: 4.8, reviews: 234, image: '/images/adult-pullup.jpg', type: 'adult', bestSeller: true, inStock: true },
  { id: 302, name: 'Baby Dry Diapers (S, 72pcs)', categorySlug: 'diapers', price: 699, originalPrice: 899, rating: 4.7, reviews: 198, image: '/images/baby-diaper.jpg', type: 'baby', bestSeller: false, inStock: true },
  // ... add more as needed
];