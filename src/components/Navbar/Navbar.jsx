import { useState, useEffect, useRef, useCallback } from "react";
import { Link } from "react-router-dom";
import useNavbar from "./useNavbar";
import TopBar from "./TopBar";
import ShopPopup from "./ShopPopup";
import SearchBar from "./SearchBar";
import ProfileDropdown from "./ProfileDropdown";
import MobileMenu from "./MobileMenu";
import {
  SearchIcon,
  WishlistIcon,
  CartIcon,
  MenuIcon,
  CloseIcon,
} from "../Icons/Icons";
import { useCart } from "../../context/CartContext";
import { categoryService } from "../../services/category";

export default function Navbar() {
  const {
    wishlistCount,
    isLoggedIn,
    user,
    role,
    searchQuery,
    setSearchQuery,
    suggestions,
    searchFocused,
    setSearchFocused,
    handleSearchSelect,
  } = useNavbar();

  const { cartCount } = useCart();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [shopPopupOpen, setShopPopupOpen] = useState(false);
  const [shopCategories, setShopCategories] = useState([]);
  const [shopCategoriesLoading, setShopCategoriesLoading] = useState(false);

  const openTimeoutRef = useRef(null);
  const closeTimeoutRef = useRef(null);
  const shopButtonRef = useRef(null);
  const shopPopupWrapperRef = useRef(null);
  const isHoveringButton = useRef(false);
  const isHoveringPopup = useRef(false);

  const clearTimeouts = useCallback(() => {
    if (openTimeoutRef.current) clearTimeout(openTimeoutRef.current);
    if (closeTimeoutRef.current) clearTimeout(closeTimeoutRef.current);
  }, []);

  const openPopup = useCallback(() => {
    clearTimeouts();
    if (!shopPopupOpen) setShopPopupOpen(true);
  }, [clearTimeouts, shopPopupOpen]);

  const closePopupWithDelay = useCallback(() => {
    clearTimeouts();
    closeTimeoutRef.current = setTimeout(() => {
      if (!isHoveringButton.current && !isHoveringPopup.current) {
        setShopPopupOpen(false);
      }
    }, 200);
  }, [clearTimeouts]);

  const closePopupImmediately = useCallback(() => {
    clearTimeouts();
    isHoveringButton.current = false;
    isHoveringPopup.current = false;
    setShopPopupOpen(false);
  }, [clearTimeouts]);

  const handleButtonMouseEnter = () => {
    isHoveringButton.current = true;
    clearTimeouts();
    openTimeoutRef.current = setTimeout(() => {
      if (isHoveringButton.current) openPopup();
    }, 150);
  };

  const handleButtonMouseLeave = () => {
    isHoveringButton.current = false;
    clearTimeouts();
    closePopupWithDelay();
  };

  const handlePopupWrapperMouseEnter = () => {
    isHoveringPopup.current = true;
    clearTimeouts();
  };

  const handlePopupWrapperMouseLeave = () => {
    isHoveringPopup.current = false;
    clearTimeouts();
    closePopupWithDelay();
  };

  useEffect(() => {
    if (!shopPopupOpen) return;
    const handleClickOutside = (event) => {
      const isClickInsideButton = shopButtonRef.current?.contains(event.target);
      const isClickInsidePopup = shopPopupWrapperRef.current?.contains(
        event.target,
      );
      if (!isClickInsideButton && !isClickInsidePopup) closePopupImmediately();
    };
    const handleEscape = (event) => {
      if (event.key === "Escape") closePopupImmediately();
    };
    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEscape);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [shopPopupOpen, closePopupImmediately]);

  useEffect(() => {
    return () => clearTimeouts();
  }, [clearTimeouts]);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);
  useEffect(() => {
    const fetchShopCategories = async () => {
      try {
        setShopCategoriesLoading(true);
        const response = await categoryService.getAllCategories();
        const categories = response.data?.categories || [];
        setShopCategories(categories.map(mapCategoryForPopup));
      } catch (error) {
        setShopCategories([]);
      } finally {
        setShopCategoriesLoading(false);
      }
    };

    fetchShopCategories();
  }, []);

  useEffect(() => {
    document.body.style.overflow =
      mobileMenuOpen || shopPopupOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileMenuOpen, shopPopupOpen]);

  const handleCategorySelect = () => {
    closePopupImmediately();
  };

  // Determine dashboard link based on role
  const isAdminUser = role === "super_admin" || role === "sub_admin";
  const isVendorUser = role === "vendor";
  const mapCategoryForPopup = (category) => ({
    id: category._id,
    title: category.name,
    image: category.image?.url || "/images/placeholder.jpg",
    link: `/category/${category.slug}`,
    color: "from-teal-400 to-teal-600",
    children: category.children || [],
  });

  return (
    <>
      <TopBar />

      <nav
        className={`sticky top-0 z-50 bg-white transition-shadow duration-300 ${scrolled ? "shadow-md" : "shadow-sm"}`}
      >
        <div className="max-w-9xl mx-auto px-5 md:px-8 lg:px-12 flex items-center justify-between h-16 md:h-20 gap-4">
          {/* Mobile menu toggle */}
          <button
            className="lg:hidden p-2 -ml-2 rounded-lg hover:bg-gray-100 transition-colors focus:outline-none focus:ring-2 focus:ring-teal-400"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? (
              <CloseIcon className="w-6 h-6" />
            ) : (
              <MenuIcon className="w-6 h-6" />
            )}
          </button>

          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 flex-shrink-0 group">
            <img
              src="/images/QubanHC.svg"
              alt="QubanHC Logo"
              className="h-10 sm:h-12 md:h-14 w-auto object-contain transition-transform duration-300 group-hover:scale-105"
            />
            {/* <div className="flex flex-col">
              <span className="text-xl sm:text-2xl md:text-3xl font-extrabold tracking-tight leading-none bg-gradient-to-r from-teal-600 to-emerald-500 bg-clip-text text-transparent">
                QubanHC
              </span>
              <span className="text-[10px] sm:text-xs md:text-sm font-medium text-gray-500 tracking-widest leading-tight mt-0.5 uppercase">
                Care & Comfort
              </span>
            </div> */}
          </Link>

          {/* Desktop nav links */}
          <ul className="hidden lg:flex items-center gap-2 xl:gap-3">
            <li>
              <Link
                to="/"
                className="px-3 py-2 text-base lg:text-lg font-medium text-teal-600 bg-teal-50 rounded-md"
              >
                Home
              </Link>
            </li>
            <li
              ref={shopButtonRef}
              onMouseEnter={handleButtonMouseEnter}
              onMouseLeave={handleButtonMouseLeave}
            >
              <button
                onClick={() => openPopup()}
                className="px-3 py-2 text-base lg:text-lg font-medium text-gray-700 hover:text-teal-600 hover:bg-teal-50 rounded-md transition-colors"
              >
                Shop
              </button>
            </li>
            <li>
              <Link
                to="/blog"
                className="px-3 py-2 text-base lg:text-lg font-medium text-gray-700 hover:text-teal-600 hover:bg-teal-50 rounded-md transition-colors"
              >
                Blog
              </Link>
            </li>
            <li>
              <Link
                to="/contact"
                className="px-3 py-2 text-base lg:text-lg font-medium text-gray-700 hover:text-teal-600 hover:bg-teal-50 rounded-md transition-colors"
              >
                Contact
              </Link>
            </li>
          </ul>

          {/* Right side icons */}
          <div className="flex items-center gap-3">
            {/* Desktop Search */}
            <div className="hidden lg:block w-96 xl:w-[28rem]">
              <SearchBar
                query={searchQuery}
                setQuery={setSearchQuery}
                suggestions={suggestions}
                focused={searchFocused}
                setFocused={setSearchFocused}
                onSelect={handleSearchSelect}
                className="text-base py-2.5 px-4 rounded-full ring-1 ring-gray-200 focus:ring-2 focus:ring-teal-400"
              />
            </div>

            {/* Mobile search toggle */}
            <button
              className="lg:hidden p-2 rounded-full hover:bg-gray-100 text-gray-700 transition-colors focus:outline-none focus:ring-2 focus:ring-teal-400"
              onClick={() => setMobileSearchOpen(!mobileSearchOpen)}
              aria-label="Search"
            >
              <SearchIcon className="w-6 h-6" />
            </button>

            {/* Wishlist (desktop only) */}
            <Link
              to="/wishlist"
              className="hidden lg:flex p-2 rounded-full hover:bg-gray-100 text-gray-700 hover:text-teal-600 transition-colors focus:outline-none focus:ring-2 focus:ring-teal-400"
            >
              <WishlistIcon className="w-6 h-6" />
            </Link>

            {/* Profile dropdown */}
            <ProfileDropdown isLoggedIn={isLoggedIn} user={user} role={role} />

            {/* Cart icon with dynamic animated badge */}
            <Link
              to="/cart"
              className="relative p-2 rounded-full bg-teal-50 text-teal-600 hover:bg-teal-600 hover:text-white transition-colors focus:outline-none focus:ring-2 focus:ring-teal-400"
            >
              <CartIcon className="w-6 h-6" />
              {cartCount > 0 && (
                <span
                  key={cartCount}
                  className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full min-w-[1.25rem] h-5 flex items-center justify-center px-1 animate-bounce-in"
                >
                  {cartCount > 99 ? "99+" : cartCount}
                </span>
              )}
            </Link>
          </div>
        </div>

        {/* Mobile search bar (expandable) */}
        <div
          className={`lg:hidden overflow-hidden transition-all duration-300 ${mobileSearchOpen ? "max-h-24 py-3 px-4" : "max-h-0 py-0 px-4"}`}
        >
          <SearchBar
            query={searchQuery}
            setQuery={setSearchQuery}
            suggestions={suggestions}
            focused={mobileSearchOpen}
            setFocused={setMobileSearchOpen}
            onSelect={(val) => {
              handleSearchSelect(val);
              setMobileSearchOpen(false);
            }}
            isMobile
            className="text-base py-2.5 px-4 rounded-full ring-1 ring-gray-200 focus:ring-2 focus:ring-teal-400 w-full"
          />
        </div>
      </nav>

      <MobileMenu
        isOpen={mobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
        cartCount={cartCount}
        wishlistCount={wishlistCount}
        isLoggedIn={isLoggedIn}
        role={role}
      />

      <div
        ref={shopPopupWrapperRef}
        onMouseEnter={handlePopupWrapperMouseEnter}
        onMouseLeave={handlePopupWrapperMouseLeave}
        style={{ position: "relative", zIndex: 50 }}
      >
        <ShopPopup
          isOpen={shopPopupOpen}
          onClose={closePopupImmediately}
          onCategorySelect={handleCategorySelect}
          categories={shopCategories}
          loading={shopCategoriesLoading}
        />
      </div>
    </>
  );
}
