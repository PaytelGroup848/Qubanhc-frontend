import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import useNavbar from "./useNavbar";
import TopBar from "./TopBar";
import MobileMenu from "./MobileMenu";
import SearchBar from "./SearchBar";
import { SearchIcon, CartIcon, MenuIcon, CloseIcon } from "../Icons/Icons";
import { useCart } from "../../context/CartContext";
import { categoryService } from "../../services/category";

export default function MobileNavbar() {
  const {
    wishlistCount,
    isLoggedIn,
    user,
    role,
    searchQuery,
    setSearchQuery,
    suggestions,
    setSearchFocused,
    handleSearchSelect,
  } = useNavbar();

  const { cartCount } = useCart();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [categories, setCategories] = useState([]);
  const [categoriesLoading, setCategoriesLoading] = useState(false);

  const isAdminUser = role === "super_admin" || role === "sub_admin";
  const isVendorUser = role === "vendor";
  const dashboardLink = isVendorUser ? "/vendor/dashboard" : "/admin/dashboard";
  const dashboardLabel = isVendorUser
    ? "Go to Vendor Dashboard"
    : "Go to Admin Panel";

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = mobileMenuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileMenuOpen]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setCategoriesLoading(true);
        const response = await categoryService.getAllCategories();
        const backendCategories = response.data?.categories || [];

        setCategories(
          backendCategories.map((category) => ({
            id: category._id,
            title: category.name,
            image: category.image?.url || "/images/placeholder.jpg",
            link: `/category/${category.slug}`,
            children: category.children || [],
          })),
        );
      } catch (error) {
        setCategories([]);
      } finally {
        setCategoriesLoading(false);
      }
    };

    fetchCategories();
  }, []);

  return (
    <>
      <TopBar />

      <nav
        className={`sticky top-0 z-50 bg-white transition-all duration-300 ${
          scrolled ? "shadow-md" : "shadow-sm"
        }`}
      >
        <div className="max-w-7xl mx-auto px-3 sm:px-4 flex items-center justify-between h-14 sm:h-16 gap-3">
          <button
            className="p-2 -ml-2 rounded-full hover:bg-gray-100 transition-colors focus:outline-none focus:ring-2 focus:ring-teal-400"
            onClick={() => setMobileMenuOpen((open) => !open)}
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? (
              <CloseIcon className="w-5 h-5" />
            ) : (
              <MenuIcon className="w-5 h-5" />
            )}
          </button>

          <Link
            to="/"
            className="flex items-center gap-2 sm:gap-3 flex-shrink-0 group"
          >
            <img
              src="/images/QubanHC.svg"
              alt="QubanHC Logo"
              className="h-8 sm:h-10 w-auto object-contain transition-transform duration-300 group-hover:scale-105"
            />
            {/* <div className="flex flex-col">
              <span className="text-lg sm:text-xl font-extrabold tracking-tight leading-none bg-gradient-to-r from-teal-600 to-emerald-500 bg-clip-text text-transparent">
                QubanHC
              </span>
              <span className="text-[9px] sm:text-[10px] font-medium text-gray-500 tracking-widest uppercase">
                Care & Comfort
              </span>
            </div> */}
          </Link>

          <div className="flex items-center gap-1 sm:gap-2">
            {isLoggedIn && (isAdminUser || isVendorUser) && (
              <Link
                to={dashboardLink}
                className="relative p-2 rounded-full bg-teal-50 text-teal-600 hover:bg-teal-600 hover:text-white transition-colors focus:outline-none focus:ring-2 focus:ring-teal-400"
                aria-label={dashboardLabel}
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
                    d="M3 12l2-2m0 0 7-7 7 7M5 10v10a1 1 0 0 0 1 1h3m10-11 2 2m-2-2v10a1 1 0 0 1-1 1h-3m-6 0a1 1 0 0 0 1-1v-4a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v4a1 1 0 0 0 1 1m-6 0h6"
                  />
                </svg>
              </Link>
            )}

            <button
              className="p-2 rounded-full hover:bg-gray-100 text-gray-700 transition-colors focus:outline-none focus:ring-2 focus:ring-teal-400"
              onClick={() => setMobileSearchOpen((open) => !open)}
              aria-label="Search"
            >
              <SearchIcon className="w-5 h-5" />
            </button>

            <Link
              to="/cart"
              className="relative p-2 rounded-full bg-teal-50 text-teal-600 hover:bg-teal-600 hover:text-white transition-colors focus:outline-none focus:ring-2 focus:ring-teal-400"
              aria-label="Cart"
            >
              <CartIcon className="w-5 h-5" />
              {cartCount > 0 && (
                <span
                  key={cartCount}
                  className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full min-w-[1.25rem] h-5 flex items-center justify-center px-1"
                >
                  {cartCount > 99 ? "99+" : cartCount}
                </span>
              )}
            </Link>
          </div>
        </div>

        <div
          className={`overflow-hidden transition-all duration-300 ease-in-out ${
            mobileSearchOpen
              ? "max-h-24 py-3 px-3 sm:px-4"
              : "max-h-0 py-0 px-3 sm:px-4"
          }`}
        >
          <SearchBar
            query={searchQuery}
            setQuery={setSearchQuery}
            suggestions={suggestions}
            focused={mobileSearchOpen}
            setFocused={setMobileSearchOpen}
            onSelect={(val) => {
              handleSearchSelect(val);
              setSearchFocused(false);
              setMobileSearchOpen(false);
            }}
            isMobile
            className="w-full text-base py-2.5 px-4 rounded-full border-0 shadow-sm ring-1 ring-gray-200 focus:ring-2 focus:ring-teal-400"
          />
        </div>
      </nav>

      <MobileMenu
        isOpen={mobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
        cartCount={cartCount}
        wishlistCount={wishlistCount}
        isLoggedIn={isLoggedIn}
        user={user}
        role={role}
        dashboardLink={dashboardLink}
        dashboardLabel={dashboardLabel}
        categories={categories}
        categoriesLoading={categoriesLoading}
      />
    </>
  );
}
