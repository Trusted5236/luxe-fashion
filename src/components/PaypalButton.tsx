import { useEffect, useRef, useState } from 'react';
import { createOrderPaypal, captureOrderPaypal } from '@/services/api';

interface PayPalButtonProps {
  orderId: string;
  onSuccess: () => void;
  onError?: (error: any) => void;
}

export function PayPalButton({ orderId, onSuccess, onError }: PayPalButtonProps) {
  const paypalRef = useRef<HTMLDivElement>(null);
  const buttonRendered = useRef(false);
  const [isLoading, setIsLoading] = useState(true);

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
      // ... your existing button config
    }).render(paypalRef.current)
      .then(() => setIsLoading(false)); // Add this

    buttonRendered.current = true;
  })
  .catch((error) => {
    console.error('PayPal SDK Error:', error);
    setIsLoading(false); // Add this
    onError?.(error);
  });

    return () => {
      buttonRendered.current = false;
    };
  }, [orderId, onSuccess, onError]);

  return (
  <div className="w-full">
    {isLoading && (
      <div className="flex justify-center items-center min-h-[150px]">
        <div className="w-12 h-12 border-4 border-primary/30 border-t-primary rounded-full animate-spin"></div>
      </div>
    )}
    <div ref={paypalRef} className={isLoading ? 'hidden' : 'min-h-[150px]'} />
  </div>
);
}