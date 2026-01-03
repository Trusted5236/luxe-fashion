import { useEffect, useRef } from 'react';
import { createOrderPaypal, captureOrderPaypal } from '@/services/api';

interface PayPalButtonProps {
  orderId: string;
  onSuccess: () => void;
  onError?: (error: any) => void;
}

export function PayPalButton({ orderId, onSuccess, onError }: PayPalButtonProps) {
  const paypalRef = useRef<HTMLDivElement>(null);
  const buttonRendered = useRef(false);

  useEffect(() => {
    if (!orderId || buttonRendered.current) return;

    const PAYPAL_CLIENT_ID = import.meta.env.VITE_PAYPAL_CLIENT_ID;

    const loadScript = () => {
      return new Promise((resolve, reject) => {
        if (window.paypal) {
          resolve(window.paypal);
          return;
        }

        const script = document.createElement('script');
        script.src = `https://www.paypal.com/sdk/js?client-id=${PAYPAL_CLIENT_ID}&currency=USD&disable-funding=card,paylater`;
        script.onload = () => resolve(window.paypal);
        script.onerror = reject;
        document.body.appendChild(script);
      });
    };

    loadScript()
      .then((paypal: any) => {
        if (!paypalRef.current || buttonRendered.current) return;

        paypal.Buttons({
          createOrder: async () => {
            try {
              const data = await createOrderPaypal(orderId);
              
              if (!data.success) {
                throw new Error(data.message || 'Failed to create order');
              }
              
              return data.paypalOrderId;
            } catch (error) {
              console.error('Error creating PayPal order:', error);
              throw error;
            }
          },

          onApprove: async (data: any) => {
            try {
              const result = await captureOrderPaypal(orderId, data.orderID);
              
              if (result.success) {
                onSuccess();
              } else {
                throw new Error(result.message || 'Payment failed');
              }
            } catch (error) {
              console.error('Error capturing payment:', error);
              onError?.(error);
            }
          },

          onError: (err: any) => {
            console.error('PayPal Error:', err);
            onError?.(err);
          },

          style: {
            layout: 'vertical',
            color: 'gold',
            shape: 'rect',
            label: 'paypal'
          }
        }).render(paypalRef.current);

        buttonRendered.current = true;
      })
      .catch((error) => {
        console.error('PayPal SDK Error:', error);
        onError?.(error);
      });

    return () => {
      buttonRendered.current = false;
    };
  }, [orderId, onSuccess, onError]);

  return (
    <div className="w-full">
      <div ref={paypalRef} className="min-h-[150px]" />
    </div>
  );
}