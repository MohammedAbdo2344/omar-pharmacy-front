export interface CategoryRecord {
  id: number;
  name: string;
  slug: string;
  description: string | null;
  image: string | null;
  parent_id: number | null;
  is_active: boolean;
  sort_order: number;
  color: string | null;
  created_at: string | null;
  updated_at: string | null;
}
