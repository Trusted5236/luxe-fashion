import { Link, useNavigate } from 'react-router-dom';
import { Minus, Plus, X, ArrowRight, ShoppingBag } from 'lucide-react';
import { Layout } from '@/components/layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useCart } from '@/contexts/CartContext';
import { cn } from '@/lib/utils';

export default function Cart() {
  const { items, removeItem, updateQuantity, total, itemCount } = useCart();
  const navigate = useNavigate();

  if (items.length === 0) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-md mx-auto text-center">
            <ShoppingBag className="h-16 w-16 mx-auto text-label" />
            <h1 className="mt-6 font-display text-3xl font-medium">Your Cart is Empty</h1>
            <p className="mt-3 text-body">Looks like you haven't added anything to your cart yet.</p>
            <Button asChild variant="luxury" size="lg" className="mt-8">
              <Link to="/products">Continue Shopping</Link>
            </Button>
          </div>
        </div>
      </Layout>
    );
  }

  const shipping = 0;
  const grandTotal = total + shipping;

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <h1 className="font-display text-3xl md:text-4xl font-medium mb-8">Shopping Cart</h1>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-6">
            {items.map((item) => (
              <div
                key={`${item.product.id}-${item.size}-${item.color}`}
                className="flex gap-4 p-4 bg-card border border-border"
              >
                {/* Image */}
                <Link to={`/products/${item.product.id}`} className="w-24 h-32 shrink-0">
                  <img
                    src={item.product.images[0]}
                    alt={item.product.name}
                    className="w-full h-full object-cover"
                  />
                </Link>

                {/* Details */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <Link
                        to={`/products/${item.product.id}`}
                        className="font-display text-lg font-medium hover:text-primary transition-colors"
                      >
                        {item.product.name}
                      </Link>
                      <p className="text-sm text-label">{item.product.sellerName}</p>
                    </div>
                    <button
                      onClick={() => removeItem(item.product.id, item.size, item.color)}
                      className="p-1 text-label hover:text-foreground transition-colors"
                    >
                      <X className="h-5 w-5" />
                    </button>
                  </div>

                  <div className="mt-2 flex items-center gap-4 text-sm text-body">
                    <span>Size: {item.size}</span>
                    {item.color && <span>Color: {item.color}</span>}
                  </div>

                  <div className="mt-4 flex items-center justify-between">
                    {/* Quantity */}
                    <div className="inline-flex items-center border border-border">
                      <button
                        onClick={() => updateQuantity(item.product.id, item.size, item.color, item.quantity - 1)}
                        className="p-2 hover:bg-muted transition-colors"
                      >
                        <Minus className="h-3 w-3" />
                      </button>
                      <span className="w-8 text-center text-sm">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.product.id, item.size, item.color, item.quantity + 1)}
                        className="p-2 hover:bg-muted transition-colors"
                      >
                        <Plus className="h-3 w-3" />
                      </button>
                    </div>

                    {/* Price */}
                    <span className="font-semibold">
                      ${(item.product.price * item.quantity).toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 p-6 bg-card border border-border">
              <h2 className="font-display text-xl font-medium mb-6">Order Summary</h2>

              <div className="space-y-4 pb-6 border-b border-border">
                <div className="flex justify-between text-sm">
                  <span className="text-body">Subtotal ({itemCount} items)</span>
                  <span>${total.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-body">Shipping</span>
                  <span>{shipping === 0 ? 'Free' : `$${shipping.toFixed(2)}`}</span>
                </div>
                {shipping > 0 && (
                  <p className="text-xs text-primary">
                    Add ${(200 - total).toFixed(2)} more for free shipping
                  </p>
                )}
              </div>

              <div className="flex justify-between py-6 border-b border-border">
                <span className="font-semibold">Total</span>
                <span className="font-semibold text-lg">${grandTotal.toFixed(2)}</span>
              </div>

              {/* Promo Code */}
              <div className="py-6 border-b border-border">
                <div className="flex gap-2">
                  <Input
                    placeholder="Promo code"
                    className="h-10 bg-input-bg border-border"
                  />
                  <Button variant="outline" size="sm">
                    Apply
                  </Button>
                </div>
              </div>

              <Button
                variant="luxury"
                size="xl"
                className="w-full mt-6"
                onClick={() => navigate('/checkout')}
              >
                Proceed to Checkout
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>

              <div className="mt-4 text-center">
                <Link to="/products" className="text-sm text-primary hover:underline">
                  Continue Shopping
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
