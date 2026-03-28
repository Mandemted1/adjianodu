export type OrderStatus = "processing" | "in_transit" | "delivered" | "cancelled";

export interface Profile {
  id: string;
  full_name: string | null;
  phone: string | null;
  created_at: string;
}

export interface Product {
  id: string;
  name: string;
  collection: string;
  price: number;
  description: string | null;
  images: string[];
  stock: number;
  featured: boolean;
  bestseller: boolean;
  created_at: string;
}

export interface ShippingAddress {
  name: string;
  address: string;
  city: string;
  region: string;
  country: string;
}

export interface Order {
  id: string;
  user_id: string | null;
  guest_email: string | null;
  status: OrderStatus;
  subtotal: number;
  shipping: number;
  total: number;
  payment_method: string | null;
  paystack_ref: string | null;
  shipping_address: ShippingAddress | null;
  created_at: string;
  order_items?: OrderItem[];
}

export interface OrderItem {
  id: string;
  order_id: string;
  product_id: string | null;
  name: string;
  price: number;
  quantity: number;
  image: string | null;
}
