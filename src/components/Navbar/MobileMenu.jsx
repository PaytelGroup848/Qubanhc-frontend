import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Heart,
  Home,
  LayoutDashboard,
  LogIn,
  LogOut,
  PackageSearch,
  Phone,
  ShoppingCart,
  User,
  UserPlus,
  X,
} from "lucide-react";
import { CloseIcon } from "../Icons/Icons";
import { useAuth } from "../../context/AuthContext";

const fallbackCategories = [
  {
    id: "diapers",
    title: "Diapers",
    image:
      "/images/m-baby-diaper-pants-12hrs-absorption-adl-medium-7-12kg-mega-original-imahhj6fddjwuxh8.jpg",
    link: "/category/diapers",
  },
  {
    id: "adult-diapers",
    title: "Adult Diapers",
    image:
      "/images/m-unisex-pull-up-pants-12hrs-absorption-waist-size-24-45inch-original-imahhhgs2wfdnbnb.jpg",
    link: "/category/adult-diapers",
  },
  {
    id: "wipes",
    title: "Wipes",
    image:
      "/images/premium-baby-wipes-99-pure-water-aloe-vera-glycerine-with-lid-original-imahhj6nxypmgjhh.jpg",
    link: "/category/wipes",
  },
  {
    id: "sanitary-pads",
    title: "Sanitary Pads",
    image:
      "/images/leak-proof-sanitary-pad-for-heavy-flow-with-disposable-bags-original-imahm4yxmygc5m6t (3).jpg",
    link: "/category/sanitary-pads",
  },
];

