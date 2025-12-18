import { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Heart, Minus, Plus, Truck, RefreshCw, Shield, ChevronLeft } from 'lucide-react';
import { Layout } from '@/components/layout';
import { ProductGrid } from '@/components/products';
import { Button } from '@/components/ui/button';
import { mockProducts } from '@/data/mockData';
import { useCart } from '@/contexts/CartContext';
import { cn } from '@/lib/utils';

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addItem } = useCart();
  
  const product = mockProducts.find(p => p.id === id);
  const relatedProducts = mockProducts.filter(p => p.id !== id && p.category === product?.category).slice(0, 4);
  
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedSize, setSelectedSize] = useState<string>('');
  const [selectedColor, setSelectedColor] = useState<string>('');
  const [quantity, setQuantity] = useState(1);

  if (!product) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-16 text-center">
          <h1 className="text-2xl font-display">Product not found</h1>
          <Button variant="luxury" className="mt-4" onClick={() => navigate('/products')}>
            Back to Products
          </Button>
        </div>
      </Layout>
    );
  }

  const hasDiscount = product.originalPrice && product.originalPrice > product.price;

  const handleAddToCart = () => {
    if (!selectedSize) {
      return;
    }
    const color = selectedColor || product.colors[0]?.name || '';
    addItem(product, selectedSize, color, quantity);
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <nav className="mb-8">
          <Link
            to="/products"
            className="inline-flex items-center gap-2 text-sm text-body hover:text-foreground transition-colors"
          >
            <ChevronLeft className="h-4 w-4" />
            Back to Products
          </Link>
        </nav>

        {/* Product Section */}
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Images */}
          <div className="space-y-4">
            {/* Main Image */}
            <div className="aspect-[3/4] overflow-hidden bg-muted">
              <img
                src={product.images[selectedImage]}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            </div>
            
            {/* Thumbnails */}
            {product.images.length > 1 && (
              <div className="flex gap-3">
                {product.images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={cn(
                      "w-20 h-24 overflow-hidden border-2 transition-colors",
                      selectedImage === index ? "border-foreground" : "border-transparent"
                    )}
                  >
                    <img src={image} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="lg:py-4">
            <p className="text-sm text-label uppercase tracking-wider">{product.sellerName}</p>
            <h1 className="mt-2 font-display text-3xl md:text-4xl font-medium">{product.name}</h1>
            
            {/* Price */}
            <div className="mt-4 flex items-baseline gap-3">
              <span className="text-2xl font-semibold">${product.price}</span>
              {hasDiscount && (
                <span className="text-lg text-label line-through">${product.originalPrice}</span>
              )}
            </div>

            {/* Rating */}
            <div className="mt-4 flex items-center gap-2">
              <div className="flex">
                {[...Array(5)].map((_, i) => (
                  <svg
                    key={i}
                    className={cn(
                      "w-4 h-4",
                      i < Math.floor(product.rating) ? "text-primary fill-primary" : "text-border"
                    )}
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
              <span className="text-sm text-body">{product.rating} ({product.reviewCount} reviews)</span>
            </div>

            {/* Description */}
            <p className="mt-6 text-body leading-relaxed">{product.description}</p>

            {/* Color Selection */}
            {product.colors.length > 0 && (
              <div className="mt-8">
                <p className="text-sm font-semibold uppercase tracking-wider mb-3">
                  Color: {selectedColor || 'Select'}
                </p>
                <div className="flex gap-3">
                  {product.colors.map((color) => (
                    <button
                      key={color.name}
                      onClick={() => setSelectedColor(color.name)}
                      className={cn(
                        "w-10 h-10 rounded-full border-2 transition-all",
                        selectedColor === color.name
                          ? "border-foreground scale-110"
                          : "border-transparent hover:scale-105"
                      )}
                      style={{ backgroundColor: color.hex }}
                      title={color.name}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Size Selection */}
            <div className="mt-8">
              <div className="flex items-center justify-between mb-3">
                <p className="text-sm font-semibold uppercase tracking-wider">
                  Size: {selectedSize || 'Select'}
                </p>
                <button className="text-sm text-primary hover:underline">Size Guide</button>
              </div>
              <div className="flex flex-wrap gap-2">
                {product.sizes.map((size) => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={cn(
                      "min-w-[48px] h-12 px-4 border transition-colors",
                      selectedSize === size
                        ? "border-foreground bg-foreground text-background"
                        : "border-border hover:border-foreground"
                    )}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            {/* Quantity */}
            <div className="mt-8">
              <p className="text-sm font-semibold uppercase tracking-wider mb-3">Quantity</p>
              <div className="inline-flex items-center border border-border">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="p-3 hover:bg-muted transition-colors"
                >
                  <Minus className="h-4 w-4" />
                </button>
                <span className="w-12 text-center font-medium">{quantity}</span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="p-3 hover:bg-muted transition-colors"
                >
                  <Plus className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* Actions */}
            <div className="mt-8 flex flex-col sm:flex-row gap-3">
              <Button
                variant="luxury"
                size="xl"
                className="flex-1"
                onClick={handleAddToCart}
                disabled={!selectedSize}
              >
                {!selectedSize ? 'Select a Size' : 'Add to Cart'}
              </Button>
              <Button variant="luxury-outline" size="xl">
                <Heart className="h-5 w-5" />
              </Button>
            </div>

            {/* Features */}
            <div className="mt-10 pt-8 border-t border-border space-y-4">
              <div className="flex items-center gap-3 text-sm">
                <Truck className="h-5 w-5 text-primary" />
                <span>Complimentary shipping on orders over $200</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <RefreshCw className="h-5 w-5 text-primary" />
                <span>30-day easy returns</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <Shield className="h-5 w-5 text-primary" />
                <span>Authenticity guaranteed</span>
              </div>
            </div>
          </div>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <section className="mt-20 pt-12 border-t border-border">
            <h2 className="font-display text-2xl md:text-3xl font-medium mb-8">You May Also Like</h2>
            <ProductGrid products={relatedProducts} />
          </section>
        )}
      </div>
    </Layout>
  );
}
