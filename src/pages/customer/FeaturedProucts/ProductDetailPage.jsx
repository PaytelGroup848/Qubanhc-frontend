import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDevice } from '../../../hooks/Customer/useDevice';
import ProductDetailDesktop from './ProductDetailDesktop';
import MobileProductDetail from './MobileProductDetail';
import { productService } from '../../../services/product';
import { useCart } from '../../../context/CartContext';
import toast from 'react-hot-toast';

export default function ProductDetailPage() {
  const { id } = useParams();
  const { isMobile } = useDevice();
  const navigate = useNavigate();
  const { addToCart } = useCart();

  const [product, setProduct] = useState(null);
  const [variants, setVariants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [selectedVariant, setSelectedVariant] = useState(null);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        let response;

        // Check — ye _id hai ya slug
        const isMongoId = /^[a-f\d]{24}$/i.test(id);

        if (isMongoId) {
          response = await productService.getProductById(id);
        } else {
          response = await productService.getProductBySlug(id);
        }

        setProduct(response.product);
        setVariants(response.variants || []);
      } catch (err) {
        console.error('Error fetching product:', err);
        setError('Product not found');
      } finally {
        setLoading(false);
      }
    };


    if (id) {
      fetchProduct();
    }
  }, [id]);

  const handleAddToCart = async () => {
    try {
      const hasSizes = variants && variants.length > 0;
      if (hasSizes && !selectedVariant) {
        toast.error('Please select a size first');
        return;
      }
      const productId = product._id;
      const variantId = selectedVariant?._id || null;
      const displayPrice = selectedVariant?.price || product.price;
      const displayOriginalPrice = selectedVariant?.originalPrice || product.originalPrice;
      addToCart(
        {
          id: productId,
          name: product.name,
          price: displayPrice,
          originalPrice: displayOriginalPrice,
          image: product.images?.[0]?.url || '/images/placeholder.jpg',
          variantName: selectedVariant?.name || selectedVariant?.title || null,
        },
        quantity,
        variantId
      );
      toast.success('Added to cart!');
    } catch (error) {
      toast.error('Failed to add to cart');
    }
  };

  const handleBuyNow = async () => {
    const hasSizes = variants && variants.length > 0;
    if (hasSizes && !selectedVariant) {
      toast.error('Please select a size first');
      return;
    }
    await handleAddToCart();
    navigate('/cart');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600" />
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen flex items-center justify-center flex-col gap-4">
        <p className="text-gray-500">{error || 'Product not found'}</p>
        <button onClick={() => navigate('/')} className="text-teal-600 hover:underline">
          Go back home
        </button>
      </div>
    );
  }

  const productWithQuantity = { ...product, quantity };

  return isMobile ? (
    <MobileProductDetail
      product={productWithQuantity}
      variants={variants}
      selectedVariant={selectedVariant}
      setSelectedVariant={setSelectedVariant}
      quantity={quantity}
      setQuantity={setQuantity}
      onAddToCart={handleAddToCart}
      onBuyNow={handleBuyNow}
    />
  ) : (
    <ProductDetailDesktop
      product={productWithQuantity}
      variants={variants}
      selectedVariant={selectedVariant}
      setSelectedVariant={setSelectedVariant}
      quantity={quantity}
      setQuantity={setQuantity}
      onAddToCart={handleAddToCart}
      onBuyNow={handleBuyNow}
    />
  );
}