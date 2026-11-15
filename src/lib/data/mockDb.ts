import { 
  Product, 
  Seller, 
  Order, 
  SupportTicket, 
  PlatformSettings, 
  Review, 
  PaymentMethod,
  UgandanOriginType,
  VerificationStatus,
  SellerOrderFulfillment,
  CartItem
} from "@/types/marketplace";
import { PRODUCTS, SELLERS, INITIAL_PLATFORM_SETTINGS } from "./store";

class MarketplaceStore {
  private products: Product[] = [...PRODUCTS];
  private sellers: Seller[] = [...SELLERS];
  private orders: Order[] = [];
  private tickets: SupportTicket[] = [];
  private reviews: Review[] = [
    {
      id: "rev-1",
      product_id: "prod-1",
      user_name: "Kisaakye Brian",
      user_location: "Kololo, Kampala",
      rating: 5,
      title: "Best Arabica coffee in East Africa!",
      comment: "Incredible aroma and distinct dark chocolate notes. Arrived fresh within 24 hours of ordering in Kampala. Proudly Ugandan!",
      is_verified_purchase: true,
      created_at: "2024-02-18T14:20:00Z"
    },
    {
      id: "rev-2",
      product_id: "prod-2",
      user_name: "Atuhaire Brenda",
      user_location: "Entebbe",
      rating: 5,
      title: "Impeccable leather craftsmanship",
      comment: "The stitching and solid brass hardware on this tote are top tier. Much better quality than imported bags at double the price.",
      is_verified_purchase: true,
      created_at: "2024-02-19T09:15:00Z"
    },
    {
      id: "rev-3",
      product_id: "prod-3",
      user_name: "Namaganda Joan",
      user_location: "Ntinda, Kampala",
      rating: 5,
      title: "Colors are even brighter in person!",
      comment: "Wore this Kitenge wrap dress to an introduction ceremony and received compliments all afternoon. Tailored to perfection.",
      is_verified_purchase: true,
      created_at: "2024-02-20T11:40:00Z"
    }
  ];
  private settings: PlatformSettings = { ...INITIAL_PLATFORM_SETTINGS };

  constructor() {
    this.initDefaultOrders();
  }

  private initDefaultOrders() {
    this.orders = [
      {
        id: "ord-1001",
        order_number: "MIU-2026-8841",
        customer_name: "Wasswa Emmanuel",
        customer_phone: "+256 701 445566",
        customer_email: "wasswa.e@gmail.com",
        delivery_address: "Plot 24, Kira Road, Kamwokya",
        district: "Kampala",
        city_town: "Kampala",
        subtotal_ugx: 75000,
        discount_ugx: 0,
        delivery_fee_ugx: 5000,
        total_payable_ugx: 80000,
        payment_method: "mtn_momo",
        payment_status: "completed",
        order_status: "in_transit",
        tracking_number: "TRK-UG-998241",
        created_at: new Date(Date.now() - 3600000 * 24).toISOString(),
        estimated_delivery_date: new Date(Date.now() + 3600000 * 24).toISOString(),
        items: [
          {
            id: "item-1",
            order_id: "ord-1001",
            product_id: "prod-1",
            product_name: "Mount Elgon AA Reserve Arabica Coffee (500g)",
            product_image: "https://images.unsplash.com/photo-1587734195503-904fca47e0e9?auto=format&fit=crop&w=400&q=80",
            seller_id: "seller-1",
            seller_name: "Mount Elgon Coffee Cooperative",
            quantity: 1,
            unit_price_ugx: 35000,
            total_price_ugx: 35000,
          },
          {
            id: "item-2",
            order_id: "ord-1001",
            product_id: "prod-4",
            product_name: "Raw Wild Rwenzori Forest Honey (1kg)",
            product_image: "https://images.unsplash.com/photo-1587049352847-4a222e784d38?auto=format&fit=crop&w=400&q=80",
            seller_id: "seller-3",
            seller_name: "Rwenzori Pure Apiaries",
            quantity: 1,
            unit_price_ugx: 40000,
            total_price_ugx: 40000,
          }
        ],
        seller_fulfillments: [
          {
            id: "ful-1",
            seller_id: "seller-1",
            seller_name: "Mount Elgon Coffee Cooperative",
            subtotal_ugx: 35000,
            commission_amount_ugx: 2800,
            payout_amount_ugx: 32200,
            fulfillment_status: "dispatched",
            tracking_notes: "Dispatched via Kampala Courier Hub",
            items: []
          },
          {
            id: "ful-2",
            seller_id: "seller-3",
            seller_name: "Rwenzori Pure Apiaries",
            subtotal_ugx: 40000,
            commission_amount_ugx: 3200,
            payout_amount_ugx: 36800,
            fulfillment_status: "processing",
            tracking_notes: "Being packaged at Kasese depot",
            items: []
          }
        ]
      }
    ];
  }

