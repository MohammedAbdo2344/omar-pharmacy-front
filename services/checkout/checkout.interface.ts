export interface CheckoutPayload {
  name: string;
  email: string;
  phone: string;
  city: string;
  area: string;
  building_street: string;
  appartment_number: string;
}

export interface CheckoutOrderItem {
  id: number;
  product_id: number;
  product_name: string;
  quantity: number;
  unit_price: number;
  subtotal: number;
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
