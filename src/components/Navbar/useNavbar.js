import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../../context/CartContext";
import { useAuth } from "../../context/AuthContext";
import { wishlistService } from "../../services/wishlist";
import { productService } from "../../services/product";

const mockSuggestions = [
  "Adult Diaper Extra Large",
  "Baby Wipes Sensitive",
  "Kids Scooter Blue",
  "Underpad 60x90",
  "Hand Sanitiser",
  "Baby Diapers Newborn",
];

export function useDebounce(value, delay = 300) {
  const [debouncedValue, setDebouncedValue] = useState(value);
  useEffect(() => {
    const handler = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(handler);
  }, [value, delay]);
  return debouncedValue;
}

function extractSearchPayload(response) {
  const root = response || {};
  if (root?.data?.data) return root.data.data;
  if (root?.data) return root.data;
  return root;
}

export default function useNavbar() {
  const navigate = useNavigate();
  const { cartCount } = useCart();
  const { isLoggedIn, user, role } = useAuth(); // ← AuthContext se lo

  const [wishlistCount, setWishlistCount] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const debouncedSearch = useDebounce(searchQuery, 300);
  const [suggestions, setSuggestions] = useState([]);
  const [searchFocused, setSearchFocused] = useState(false);

  useEffect(() => {
    const loadWishlistCount = async () => {
      if (!isLoggedIn) {
        setWishlistCount(0);
        return;
      }

      try {
        const response = await wishlistService.getWishlist();
        setWishlistCount(response.data?.wishlist?.items?.length || 0);
      } catch {
        setWishlistCount(0);
      }
    };

    loadWishlistCount();

    const handleWishlistChanged = () => loadWishlistCount();
    window.addEventListener("wishlist-changed", handleWishlistChanged);

    return () => {
      window.removeEventListener("wishlist-changed", handleWishlistChanged);
    };
  }, [isLoggedIn]);

  useEffect(() => {
    const term = debouncedSearch.trim();

    if (!term) {
      setSuggestions([]);
      return;
    }

    let cancelled = false;

    const loadSuggestions = async () => {
      try {
        const response = await productService.searchProducts(term, 1, 5);
        const payload = extractSearchPayload(response);
        const products = payload?.products || [];
        const names = products
          .map((product) => product?.name)
          .filter(Boolean)
          .slice(0, 5);

        if (!cancelled) {
          setSuggestions(
            names.length > 0
              ? names
              : mockSuggestions.filter((item) =>
                  item.toLowerCase().includes(term.toLowerCase()),
                ),
          );
        }
      } catch {
        if (!cancelled) {
          setSuggestions(
            mockSuggestions.filter((item) =>
              item.toLowerCase().includes(term.toLowerCase()),
            ),
          );
        }
      }
    };

    loadSuggestions();

    return () => {
      cancelled = true;
    };
  }, [debouncedSearch]);

  const handleSearchSelect = useCallback(
    (suggestion) => {
      setSearchQuery(suggestion);
      setSuggestions([]);
      setSearchFocused(false);
      navigate(`/search?q=${encodeURIComponent(suggestion)}`);
    },
    [navigate],
  );

  return {
    cartCount,
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
  };
}
