// ================================================================
//  ALL ADMIN DUMMY DATA – matches real API response shapes
// ================================================================

// ---------- Sub‑Admins ----------
export const subAdminsList = [
  { id: 1, name: 'Ravi Kumar', email: 'ravi@admin.com', role: 'Product Manager', status: 'Active', joined: '2025-01-10' },
  { id: 2, name: 'Sneha Reddy', email: 'sneha@admin.com', role: 'Order Manager', status: 'Active', joined: '2025-02-14' },
  { id: 3, name: 'Amit Patel', email: 'amit@admin.com', role: 'Support Lead', status: 'Inactive', joined: '2025-03-01' },
  { id: 4, name: 'Kavita Sharma', email: 'kavita@admin.com', role: 'Content Editor', status: 'Active', joined: '2025-04-20' },
  { id: 5, name: 'Vikram Singh', email: 'vikram@admin.com', role: 'Marketing', status: 'Pending', joined: '2025-05-05' },
];

// ---------- Vendors ----------
export const vendorsList = [
  { id: 1, name: 'Fashion Hub', email: 'contact@fashionhub.com', phone: '+91 98765 43210', productsCount: 124, status: 'Active', joined: '2025-01-15' },
  { id: 2, name: 'Electro World', email: 'support@electroworld.in', phone: '+91 87654 32109', productsCount: 89, status: 'Active', joined: '2025-02-20' },
  { id: 3, name: 'Home Essentials', email: 'hello@homeessentials.com', phone: '+91 76543 21098', productsCount: 56, status: 'Pending', joined: '2025-04-10' },
  { id: 4, name: 'Sporty Life', email: 'info@sportylife.in', phone: '+91 65432 10987', productsCount: 43, status: 'Suspended', joined: '2025-03-12' },
  { id: 5, name: 'Book Bazaar', email: 'books@bookbazaar.com', phone: '+91 54321 09876', productsCount: 210, status: 'Active', joined: '2024-12-01' },
  { id: 6, name: 'Gadget Garage', email: 'hello@gadgetgarage.com', phone: '+91 43210 98765', productsCount: 78, status: 'Pending', joined: '2025-05-18' },
];

// ---------- Products ----------
export const productsList = [
  { id: 101, name: 'Running Shoes', category: 'Footwear', vendor: 'Fashion Hub', price: '₹2,499', stock: 150, status: 'Active' },
  { id: 102, name: 'Leather Jacket', category: 'Clothing', vendor: 'Fashion Hub', price: '₹4,999', stock: 30, status: 'Active' },
  { id: 103, name: 'Wireless Earbuds', category: 'Electronics', vendor: 'Electro World', price: '₹2,999', stock: 0, status: 'Out of Stock' },
  { id: 104, name: 'Coffee Maker', category: 'Kitchen', vendor: 'Home Essentials', price: '₹3,499', stock: 25, status: 'Active' },
  { id: 105, name: 'Yoga Mat', category: 'Sports', vendor: 'Sporty Life', price: '₹999', stock: 200, status: 'Active' },
  { id: 106, name: 'Novel – The Alchemist', category: 'Books', vendor: 'Book Bazaar', price: '₹499', stock: 500, status: 'Active' },
  { id: 107, name: 'Smart Watch', category: 'Electronics', vendor: 'Gadget Garage', price: '₹7,999', stock: 12, status: 'Pending' },
];

