import type { ProductCategory } from "@/services/categories/categories.interface";
import type { BundleRecord } from "@/services/bundles/bundles.interface";

export interface CartProduct {
  id: number;
  name: string;
  slug: string;
  price: number;
  discount_percentage: number;
  final_price: number;
  stock_quantity: number;
  stock_availability: string;
  availability_type?: "in_stock" | "request_only";
  is_request_only?: boolean;
  primary_image: { id: number; image_url: string | null; is_primary: boolean } | null;
  color: string | null;
  category?: ProductCategory | null;
}

export interface CartItemRecord {
  id: number;
  /** `"product"` lines carry `product`; `"bundle"` lines carry `bundle`. */
  type: "product" | "bundle";
  product_id: number | null;
  bundle_id: number | null;
  quantity: number;
  unit_price: number;
  subtotal: number;
  product?: CartProduct;
  bundle?: BundleRecord;
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
    type: "product" | "bundle";
    product_id: number | null;
    bundle_id: number | null;
    quantity: number;
    unit_price: number;
    subtotal: number;
  };
}

export interface AddProductPayload {
  product_id: number;
  quantity?: number;
}

export interface AddBundlePayload {
  type: "bundle";
  bundle_id: number;
  quantity?: number;
}

export type AddToCartPayload = AddProductPayload | AddBundlePayload;

export interface UpdateCartQuantityPayload {
  quantity: number;
}
