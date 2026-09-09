import type { ProductCategory } from '@/services/categories/categories.interface';

export interface ProductDetail {
  id: number;
  name: string;
  slug: string;
  description?: string | null;
  short_description?: string | null;
  price: string | number;
  final_price?: string | number;
  discount_percentage?: string | number;
  stock_quantity?: number;
  stock_availability?: string;
  availability_type?: 'in_stock' | 'request_only';
  is_request_only?: boolean;
  brand?: string | null;
  manufacturer?: string | null;
  tablet_count?: string | null;
  requires_prescription?: boolean;
  category_name?: string | null;
  category_id?: number | null;
  category?: ProductCategory | null;
  sku?: string | null;
  primary_image?: { image?: string | null; image_url?: string | null; alt_text?: string | null } | null;
  images?: { image?: string | null; image_url?: string | null; alt_text?: string | null }[] | null;
  active_discount?: { value?: string | number; type?: string } | null;
  color?: string | null;
}