  // Products
  getProducts(): Product[] {
    return this.products;
  }

  getProductBySlug(slug: string): Product | undefined {
    return this.products.find((p) => p.slug === slug);
  }

  getProductById(id: string): Product | undefined {
    return this.products.find((p) => p.id === id);
  }

  getProductsByCategory(categorySlug: string): Product[] {
    return this.products.filter((p) => {
      // Find category
      return p.category_name?.toLowerCase().includes(categorySlug.replace("-", " "));
    });
  }

  addProduct(product: Omit<Product, "id" | "created_at" | "sales_count" | "rating" | "review_count">): Product {
    const newProduct: Product = {
      ...product,
      id: `prod-${Date.now()}`,
      created_at: new Date().toISOString(),
      sales_count: 0,
      rating: 5.0,
      review_count: 0,
    };
    this.products.unshift(newProduct);
    return newProduct;
  }

  updateProduct(id: string, updates: Partial<Product>): Product | null {
    const index = this.products.findIndex((p) => p.id === id);
    if (index === -1) return null;
    this.products[index] = { ...this.products[index], ...updates };
    return this.products[index];
  }

  deleteProduct(id: string): boolean {
    const initialLen = this.products.length;
    this.products = this.products.filter((p) => p.id !== id);
    return this.products.length < initialLen;
  }

  // Sellers
  getSellers(): Seller[] {
    return this.sellers;
  }

  getSellerBySlug(slug: string): Seller | undefined {
    return this.sellers.find((s) => s.slug === slug);
  }

  getSellerById(id: string): Seller | undefined {
    return this.sellers.find((s) => s.id === id);
  }

  registerSeller(data: {
    business_name: string;
    owner_name: string;
    email: string;
    phone: string;
    business_location: string;
    district: string;
    business_description: string;
    registration_number?: string;
    origin_type: UgandanOriginType;
  }): Seller {
    const slug = data.business_name.toLowerCase().replace(/[^a-z0-9]+/g, "-");
    const newSeller: Seller = {
      id: `seller-${Date.now()}`,
      ...data,
      slug,
      logo_url: "https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=200&q=80",
      banner_url: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=1200&q=80",
      verification_status: "pending",
      rating: 5.0,
      rating_count: 0,
      product_count: 0,
      commission_rate: this.settings.default_commission_rate,
      is_active: false,
      joined_date: new Date().toISOString().split("T")[0],
      whatsapp_number: data.phone,
    };
    this.sellers.push(newSeller);
    return newSeller;
  }

  updateSellerStatus(id: string, status: VerificationStatus, isActive?: boolean): Seller | null {
    const seller = this.sellers.find((s) => s.id === id);
    if (!seller) return null;
    seller.verification_status = status;
    if (typeof isActive === "boolean") {
      seller.is_active = isActive;
    } else if (status === "approved" || status === "verified_ugandan") {
      seller.is_active = true;
    }
    return seller;
  }

  // Orders
  getOrders(): Order[] {
    return this.orders;
  }

  getOrderById(id: string): Order | undefined {
    return this.orders.find((o) => o.id === id || o.order_number === id);
  }

  getOrdersBySeller(sellerId: string): Order[] {
    return this.orders.filter((o) => 
      o.items.some((i) => i.seller_id === sellerId)
    );
  }