// ---------- Orders ----------
export const ordersList = [
  { id: '#1001', customer: 'Rahul Sharma', email: 'rahul@example.com', amount: '₹2,499', status: 'Delivered', date: '2025-06-05', vendor: 'Fashion Hub' },
  { id: '#1002', customer: 'Priya Patel', email: 'priya@example.com', amount: '₹1,899', status: 'Processing', date: '2025-06-05', vendor: 'Electro World' },
  { id: '#1003', customer: 'Amit Singh', email: 'amit@example.com', amount: '₹4,299', status: 'Shipped', date: '2025-06-04', vendor: 'Home Essentials' },
  { id: '#1004', customer: 'Neha Gupta', email: 'neha@example.com', amount: '₹999', status: 'Pending', date: '2025-06-04', vendor: 'Sporty Life' },
  { id: '#1005', customer: 'Vikram Joshi', email: 'vikram@example.com', amount: '₹3,599', status: 'Delivered', date: '2025-06-03', vendor: 'Book Bazaar' },
  { id: '#1006', customer: 'Ananya Reddy', email: 'ananya@example.com', amount: '₹2,199', status: 'Delivered', date: '2025-06-03', vendor: 'Gadget Garage' },
  { id: '#1007', customer: 'Rohan Mehta', email: 'rohan@example.com', amount: '₹5,499', status: 'Processing', date: '2025-06-02', vendor: 'Fashion Hub' },
  { id: '#1008', customer: 'Kavita Iyer', email: 'kavita@example.com', amount: '₹1,299', status: 'Pending', date: '2025-06-01', vendor: 'Home Essentials' },
];

// ---------- Customers ----------
export const customersList = [
  { id: 1, name: 'Rahul Sharma', email: 'rahul@example.com', phone: '+91 98765 11111', orders: 12, totalSpent: '₹25,450', joined: '2025-01-05' },
  { id: 2, name: 'Priya Patel', email: 'priya@example.com', phone: '+91 87654 22222', orders: 8, totalSpent: '₹18,230', joined: '2025-02-14' },
  { id: 3, name: 'Amit Singh', email: 'amit@example.com', phone: '+91 76543 33333', orders: 5, totalSpent: '₹9,870', joined: '2025-03-22' },
  { id: 4, name: 'Neha Gupta', email: 'neha@example.com', phone: '+91 65432 44444', orders: 15, totalSpent: '₹32,100', joined: '2024-12-18' },
  { id: 5, name: 'Vikram Joshi', email: 'vikram@example.com', phone: '+91 54321 55555', orders: 3, totalSpent: '₹5,990', joined: '2025-05-01' },
];

// ---------- Commissions ----------
export const commissionsData = {
  globalCommission: 12,
  vendorCommissions: [
    { vendorId: 1, name: 'Fashion Hub', commission: 10 },
    { vendorId: 2, name: 'Electro World', commission: 15 },
    { vendorId: 3, name: 'Home Essentials', commission: 12 },
    { vendorId: 4, name: 'Sporty Life', commission: 8 },
    { vendorId: 5, name: 'Book Bazaar', commission: 12 },
    { vendorId: 6, name: 'Gadget Garage', commission: 15 },
  ],
};

// ---------- Reports ----------
export const reportsSummary = {
  totalSales: '₹ 1,56,45,000',
  totalOrders: 3240,
  topCategory: 'Electronics',
  avgOrderValue: '₹ 4,827',
};

// ---------- Settings ----------
export const settingsData = {
  siteName: 'ShopHub',
  multiVendorEnabled: false,
  globalCommission: 12,
  supportEmail: 'support@shophub.com',
  paymentGateways: ['Razorpay', 'Stripe'],
};

// ---------- Dashboard KPIs ----------
export const dashboardKPIs = [
  { title: 'Total Revenue', value: '₹12,56,789', change: '+12.5%', icon: '💰' },
  { title: 'Total Orders', value: '342', change: '+8.2%', icon: '🛒' },
  { title: 'Active Vendors', value: '18', change: '+2', icon: '🏪' },
  { title: 'Total Customers', value: '1,240', change: '+56', icon: '👥' },
];

// ---------- Recent Orders (for dashboard) ----------
export const recentOrders = [
  { id: '#1001', customer: 'Rahul Sharma', email: 'rahul@example.com', amount: '₹2,499', status: 'Delivered', date: '2025-06-05' },
  { id: '#1002', customer: 'Priya Patel', email: 'priya@example.com', amount: '₹1,899', status: 'Processing', date: '2025-06-05' },
  { id: '#1003', customer: 'Amit Singh', email: 'amit@example.com', amount: '₹4,299', status: 'Shipped', date: '2025-06-04' },
  { id: '#1004', customer: 'Neha Gupta', email: 'neha@example.com', amount: '₹999', status: 'Pending', date: '2025-06-04' },
  { id: '#1005', customer: 'Vikram Joshi', email: 'vikram@example.com', amount: '₹3,599', status: 'Delivered', date: '2025-06-03' },
  { id: '#1006', customer: 'Ananya Reddy', email: 'ananya@example.com', amount: '₹2,199', status: 'Delivered', date: '2025-06-03' },
  { id: '#1007', customer: 'Rohan Mehta', email: 'rohan@example.com', amount: '₹5,499', status: 'Processing', date: '2025-06-02' },
];

