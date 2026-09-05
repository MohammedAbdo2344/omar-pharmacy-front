export interface CartProduct {
  id: number;
  name: string;
  slug: string;
  price: number;
  discount_percentage: number;
  final_price: number;
  stock_quantity: number;
  stock_availability: string;
  primary_image: { id: number; image_url: string | null; is_primary: boolean } | null;
  color: string | null;
}

export interface CartItemRecord {
  id: number;
  product_id: number;
  quantity: number;
  unit_price: number;
  subtotal: number;
  product: CartProduct;
}

export interface CartData {
  cart: {
    id: number;
    items: CartItemRecord[];
    total: number;
    item_count: number;
  };
}

export interface CartItemData {
  item: {
    id: number;
    product_id: number;
    quantity: number;
    unit_price: number;
    subtotal: number;
  };
}

export interface AddToCartPayload {
  product_id: number;
  quantity?: number;
}

export interface UpdateCartQuantityPayload {
  quantity: number;
}
