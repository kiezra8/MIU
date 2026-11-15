// MIU — Made In Uganda TypeScript Type Definitions

export type VerificationStatus = 'pending' | 'approved' | 'rejected' | 'verified_ugandan';

export type UgandanOriginType = 
  | 'locally_manufactured' 
  | 'locally_grown' 
  | 'locally_processed' 
  | 'handcrafted' 
  | 'locally_assembled';

export type ProductVerificationBadge = 
  | 'verified_made_in_uganda' 
  | 'locally_grown' 
  | 'locally_manufactured' 
  | 'handcrafted' 
  | 'locally_assembled'
  | 'locally_processed'
  | 'standard';

export type PaymentMethod = 
  | 'mtn_momo' 
  | 'airtel_money' 
  | 'cash_on_delivery' 
  | 'card';

export type PaymentStatus = 
  | 'pending' 
  | 'processing' 
  | 'completed' 
  | 'failed' 
  | 'refunded';

export type OrderStatus = 
  | 'placed' 
  | 'processing' 
  | 'dispatched' 
  | 'in_transit' 
  | 'delivered' 
  | 'cancelled';

export type UserRole = 'customer' | 'seller' | 'admin';

export interface UserProfile {
  id: string;
  email: string;
  full_name: string;
  phone: string;
  avatar_url?: string;
  role: UserRole;
  created_at: string;
}

export interface Seller {
  id: string;
  business_name: string;
  slug: string;
  owner_name: string;
  email: string;
  phone: string;
  business_location: string;
  district: string;
  business_description: string;
  registration_number?: string;
  logo_url: string;
  banner_url: string;
  verification_status: VerificationStatus;
  origin_type: UgandanOriginType;
  rating: number;
  rating_count: number;
  product_count: number;
  commission_rate: number; // e.g. 0.08 for 8%
  is_active: boolean;
  joined_date: string;
  whatsapp_number?: string;
}

export interface Subcategory {
  id: string;
  category_id: string;
  name: string;
  slug: string;
  description: string;
  image_url: string;
  display_order: number;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  image_url: string;
  icon_name: string;
  display_order: number;
  subcategories: Subcategory[];
}

export interface ProductVariant {
  id: string;
  name: string; // e.g. "Color", "Size"
  type: 'color' | 'size' | 'material' | 'pack_size';
  value: string; // e.g. "Deep Green", "XL", "500g"
  price_adjustment_ugx: number;
  inventory_quantity: number;
  sku: string;
}

export interface ProductImage {
  id: string;
  image_url: string;
  alt_text: string;
  is_primary: boolean;
}

export interface Product {
  id: string;
  seller_id: string;
  seller?: Seller;
  category_id: string;
  subcategory_id: string;
  category_name?: string;
  subcategory_name?: string;
  name: string;
  slug: string;
  short_description: string;
  full_description: string;
  price_ugx: number;
  compare_at_price_ugx?: number; // Original price when discounted
  discount_percentage?: number;
  inventory_quantity: number;
  sku: string;
  is_featured: boolean;
  is_trending: boolean;
  is_flash_sale: boolean;
  flash_sale_end?: string; // ISO string
  verification_badge: ProductVerificationBadge;
  production_location: string; // e.g. "Mbale, Mt. Elgon Region"
  district: string; // e.g. "Mbale", "Kampala", "Jinja"
  status: 'active' | 'pending' | 'draft' | 'rejected';
  rating: number;
  review_count: number;
  sales_count: number;
  images: ProductImage[];
  variants?: ProductVariant[];
  specifications: Record<string, string>;
  created_at: string;
}

export interface HeroSlide {
  id: number;
  title: string;
  subtitle: string;
  image_url: string;
  cta_text: string;
  cta_link: string;
  badge_text: string;
}

export interface CartItem {
  id: string;
  product_id: string;
  product: Product;
  selected_variant?: {
    color?: string;
    size?: string;
    pack_size?: string;
  };
  quantity: number;
  unit_price_ugx: number;
  total_price_ugx: number;
}

export interface WishlistItem {
  product_id: string;
  product: Product;
  added_at: string;
}

export interface OrderItem {
  id: string;
  order_id: string;
  product_id: string;
  product_name: string;
  product_image: string;
  variant_description?: string;
  seller_id: string;
  seller_name: string;
  quantity: number;
  unit_price_ugx: number;
  total_price_ugx: number;
}

export interface SellerOrderFulfillment {
  id: string;
  seller_id: string;
  seller_name: string;
  subtotal_ugx: number;
  commission_amount_ugx: number;
  payout_amount_ugx: number;
  fulfillment_status: 'pending' | 'processing' | 'dispatched' | 'delivered';
  tracking_notes?: string;
  items: OrderItem[];
}

export interface Order {
  id: string;
  order_number: string; // e.g. "MIU-2026-8492"
  user_id?: string;
  customer_name: string;
  customer_phone: string;
  customer_email: string;
  delivery_address: string;
  district: string;
  city_town: string;
  delivery_instructions?: string;
  subtotal_ugx: number;
  discount_ugx: number;
  delivery_fee_ugx: number;
  total_payable_ugx: number;
  payment_method: PaymentMethod;
  payment_status: PaymentStatus;
  order_status: OrderStatus;
  tracking_number: string;
  items: OrderItem[];
  seller_fulfillments: SellerOrderFulfillment[];
  created_at: string;
  estimated_delivery_date: string;
}

export interface Review {
  id: string;
  product_id: string;
  user_name: string;
  user_location: string;
  rating: number;
  title: string;
  comment: string;
  is_verified_purchase: boolean;
  created_at: string;
}

export interface SupportTicket {
  id: string;
  ticket_number: string;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  category: 'order' | 'payment' | 'delivery' | 'returns' | 'seller' | 'general';
  order_number?: string;
  subject: string;
  message: string;
  priority: 'low' | 'medium' | 'high';
  status: 'open' | 'in_progress' | 'resolved';
  created_at: string;
}

export interface PlatformSettings {
  default_commission_rate: number;
  mtn_momo_enabled: boolean;
  airtel_money_enabled: boolean;
  cash_on_delivery_enabled: boolean;
  support_phone: string;
  support_whatsapp: string;
  support_email: string;
  delivery_fees: Record<string, number>; // District -> Fee in UGX
}
