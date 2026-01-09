import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CreditCard, Truck, Check } from 'lucide-react';
import { Layout } from '@/components/layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useCart } from '@/contexts/CartContext';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import { createOrder } from '@/services/api';
import { PayPalButton } from '@/components/PaypalButton';
import SEO from '@/components/SEO';

const steps = ['Shipping', 'Payment']; // Removed 'Review'

export default function Checkout() {
  const [currentStep, setCurrentStep] = useState(0);
  const [shippingMethod, setShippingMethod] = useState('standard');
  const [orderId, setOrderId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const { items, total, clearCart } = useCart();
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  // Form state
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: user?.email || '',
    phone: '',
    address: '',
    city: '',
    state: '',
    zip: '',
    country: 'USA',
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const shipping = shippingMethod === 'express' ? 25 : (total >= 200 ? 0 : 15);
  const grandTotal = total + shipping;

  const handleSubmit = async () => {
    if (currentStep === 0) {
      if (!formData.firstName || !formData.lastName || !formData.email || 
          !formData.phone || !formData.address || !formData.city || 
          !formData.state || !formData.zip) {
        toast({
          title: 'Validation Error',
          description: 'Please fill in all required fields',
          variant: 'destructive'
        });
        return;
      }
      
      setLoading(true);

      try {
        const response = await createOrder({
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          phone: formData.phone,
          address: formData.address,
          city: formData.city,
          state: formData.state,
          country: formData.country,
          zip: formData.zip
        });

        const data = await response;

        if (data.orderId) {
          setOrderId(data.orderId);
          setCurrentStep(1);
          toast({
            title: 'Success',
            description: 'Shipping information saved',
          });
        } else {
          toast({
            title: 'Error',
            description: data.message || 'Failed to create order',
            variant: 'destructive'
          });
        }
      } catch (error) {
        console.error('Error:', error);
        toast({
          title: 'Error',
          description: 'Failed to create order',
          variant: 'destructive'
        });
      } finally {
        setLoading(false);
      }
      return;
    }
  };

  const handlePaymentSuccess = () => {
    clearCart();
    toast({
      title: 'Payment Successful!',
      description: 'Your order has been confirmed.',
    });
    // Navigate to order confirmation page with order details
    navigate('/order-success', { 
      state: { 
        orderId, 
        orderDetails: {
          items,
          total: grandTotal,
          shipping: formData
        }
      } 
    });
  };

  if (items.length === 0) {
    navigate('/cart');
    return null;
  }

  return (
    <>
      <SEO 
        title="Secure Checkout | Luxe Fashion - Complete Your Purchase"
        description="Complete your luxury fashion purchase with our secure checkout. Multiple payment options including PayPal, encrypted transactions, and complimentary shipping on orders over $200."
        keywords="luxury fashion checkout, secure payment designer clothing, premium fashion purchase, Luxe Fashion payment, secure designer checkout, luxury payment gateway"
        canonical="/checkout"
        noIndex={true}
        ogTitle="Secure Checkout | Luxe Fashion"
        ogDescription="Complete your luxury fashion purchase with our secure checkout system."
        ogImage="https://luxe-fashion-three.vercel.app/og-checkout.jpg"
        ogType="website"
        twitterCard="summary"
        twitterTitle="Secure Checkout | Luxe Fashion"
        twitterDescription="Complete your luxury fashion purchase securely."
        twitterImage="https://luxe-fashion-three.vercel.app/og-checkout.jpg"
      />

    <Layout showFooter={false}>
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Steps */}
          <div className="flex items-center justify-center mb-12">
            {steps.map((step, index) => (
              <div key={step} className="flex items-center">
                <div className="flex items-center gap-2">
                  <div
                    className={cn(
                      "w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-colors",
                      index <= currentStep
                        ? "bg-foreground text-background"
                        : "bg-muted text-label"
                    )}
                  >
                    {index < currentStep ? <Check className="h-4 w-4" /> : index + 1}
                  </div>
                  <span
                    className={cn(
                      "text-sm font-medium",
                      index <= currentStep ? "text-foreground" : "text-label"
                    )}
                  >
                    {step}
                  </span>
                </div>
                {index < steps.length - 1 && (
                  <div
                    className={cn(
                      "w-16 h-px mx-4",
                      index < currentStep ? "bg-foreground" : "bg-border"
                    )}
                  />
                )}
              </div>
            ))}
          </div>

          <div className="grid lg:grid-cols-5 gap-8">
            {/* Form */}
            <div className="lg:col-span-3">
              {currentStep === 0 && (
                <div className="space-y-6">
                  <h2 className="font-display text-2xl font-medium">Shipping Information</h2>

                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="firstName">First Name</Label>
                      <Input
                        id="firstName"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleInputChange}
                        className="h-12 bg-input-bg border-border"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="lastName">Last Name</Label>
                      <Input
                        id="lastName"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleInputChange}
                        className="h-12 bg-input-bg border-border"
                      />
                    </div>
                  </div>

                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        className="h-12 bg-input-bg border-border"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone</Label>
                      <Input
                        id="phone"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        className="h-12 bg-input-bg border-border"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="address">Address</Label>
                    <Input
                      id="address"
                      name="address"
                      value={formData.address}
                      onChange={handleInputChange}
                      className="h-12 bg-input-bg border-border"
                    />
                  </div>

                  <div className="grid sm:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="city">City</Label>
                      <Input
                        id="city"
                        name="city"
                        value={formData.city}
                        onChange={handleInputChange}
                        className="h-12 bg-input-bg border-border"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="state">State</Label>
                      <Input
                        id="state"
                        name="state"
                        value={formData.state}
                        onChange={handleInputChange}
                        className="h-12 bg-input-bg border-border"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="zip">ZIP Code</Label>
                      <Input
                        id="zip"
                        name="zip"
                        value={formData.zip}
                        onChange={handleInputChange}
                        className="h-12 bg-input-bg border-border"
                      />
                    </div>
                  </div>
                </div>
              )}

              {currentStep === 1 && (
                <div className="space-y-6">
                  <h2 className="font-display text-2xl font-medium">Payment</h2>
                  <p className="text-body">Complete your payment using PayPal</p>
                  
                  <PayPalButton
                    orderId={orderId!}
                    onSuccess={handlePaymentSuccess}
                    onError={(error) => {
                      toast({
                        title: 'Payment Error',
                        description: 'An error occurred during payment',
                        variant: 'destructive'
                      });
                    }}
                  />
                </div>
              )}

              {/* Navigation */}
              <div className="mt-8 flex gap-4">
                {currentStep > 0 && (
                  <Button
                    variant="outline"
                    size="lg"
                    onClick={() => setCurrentStep(0)}
                  >
                    Back
                  </Button>
                )}
                {currentStep === 0 && (
                  <Button
                    variant="luxury"
                    size="lg"
                    className="flex-1"
                    onClick={handleSubmit}
                    disabled={loading}
                  >
                    {loading ? 'Processing...' : 'Continue to Payment'}
                  </Button>
                )}
              </div>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-2">
              <div className="sticky top-24 p-6 bg-card border border-border">
                <h3 className="font-display text-lg font-medium mb-4">Order Summary</h3>

                <div className="max-h-48 overflow-y-auto space-y-3 pb-4 border-b border-border">
                  {items.map((item) => (
                    <div
                      key={`${item.product.id}-${item.size}-${item.color}`}
                      className="flex items-center gap-3"
                    >
                      <img
                        src={item.product.images[0]}
                        alt={item.product.name}
                        className="w-12 h-16 object-cover"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">{item.product.name}</p>
                        <p className="text-xs text-label">Qty: {item.quantity}</p>
                      </div>
                      <span className="text-sm">
                        ${(item.product.price * item.quantity).toFixed(2)}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="py-4 space-y-2 border-b border-border">
                  <div className="flex justify-between text-sm">
                    <span className="text-body">Subtotal</span>
                    <span>${total.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-body">Shipping</span>
                    <span>{shipping === 0 ? 'Free' : `$${shipping.toFixed(2)}`}</span>
                  </div>
                </div>

                <div className="flex justify-between pt-4">
                  <span className="font-semibold">Total</span>
                  <span className="font-semibold text-lg">${grandTotal.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
    </>
  );
}