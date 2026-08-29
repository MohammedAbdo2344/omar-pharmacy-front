export interface ProductListParams {
  category_id?: number;
  min_price?: number;
  max_price?: number;
  sort_by_price?: "low_to_high" | "high_to_low";
  search?: string;
  per_page?: number;
  page?: number;
  [key: string]: string | number | undefined;
}

export interface ProductPagination {
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
}

export interface ProductListData {
  products: Record<string, unknown>[];
  pagination: ProductPagination;
}

export interface ProductDetailData {
  product: Record<string, unknown>;
  related_products: Record<string, unknown>[];
}