export default function MobileMenu({
  isOpen,
  onClose,
  cartCount = 0,
  wishlistCount = 0,
  isLoggedIn = false,
  user = null,
  role = null,
  dashboardLink = "/admin/dashboard",
  dashboardLabel = "Go to Admin Panel",
  categories = [],
  categoriesLoading = false,
}) {
  const navigate = useNavigate();
  const { logout } = useAuth();

  const isAdminUser = role === "super_admin" || role === "sub_admin";
  const isVendorUser = role === "vendor";
  const showDashboard = isLoggedIn && (isAdminUser || isVendorUser);
  const displayCategories = categories.length ? categories : fallbackCategories;

  const initials = user?.name
    ? user.name
        .split(" ")
        .map((part) => part[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : "U";

  const handleLogout = async () => {
    onClose();
    await logout();
  };

  const goToAuth = (path) => {
    onClose();
    navigate(path, { state: { from: window.location.pathname } });
  };

  return (
    <>
      <div
        className={`fixed inset-0 bg-black/40 backdrop-blur-sm z-40 transition-all duration-300 ${
          isOpen ? "opacity-100 visible" : "opacity-0 invisible"
        }`}
        onClick={onClose}
      />

      <aside
        className={`fixed top-0 left-0 h-full w-80 max-w-[88vw] bg-white z-50 shadow-2xl transform transition-transform duration-300 ease-out ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="h-full flex flex-col">
          <div className="bg-gradient-to-r from-teal-600 to-emerald-600 p-5 text-white">
            <div className="flex justify-between items-start">
              <div className="flex items-center gap-3">
                <img
                  src="/images/QubanHC.svg"
                  alt="QubanHC"
                  className="h-9 w-auto rounded bg-white/10"
                />
                {/* <div>
                  <h2 className="text-xl font-bold leading-none">QubanHC</h2>
                  <p className="text-teal-100 text-xs mt-1">Care & Comfort</p>
                </div> */}
              </div>

              <button
                className="p-2 rounded-full bg-white/20 hover:bg-white/30 transition-colors"
                onClick={onClose}
                aria-label="Close menu"
              >
                <CloseIcon className="w-5 h-5" />
              </button>
            </div>

            {isLoggedIn ? (
              <div className="mt-5 rounded-xl bg-white/12 border border-white/15 p-3">
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-full bg-white text-teal-700 flex items-center justify-center text-sm font-bold shadow-sm">
                    {user?.avatar?.url ? (
                      <img
                        src={user.avatar.url}
                        alt={user.name}
                        className="w-full h-full rounded-full object-cover"
                      />
                    ) : (
                      initials
                    )}
                  </div>
                  <div className="min-w-0">
                    <p className="font-semibold truncate">
                      {user?.name || "Welcome back"}
                    </p>
                    <p className="text-xs text-teal-50 truncate">
                      {user?.email || role}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 mt-3">
                  <Link
                    to="/account"
                    onClick={onClose}
                    className="flex items-center justify-center gap-2 rounded-lg bg-white text-teal-700 px-3 py-2 text-xs font-semibold"
                  >
                    <User className="w-4 h-4" />
                    My Account
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="flex items-center justify-center gap-2 rounded-lg bg-red-500 text-white px-3 py-2 text-xs font-semibold"
                  >
                    <LogOut className="w-4 h-4" />
                    Logout
                  </button>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-2 mt-5">
                <button
                  onClick={() => goToAuth("/login")}
                  className="flex items-center justify-center gap-2 rounded-lg bg-white text-teal-700 px-3 py-2.5 text-sm font-semibold shadow-sm"
                >
                  <LogIn className="w-4 h-4" />
                  Login
                </button>
                <button
                  onClick={() => goToAuth("/register")}
                  className="flex items-center justify-center gap-2 rounded-lg bg-teal-800/50 text-white border border-white/20 px-3 py-2.5 text-sm font-semibold"
                >
                  <UserPlus className="w-4 h-4" />
                  Register
                </button>
              </div>
            )}
          </div>

          <nav className="flex-1 overflow-y-auto pb-6">
            <div className="p-4 space-y-1">
              <MenuLink
                to="/"
                label="Home"
                onClose={onClose}
                icon={Home}
                active
              />
              <MenuLink
                to="/contact"
                label="Contact"
                onClose={onClose}
                icon={Phone}
              />
              <MenuLink
                to="/cart"
                label="Cart"
                onClose={onClose}
                icon={ShoppingCart}
                count={cartCount}
              />
              <MenuLink
                to="/wishlist"
                label="Wishlist"
                onClose={onClose}
                icon={Heart}
                count={wishlistCount}
              />
              {showDashboard && (
                <MenuLink
                  to={dashboardLink}
                  label={dashboardLabel}
                  onClose={onClose}
                  icon={LayoutDashboard}
                  highlight
                />
              )}
            </div>

            <div className="px-4 py-2">
              <div className="flex items-center justify-between mb-3 px-1">
                <h3 className="text-xs font-bold uppercase tracking-wider text-teal-600">
                  Shop by Category
                </h3>
                <Link
                  to="/categories"
                  onClick={onClose}
                  className="text-xs font-semibold text-gray-400 hover:text-teal-600"
                >
                  View all
                </Link>
              </div>

              {categoriesLoading ? (
                <div className="grid grid-cols-2 gap-3">
                  {[0, 1, 2, 3].map((item) => (
                    <div key={item} className="animate-pulse">
                      <div className="aspect-square rounded-xl bg-gray-100" />
                      <div className="h-3 bg-gray-100 rounded mt-2 w-3/4 mx-auto" />
                    </div>
                  ))}
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-3">
                  {displayCategories.map((category) => (
                    <CategoryCard
                      key={category.id}
                      category={category}
                      onClose={onClose}
                    />
                  ))}
                </div>
              )}
            </div>
          </nav>
        </div>
      </aside>
    </>
  );
}

function MenuLink({
  to,
  label,
  onClose,
  icon: Icon,
  count = 0,
  active = false,
  highlight = false,
}) {
  return (
    <Link
      to={to}
      onClick={onClose}
      className={`flex items-center justify-between gap-3 px-4 py-3 rounded-xl transition ${
        highlight
          ? "bg-teal-600 text-white font-semibold"
          : active
            ? "bg-teal-50 text-teal-700 font-semibold"
            : "text-gray-700 font-medium hover:bg-gray-50"
      }`}
    >
      <span className="flex items-center gap-3">
        <Icon className="w-5 h-5" />
        {label}
      </span>
      {count > 0 && (
        <span
          className={`text-xs font-bold rounded-full min-w-5 h-5 px-1 flex items-center justify-center ${
            highlight ? "bg-white text-teal-700" : "bg-teal-100 text-teal-700"
          }`}
        >
          {count > 99 ? "99+" : count}
        </span>
      )}
    </Link>
  );
}

function CategoryCard({ category, onClose }) {
  const [failed, setFailed] = useState(false);

  return (
    <Link to={category.link} onClick={onClose} className="group text-center">
      <div className="relative aspect-square rounded-xl overflow-hidden bg-gray-100 shadow-sm ring-1 ring-black/5 group-active:scale-[0.98] transition">
        {!failed ? (
          <img
            src={category.image}
            alt={category.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            onError={() => setFailed(true)}
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-teal-400 to-emerald-600 flex items-center justify-center">
            <PackageSearch className="w-8 h-8 text-white" />
          </div>
        )}
        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/60 to-transparent p-2">
          <p className="text-white text-xs font-bold line-clamp-2">
            {category.title}
          </p>
        </div>
      </div>
      {category.children?.length > 0 && (
        <p className="mt-1 text-[10px] text-gray-400">
          {category.children.length} subcategories
        </p>
      )}
    </Link>
  );
}
