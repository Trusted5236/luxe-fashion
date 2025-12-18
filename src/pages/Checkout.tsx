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

const steps = ['Shipping', 'Payment', 'Review'];

export default function Checkout() {
  const [currentStep, setCurrentStep] = useState(0);
  const [shippingMethod, setShippingMethod] = useState('standard');
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
    cardNumber: '',
    expiry: '',
    cvv: '',
    cardName: '',
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const shipping = shippingMethod === 'express' ? 25 : (total >= 200 ? 0 : 15);
  const grandTotal = total + shipping;

  const handleSubmit = () => {
    if (currentStep < 2) {
      setCurrentStep(currentStep + 1);
      return;
    }

    // Place order
    toast({
      title: 'Order placed successfully!',
      description: 'Thank you for your purchase. You will receive a confirmation email shortly.',
    });
    clearCart();
    navigate('/');
  };

  if (items.length === 0) {
    navigate('/cart');
    return null;
  }

  return (
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

                  <div className="pt-6">
                    <h3 className="font-medium mb-4">Shipping Method</h3>
                    <RadioGroup value={shippingMethod} onValueChange={setShippingMethod}>
                      <div className="flex items-center justify-between p-4 border border-border rounded cursor-pointer hover:border-foreground transition-colors">
                        <div className="flex items-center gap-3">
                          <RadioGroupItem value="standard" id="standard" />
                          <div>
                            <Label htmlFor="standard" className="cursor-pointer font-medium">
                              Standard Shipping
                            </Label>
                            <p className="text-sm text-label">5-7 business days</p>
                          </div>
                        </div>
                        <span>{total >= 200 ? 'Free' : '$15.00'}</span>
                      </div>
                      <div className="flex items-center justify-between p-4 border border-border rounded cursor-pointer hover:border-foreground transition-colors mt-2">
                        <div className="flex items-center gap-3">
                          <RadioGroupItem value="express" id="express" />
                          <div>
                            <Label htmlFor="express" className="cursor-pointer font-medium">
                              Express Shipping
                            </Label>
                            <p className="text-sm text-label">2-3 business days</p>
                          </div>
                        </div>
                        <span>$25.00</span>
                      </div>
                    </RadioGroup>
                  </div>
                </div>
              )}

              {currentStep === 1 && (
                <div className="space-y-6">
                  <h2 className="font-display text-2xl font-medium">Payment Information</h2>

                  <div className="space-y-2">
                    <Label htmlFor="cardName">Name on Card</Label>
                    <Input
                      id="cardName"
                      name="cardName"
                      value={formData.cardName}
                      onChange={handleInputChange}
                      className="h-12 bg-input-bg border-border"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="cardNumber">Card Number</Label>
                    <div className="relative">
                      <CreditCard className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-label" />
                      <Input
                        id="cardNumber"
                        name="cardNumber"
                        placeholder="1234 5678 9012 3456"
                        value={formData.cardNumber}
                        onChange={handleInputChange}
                        className="h-12 pl-10 bg-input-bg border-border"
                      />
                    </div>
                  </div>

                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="expiry">Expiry Date</Label>
                      <Input
                        id="expiry"
                        name="expiry"
                        placeholder="MM/YY"
                        value={formData.expiry}
                        onChange={handleInputChange}
                        className="h-12 bg-input-bg border-border"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="cvv">CVV</Label>
                      <Input
                        id="cvv"
                        name="cvv"
                        placeholder="123"
                        value={formData.cvv}
                        onChange={handleInputChange}
                        className="h-12 bg-input-bg border-border"
                      />
                    </div>
                  </div>
                </div>
              )}

              {currentStep === 2 && (
                <div className="space-y-6">
                  <h2 className="font-display text-2xl font-medium">Review Your Order</h2>

                  <div className="space-y-4">
                    <div className="p-4 bg-muted rounded">
                      <h3 className="font-medium mb-2">Shipping Address</h3>
                      <p className="text-sm text-body">
                        {formData.firstName} {formData.lastName}<br />
                        {formData.address}<br />
                        {formData.city}, {formData.state} {formData.zip}
                      </p>
                    </div>

                    <div className="p-4 bg-muted rounded">
                      <h3 className="font-medium mb-2">Payment Method</h3>
                      <p className="text-sm text-body">
                        Card ending in {formData.cardNumber.slice(-4) || '****'}
                      </p>
                    </div>

                    <div className="p-4 bg-muted rounded">
                      <h3 className="font-medium mb-4">Items</h3>
                      <div className="space-y-3">
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
                              <p className="font-medium text-sm truncate">{item.product.name}</p>
                              <p className="text-xs text-label">
                                {item.size} / {item.color} × {item.quantity}
                              </p>
                            </div>
                            <span className="text-sm font-medium">
                              ${(item.product.price * item.quantity).toFixed(2)}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Navigation */}
              <div className="mt-8 flex gap-4">
                {currentStep > 0 && (
                  <Button
                    variant="outline"
                    size="lg"
                    onClick={() => setCurrentStep(currentStep - 1)}
                  >
                    Back
                  </Button>
                )}
                <Button
                  variant="luxury"
                  size="lg"
                  className="flex-1"
                  onClick={handleSubmit}
                >
                  {currentStep === 2 ? 'Place Order' : 'Continue'}
                </Button>
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
  );
}
