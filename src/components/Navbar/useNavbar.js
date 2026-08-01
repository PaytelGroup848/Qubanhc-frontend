import { useState, useEffect, useCallback } from 'react';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import { wishlistService } from '../../services/wishlist';

const mockSuggestions = [
  'Adult Diaper Extra Large', 'Baby Wipes Sensitive', 'Kids Scooter Blue',
  'Underpad 60x90', 'Hand Sanitiser', 'Baby Diapers Newborn'
];

export function useDebounce(value, delay = 300) {
  const [debouncedValue, setDebouncedValue] = useState(value);
  useEffect(() => {
    const handler = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(handler);
  }, [value, delay]);
  return debouncedValue;
}

export default function useNavbar() {
  const { cartCount }               = useCart();
  const { isLoggedIn, user, role }  = useAuth(); // ← AuthContext se lo

  const [wishlistCount, setWishlistCount] = useState(0);
  const [searchQuery, setSearchQuery]     = useState('');
  const debouncedSearch                   = useDebounce(searchQuery, 300);
  const [suggestions, setSuggestions]     = useState([]);
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
  window.addEventListener('wishlist-changed', handleWishlistChanged);

  return () => {
    window.removeEventListener('wishlist-changed', handleWishlistChanged);
  };
}, [isLoggedIn]);


  useEffect(() => {
    if (debouncedSearch.trim()) {
      const filtered = mockSuggestions.filter(item =>
        item.toLowerCase().includes(debouncedSearch.toLowerCase())
      );
      setSuggestions(filtered);
    } else {
      setSuggestions([]);
    }
  }, [debouncedSearch]);

  const handleSearchSelect = useCallback((suggestion) => {
    setSearchQuery(suggestion);
    setSuggestions([]);
    setSearchFocused(false);
  }, []);

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