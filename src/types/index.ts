export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  images: string[];
  category: string;
  sizes: string[];
  colors: { name: string; hex: string }[];
  inStock: boolean;
  sellerId: string;
  sellerName: string;
  rating: number;
  reviewCount: number;
  tags: string[];
  createdAt: string;
}

export interface User {
  id: string;
  email: string;
  name: string;
  role: 'user' | 'seller' | 'admin';
  avatar?: string;
  createdAt?: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
  size: string;
  color: string;
}

export interface Order {
  id: string;
  userId: string;
  items: CartItem[];
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  total: number;
  shippingAddress: {
    name: string;
    address: string;
    city: string;
    state: string;
    zip: string;
    country: string;
  };
  createdAt: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  image: string;
  productCount: number;
}

export interface SignupPayload {
  name: string;
  email: string;
  password: string;
}
export interface loginPayload {
  email: string;
  password: string;
}
export interface requestPasswordPayload {
  email: string;
}

export interface resetPassword {
  resetToken: string;
  newPassword: string;
}