// ---------- Top Vendors (for dashboard) ----------
export const topVendors = [
  { name: 'Fashion Hub', revenue: '₹4,56,200', products: 124, growth: '+15%' },
  { name: 'Electro World', revenue: '₹3,78,500', products: 89, growth: '+9%' },
  { name: 'Home Essentials', revenue: '₹2,45,600', products: 56, growth: '+22%' },
  { name: 'Sporty Life', revenue: '₹1,78,300', products: 43, growth: '+5%' },
];

// ---------- Dashboard Stats ----------
export const dashboardStats = {
  totalRevenue: { value: '₹ 12,56,789', change: '+12.5%' },
  totalOrders: { value: '342', change: '+8.2%' },
  activeVendors: { value: '18', change: '+2' },
  pendingVendors: { value: '3', change: '0' },
  totalCustomers: { value: '1,240', change: '+56' },
};

// ---------- Revenue Chart Data ----------
export const revenueChartData = [
  { month: 'Jan', revenue: 45000 },
  { month: 'Feb', revenue: 52000 },
  { month: 'Mar', revenue: 48000 },
  { month: 'Apr', revenue: 61000 },
  { month: 'May', revenue: 55000 },
  { month: 'Jun', revenue: 67000 },
  { month: 'Jul', revenue: 72000 },
  { month: 'Aug', revenue: 58000 },
  { month: 'Sep', revenue: 63000 },
  { month: 'Oct', revenue: 69000 },
  { month: 'Nov', revenue: 75000 },
  { month: 'Dec', revenue: 81000 },
];

// ---------- Order Status Distribution ----------
export const orderStatusDistribution = [
  { name: 'Delivered', value: 65 },
  { name: 'Processing', value: 18 },
  { name: 'Shipped', value: 10 },
  { name: 'Pending', value: 7 },
];

export const couponsList = [
  {
    id: 1,
    code: 'SUMMER50',
    startDate: '2025-06-01',
    endDate: '2025-06-30',
    status: 'Enable',
    freeShipping: 'Yes',
    usedTime: 120,
  },
  {
    id: 2,
    code: 'FREESHIP',
    startDate: '2025-06-05',
    endDate: '2025-07-05',
    status: 'Enable',
    freeShipping: 'Yes',
    usedTime: 45,
  },
  {
    id: 3,
    code: 'WELCOME10',
    startDate: '2025-05-15',
    endDate: '2025-12-31',
    status: 'Disable',
    freeShipping: 'No',
    usedTime: 230,
  },
  {
    id: 4,
    code: 'FLASH25',
    startDate: '2025-07-01',
    endDate: '2025-07-10',
    status: 'Enable',
    freeShipping: 'No',
    usedTime: 80,
  },
  {
    id: 5,
    code: 'BULK15',
    startDate: '2025-06-15',
    endDate: '2025-08-15',
    status: 'Disable',
    freeShipping: 'Yes',
    usedTime: 12,
  },
  {
    id: 6,
    code: 'VIP50',
    startDate: '2025-06-01',
    endDate: '2025-12-31',
    status: 'Enable',
    freeShipping: 'Yes',
    usedTime: 340,
  },
];

export const categoriesList = [
  { id: 1, name: 'Men\'s Fashion', slug: 'mens-fashion', parent: 'None', status: 'Active', productCount: 124 },
  { id: 2, name: 'Women\'s Fashion', slug: 'womens-fashion', parent: 'None', status: 'Active', productCount: 89 },
  { id: 3, name: 'Electronics', slug: 'electronics', parent: 'None', status: 'Active', productCount: 56 },
  { id: 4, name: 'Home & Living', slug: 'home-living', parent: 'None', status: 'Inactive', productCount: 0 },
  { id: 5, name: 'Sports', slug: 'sports', parent: 'None', status: 'Active', productCount: 43 },
];

