export interface CheckoutPayload {
  name: string;
  email: string;
  phone: string;
  city: string;
  area: string;
  building_street: string;
  appartment_number: string;
}

export interface CheckoutOrderComponent {
  product_id: number;
  name: string;
  quantity: number;
  unit_price: number;
}

export interface CheckoutOrderItem {
  id: number;
  type?: "product" | "bundle";
  product_id: number | null;
  bundle_id?: number | null;
  /** New snapshot field; legacy payloads used `product_name`. */
  name?: string;
  product_name?: string;
  quantity: number;
  unit_price: number;
  subtotal: number;
  /** Frozen bundle price at purchase time (bundle lines only). */
  bundle_price?: number;
  /** Purchase-time snapshot of the bundle's components (bundle lines only). */
  components?: CheckoutOrderComponent[];
  is_request_only?: boolean;
}

export interface CheckoutData {
  order: {
    id: number;
    order_number: string;
    status: string;
    total: number;
    shipping_cost: number;
    tax: number;
    discount: number;
    shipping_name: string;
    shipping_phone: string;
    shipping_city: string;
    shipping_area: string;
    shipping_building_street: string | null;
    shipping_appartment_number: string | null;
    items: CheckoutOrderItem[];
    created_at: string;
  };
  user: {
    id: number;
    name: string;
    email: string;
    phone: string;
  };
}
