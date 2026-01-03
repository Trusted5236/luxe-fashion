import { useLocation, useNavigate } from 'react-router-dom';
import { Check } from 'lucide-react';
import { Layout } from '@/components/layout';
import { Button } from '@/components/ui/button';

export default function OrderSuccess() {
  const location = useLocation();
  const navigate = useNavigate();
  const { orderId, orderDetails } = location.state || {};

  if (!orderId) {
    navigate('/');
    return null;
  }

  return (
    <Layout>
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-2xl mx-auto text-center">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <Check className="w-10 h-10 text-green-600" />
          </div>
          
          <h1 className="font-display text-4xl font-medium mb-4">
            Order Confirmed!
          </h1>
          
          <p className="text-lg text-body mb-2">
            Thank you for your purchase
          </p>
          
          <p className="text-body mb-8">
            Order ID: <span className="font-mono font-semibold">{orderId}</span>
          </p>

          <div className="bg-muted p-6 rounded-lg mb-8 text-left">
            <h2 className="font-medium mb-4">Order Details</h2>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-body">Items:</span>
                <span>{orderDetails?.items?.length || 0}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-body">Total:</span>
                <span className="font-semibold">${orderDetails?.total?.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-body">Shipping to:</span>
                <span>{orderDetails?.shipping?.city}, {orderDetails?.shipping?.state}</span>
              </div>
            </div>
          </div>

          <p className="text-sm text-body mb-8">
            A confirmation email has been sent to {orderDetails?.shipping?.email}
          </p>

          <div className="flex gap-4 justify-center">
            <Button
              variant="outline"
              size="lg"
              onClick={() => navigate('/shop')}
            >
              Continue Shopping
            </Button>
            <Button
              variant="luxury"
              size="lg"
              onClick={() => navigate('/orders')}
            >
              View Orders
            </Button>
          </div>
        </div>
      </div>
    </Layout>
  );
}