// ... existing reportsSummary ...

export const revenueByMonth = [
  { month: 'Jan', revenue: 45000 },
  { month: 'Feb', revenue: 52000 },
  { month: 'Mar', revenue: 48000 },
  { month: 'Apr', revenue: 61000 },
  { month: 'May', revenue: 55000 },
  { month: 'Jun', revenue: 67000 },
  { month: 'Jul', revenue: 72000 },
  { month: 'Aug', revenue: 58000 },
  { month: 'Sep', revenue: 63000 },
  { month: 'Oct', revenue: 69000 },
  { month: 'Nov', revenue: 75000 },
  { month: 'Dec', revenue: 81000 },
];

export const categorySales = [
  { name: 'Electronics', sales: 124000 },
  { name: 'Fashion', sales: 98000 },
  { name: 'Home & Living', sales: 76000 },
  { name: 'Sports', sales: 54000 },
  { name: 'Books', sales: 32000 },
];

export const vendorSales = [
  { name: 'Fashion Hub', revenue: 456200 },
  { name: 'Electro World', revenue: 378500 },
  { name: 'Home Essentials', revenue: 245600 },
  { name: 'Sporty Life', revenue: 178300 },
];

export const topProducts = [
  { name: 'Running Shoes', sold: 340, revenue: '₹4,25,000' },
  { name: 'Wireless Earbuds', sold: 290, revenue: '₹8,70,000' },
  { name: 'Leather Jacket', sold: 180, revenue: '₹9,00,000' },
  { name: 'Smart Watch', sold: 210, revenue: '₹16,80,000' },
  { name: 'Yoga Mat', sold: 450, revenue: '₹4,50,000' },
];
// ================================================================
//  CUSTOMER‑FACING PRODUCTS (for landing page / featured section)
// ================================================================
export const customerProducts = [
  {
    id: 101,
    name: 'Unisex Pull‑Up Pants (12Hr Absorption)',
    category: 'Adult Care',
    price: 899,
    originalPrice: 1099,
    rating: 4.8,
    reviews: 234,
    image: '/images/unisex-pull-up-pants.jpg',
    link: '/product/unisex-pull-up-pants',
    isWishlisted: false,
  },
  {
    id: 102,
    name: 'Newborn Baby Diapers (Ultra‑Soft)',
    category: 'Baby Care',
    price: 599,
    originalPrice: null,
    rating: 4.6,
    reviews: 187,
    image: '/images/baby-diapers.jpg',
    link: '/product/baby-diapers',
    isWishlisted: false,
  },
  {
    id: 103,
    name: 'Alcohol‑Free Hand Sanitiser',
    category: 'Hygiene',
    price: 149,
    originalPrice: 199,
    rating: 4.9,
    reviews: 312,
    image: '/images/hand-sanitiser.jpg',
    link: '/product/hand-sanitiser',
    isWishlisted: false,
  },
  {
    id: 104,
    name: 'Biodegradable Baby Wipes (Pack of 3)',
    category: 'Baby Care',
    price: 249,
    originalPrice: null,
    rating: 4.5,
    reviews: 98,
    image: '/images/baby-wipes.jpg',
    link: '/product/baby-wipes',
    isWishlisted: false,
  },
  {
    id: 105,
    name: 'Underpad 60×90 cm (Pack of 10)',
    category: 'Adult Care',
    price: 349,
    originalPrice: 429,
    rating: 4.7,
    reviews: 521,
    image: '/images/underpads.jpg',
    link: '/product/underpads',
    isWishlisted: false,
  },
  {
    id: 106,
    name: 'Kids Scooter – Foldable & Safe',
    category: 'Mobility',
    price: 2499,
    originalPrice: null,
    rating: 4.8,
    reviews: 403,
    image: '/images/kids-scooter.jpg',
    link: '/product/kids-scooter',
    isWishlisted: false,
  },
  {
    id: 107,
    name: 'Surgical Masks (50 Pack)',
    category: 'Hygiene',
    price: 99,
    originalPrice: 149,
    rating: 4.4,
    reviews: 156,
    image: '/images/surgical-masks.jpg',
    link: '/product/surgical-masks',
    isWishlisted: false,
  },
  {
    id: 108,
    name: 'Orthopaedic Knee Support',
    category: 'Health',
    price: 599,
    originalPrice: 799,
    rating: 4.6,
    reviews: 278,
    image: '/images/knee-support.jpg',
    link: '/product/knee-support',
    isWishlisted: false,
  },
];

