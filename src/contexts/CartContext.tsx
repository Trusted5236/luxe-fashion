import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { CartItem, Product } from '@/types';
import { toast } from '@/hooks/use-toast';
import { addToCart, getCartData, increaseQuantity, decreaseQuantity, deleteQuantity } from '@/services/api';
import { useParams } from 'react-router-dom';

interface CartContextType {
  items: CartItem[];
  addItem: (product: Product, size ?: string, color ?: string, quantity?: number) => void;
  removeItem: (productId: string, size: string, color: string) => void;
  updateQuantity: (productId: string, size: string, color: string, quantity: number) => void;
  clearCart: () => void;
  itemCount: number;
  total: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(false);
  const {id} = useParams()


  const refreshData = async () => {
  setLoading(true)
  try {
    const token = localStorage.getItem("accessToken")
    
    if(!token) {
      console.log('No token found') // Check this
      setLoading(false)
      return
    }

    const cartData = await getCartData()
    console.log('Full cartData:', cartData) // Check this

    if (cartData && cartData.products) {
      console.log('cartData.cart.products:', cartData.products) // Check this
      
      const mappedItems: CartItem[] = cartData.products.map((item: any) => ({
        product: {
          id: typeof item.product === 'string' ? item.product : item.product._id,
          name: item.title,
          price: item.price,
          images: [item.image],
        },
        quantity: item.quantity,
        size: item.size || '',
        color: item.color || '',
      }));

      console.log('Mapped items:', mappedItems) // Check this
      console.log('Setting items to state')
      setItems(mappedItems)
      
      // Check immediately after setting
      console.log('Items length after setting:', mappedItems.length)
    } else {
      console.log('Condition failed - cartData structure:', cartData)
    }
    setLoading(false)
  } catch (error) {
    console.error('Failed to load cart:', error);
    setLoading(false)
  }
}

  useEffect(() => {
  console.log('Items state updated:', items)
  console.log('Item count:', itemCount)
}, [items])

  useEffect(() => {
  refreshData();

  const handleAuthChange = () => {
    refreshData();
  };
  
  window.addEventListener('auth-change', handleAuthChange);
  
  return () => {
    window.removeEventListener('auth-change', handleAuthChange);
  };
}, []);


  const addItem = async (product: Product, size?: string, color?: string, quantity = 1) => {
    setLoading(true)
    try {
      const token = localStorage.getItem("accessToken")
    
        if (!token) {
  window.location.href = '/auth';
  return;
}

      await addToCart(product.id, quantity)
      await refreshData()
      toast({
      title: 'Added to cart',
      description: `${product.name} has been added to your cart`,
    });
    setLoading(false)
    } catch (error) {
      console.error('Add to cart error:', error);
    toast({
      title: 'Error',
      description: error.message || 'Failed to add item to cart',
      variant: 'destructive',
    });
    setLoading(false)
    }
  };

  const removeItem = async (productId: string, size?: string, color?: string) => {
  setLoading(true);
  try {
    const token = localStorage.getItem("accessToken");
    
    if (!token) {
      setLoading(false);
      return;
    }

    // Call the delete API
    await deleteQuantity(productId);
    
    // Refresh cart data after deletion
    await refreshData();
    
    toast({
      title: 'Item removed',
      description: 'The item has been removed from your cart',
    });
    
    setLoading(false);
  } catch (error) {
    console.error('Remove item error:', error);
    toast({
      title: 'Error',
      description: error.message || 'Failed to remove item from cart',
      variant: 'destructive',
    });
    setLoading(false);
  }
};

  const updateQuantity = async (productId: string, size?: string, color?: string, quantity?: number) => {
  setLoading(true);
  try {
    const token = localStorage.getItem("accessToken");
    
    if (!token) {
      setLoading(false);
      return;
    }

    // Find the current item to determine if we're increasing or decreasing
    const currentItem = items.find(
  item => item.product.id === productId && 
          (!size || item.size === size) && 
          (!color || item.color === color)
);

    if (!currentItem) {
      setLoading(false);
      return;
    }

    const currentQuantity = currentItem.quantity;
    
    
    if (quantity && quantity < 1) {
     
      removeItem(productId, size, color);
      setLoading(false);
      return;
    }

   
    if (quantity && quantity > currentQuantity) {
      
      const difference = quantity - currentQuantity;
      await increaseQuantity(productId, difference);
    } else if (quantity && quantity < currentQuantity) {
      
      const difference = currentQuantity - quantity;
      await decreaseQuantity(productId, difference);
    }

   
    await refreshData();
    
    setLoading(false);
  } catch (error) {
    console.error('Update quantity error:', error);
    toast({
      title: 'Error',
      description: error.message || 'Failed to update quantity',
      variant: 'destructive',
    });
    setLoading(false);
  }
};

  const clearCart = () => {
    setItems([]);
  };

  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);
  const total = items.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);

  console.log('count', itemCount)

  return (
    <CartContext.Provider value={{
      items,
      addItem,
      removeItem,
      updateQuantity,
      clearCart,
      itemCount,
      total,
    }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
