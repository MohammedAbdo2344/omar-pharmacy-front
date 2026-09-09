export interface SubcategoryRecord {
  id: number;
  name: string;
  slug: string;
  image_url: string | null;
  color: string | null;
  parent_id: number | null;
}

export interface CategoryRecord {
  id: number;
  name: string;
  slug: string;
  description: string | null;
  image: string | null;
  image_url?: string | null;
  parent_id: number | null;
  is_active: boolean;
  sort_order: number;
  color: string | null;
  /** Nested active child categories — only returned by `GET /categories` on top-level entries. */
  subcategories?: SubcategoryRecord[];
  created_at: string | null;
  updated_at: string | null;
}

/** The structured (sub)category attached to a product payload. */
export interface ProductCategory {
  id: number;
  name: string;
  slug: string;
  /** Present (non-null) when this category is itself a subcategory. */
  parent: { id: number; name: string; slug: string } | null;
}