// src/data/productData.js
export const allProducts = [
  {
    id: 101,
    name: 'Unisex Pull-Up Pants (12Hr Absorption)',
    category: 'Adult Care',
    categorySlug: 'adult-care',
    price: 899,
    originalPrice: 1099,
    rating: 4.8,
    reviews: 234,
    image: '/images/adult-diaper.jpg',
    inStock: true,
  },
  {
    id: 102,
    name: 'Newborn Baby Diapers (Ultra‑Soft)',
    category: 'Baby Care',
    categorySlug: 'baby-care',
    price: 599,
    originalPrice: null,
    rating: 4.6,
    reviews: 187,
    image: '/images/baby-diaper.jpg',
    inStock: true,
  },
  {
    id: 103,
    name: 'Alcohol-Free Hand Sanitiser (500ml)',
    category: 'Hygiene Essentials',
    categorySlug: 'hygiene-essentials',
    price: 149,
    originalPrice: 199,
    rating: 4.9,
    reviews: 312,
    image: '/images/sanitiser.jpg',
    inStock: true,
  },
  {
    id: 104,
    name: 'Biodegradable Baby Wipes (3x80)',
    category: 'Baby Care',
    categorySlug: 'baby-care',
    price: 249,
    originalPrice: null,
    rating: 4.5,
    reviews: 98,
    image: '/images/wipes.jpg',
    inStock: true,
  },
  {
    id: 105,
    name: 'Underpad 60x90cm (10pcs)',
    category: 'Adult Care',
    categorySlug: 'adult-care',
    price: 349,
    originalPrice: 429,
    rating: 4.7,
    reviews: 521,
    image: '/images/underpad.jpg',
    inStock: true,
  },
  {
    id: 106,
    name: 'Kids Scooter – Foldable & Safe',
    category: 'Kids & Mobility',
    categorySlug: 'kids-mobility',
    price: 2499,
    originalPrice: null,
    rating: 4.8,
    reviews: 403,
    image: '/images/scooter.jpg',
    inStock: true,
  },
  {
    id: 107,
    name: 'Surgical Masks (50pcs)',
    category: 'Hygiene Essentials',
    categorySlug: 'hygiene-essentials',
    price: 99,
    originalPrice: 149,
    rating: 4.4,
    reviews: 156,
    image: '/images/masks.jpg',
    inStock: true,
  },
  {
    id: 108,
    name: 'Orthopaedic Knee Support',
    category: 'Health & Wellness',
    categorySlug: 'health-wellness',
    price: 599,
    originalPrice: 799,
    rating: 4.6,
    reviews: 278,
    image: '/images/knee-support.jpg',
    inStock: true,
  },
  {
    id: 109,
    name: 'Adult Tape-Style Diapers (M, 20pcs)',
    category: 'Adult Care',
    categorySlug: 'adult-care',
    price: 1299,
    originalPrice: 1599,
    rating: 4.9,
    reviews: 456,
    image: '/images/adult-tape.jpg',
    inStock: true,
  },
  {
    id: 110,
    name: 'Baby Diaper Pants (L, 30pcs)',
    category: 'Baby Care',
    categorySlug: 'baby-care',
    price: 749,
    originalPrice: 899,
    rating: 4.7,
    reviews: 312,
    image: '/images/baby-pants.jpg',
    inStock: true,
  },
];