  createOrder(data: {
    customer_name: string;
    customer_phone: string;
    customer_email: string;
    delivery_address: string;
    district: string;
    city_town: string;
    delivery_instructions?: string;
    payment_method: PaymentMethod;
    cartItems: CartItem[];
    discount_ugx?: number;
  }): Order {
    const orderNum = `MIU-2026-${Math.floor(1000 + Math.random() * 9000)}`;
    const orderId = `ord-${Date.now()}`;
    const deliveryFee = this.settings.delivery_fees[data.district] || 15000;
    const discount = data.discount_ugx || 0;

    let subtotal = 0;
    const items = data.cartItems.map((c, idx) => {
      const lineTotal = c.unit_price_ugx * c.quantity;
      subtotal += lineTotal;
      return {
        id: `oi-${orderId}-${idx + 1}`,
        order_id: orderId,
        product_id: c.product_id,
        product_name: c.product.name,
        product_image: c.product.images[0]?.image_url || "",
        variant_description: c.selected_variant ? Object.values(c.selected_variant).filter(Boolean).join(" / ") : undefined,
        seller_id: c.product.seller_id,
        seller_name: c.product.seller?.business_name || "Ugandan Vendor",
        quantity: c.quantity,
        unit_price_ugx: c.unit_price_ugx,
        total_price_ugx: lineTotal,
      };
    });

    // Group items by seller for multi-vendor order splitting
    const sellerGroups: Record<string, typeof items> = {};
    items.forEach((item) => {
      if (!sellerGroups[item.seller_id]) {
        sellerGroups[item.seller_id] = [];
      }
      sellerGroups[item.seller_id].push(item);
    });

    const sellerFulfillments: SellerOrderFulfillment[] = Object.entries(sellerGroups).map(([sId, sItems], idx) => {
      const sSubtotal = sItems.reduce((sum, item) => sum + item.total_price_ugx, 0);
      const seller = this.getSellerById(sId);
      const commRate = seller?.commission_rate || this.settings.default_commission_rate;
      const commissionAmount = Math.round(sSubtotal * commRate);
      const payoutAmount = sSubtotal - commissionAmount;

      return {
        id: `ful-${orderId}-${idx + 1}`,
        seller_id: sId,
        seller_name: seller?.business_name || sItems[0].seller_name,
        subtotal_ugx: sSubtotal,
        commission_amount_ugx: commissionAmount,
        payout_amount_ugx: payoutAmount,
        fulfillment_status: "pending",
        tracking_notes: "Awaiting seller confirmation & pickup",
        items: sItems,
      };
    });

    const totalPayable = Math.max(0, subtotal - discount + deliveryFee);

    const newOrder: Order = {
      id: orderId,
      order_number: orderNum,
      customer_name: data.customer_name,
      customer_phone: data.customer_phone,
      customer_email: data.customer_email,
      delivery_address: data.delivery_address,
      district: data.district,
      city_town: data.city_town,
      delivery_instructions: data.delivery_instructions,
      subtotal_ugx: subtotal,
      discount_ugx: discount,
      delivery_fee_ugx: deliveryFee,
      total_payable_ugx: totalPayable,
      payment_method: data.payment_method,
      payment_status: data.payment_method === "cash_on_delivery" ? "pending" : "completed",
      order_status: "placed",
      tracking_number: `TRK-UG-${Math.floor(100000 + Math.random() * 900000)}`,
      items,
      seller_fulfillments: sellerFulfillments,
      created_at: new Date().toISOString(),
      estimated_delivery_date: new Date(Date.now() + 86400000 * 2).toISOString(),
    };

    this.orders.unshift(newOrder);

    // Update product stock & sales count
    items.forEach((item) => {
      const prod = this.getProductById(item.product_id);
      if (prod) {
        prod.inventory_quantity = Math.max(0, prod.inventory_quantity - item.quantity);
        prod.sales_count += item.quantity;
      }
    });

    return newOrder;
  }

  updateOrderStatus(orderId: string, status: Order["order_status"]): Order | null {
    const order = this.orders.find((o) => o.id === orderId);
    if (!order) return null;
    order.order_status = status;
    return order;
  }

  updateSellerFulfillmentStatus(orderId: string, sellerId: string, status: SellerOrderFulfillment["fulfillment_status"], notes?: string): boolean {
    const order = this.orders.find((o) => o.id === orderId);
    if (!order) return false;
    const ful = order.seller_fulfillments.find((f) => f.seller_id === sellerId);
    if (!ful) return false;
    ful.fulfillment_status = status;
    if (notes) ful.tracking_notes = notes;
    return true;
  }

  // Reviews
  getReviewsByProductId(productId: string): Review[] {
    return this.reviews.filter((r) => r.product_id === productId);
  }

  addReview(review: Omit<Review, "id" | "created_at">): Review {
    const newRev: Review = {
      ...review,
      id: `rev-${Date.now()}`,
      created_at: new Date().toISOString(),
    };
    this.reviews.unshift(newRev);

    // update product rating
    const prod = this.getProductById(review.product_id);
    if (prod) {
      const prodRevs = this.getReviewsByProductId(prod.id);
      const avg = prodRevs.reduce((acc, r) => acc + r.rating, 0) / prodRevs.length;
      prod.rating = parseFloat(avg.toFixed(1));
      prod.review_count = prodRevs.length;
    }

    return newRev;
  }

  // Support Tickets
  getTickets(): SupportTicket[] {
    return this.tickets;
  }

  createTicket(data: Omit<SupportTicket, "id" | "ticket_number" | "status" | "created_at">): SupportTicket {
    const ticket: SupportTicket = {
      ...data,
      id: `tkt-${Date.now()}`,
      ticket_number: `TKT-UG-${Math.floor(1000 + Math.random() * 9000)}`,
      status: "open",
      created_at: new Date().toISOString(),
    };
    this.tickets.unshift(ticket);
    return ticket;
  }

  // Settings
  getSettings(): PlatformSettings {
    return this.settings;
  }

  updateSettings(updates: Partial<PlatformSettings>): PlatformSettings {
    this.settings = { ...this.settings, ...updates };
    return this.settings;
  }
}

// Global singleton instance
export const mockDb = new MarketplaceStore();
