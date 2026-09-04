export interface HomeCategory {
  id: number;
  name: string;
  slug: string;
  image: string | null;
  color: string | null;
  products_count: number;
}

export interface PrimaryImage {
  id: number;
  product_id: number;
  image_url: string;
  alt_text: string;
  sort_order: number;
  is_primary: boolean;
  created_at: string;
  updated_at: string;
}

export interface ActiveDiscount {
  id: number;
  product_id: number;
  type: string;
  value: string;
  ends_at: string;
  max_quantity: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface HomeProduct {
  id: number;
  name: string;
  slug: string;
  description: string | null;
  tablet_count: string | null;
  price: string;
  stock_quantity: number;
  primary_image: PrimaryImage | null;
  active_discount: ActiveDiscount | null;
  flag: "best_seller" | "popular" | "high_offer";
  color: string | null;
}

export interface HomeData {
  categories: HomeCategory[];
  products: HomeProduct[];
}
