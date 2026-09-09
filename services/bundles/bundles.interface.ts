export interface BundleItem {
  product_id: number;
  name: string;
  slug: string;
  quantity: number;
  unit_price: number;
  availability_type: "in_stock" | "request_only";
  primary_image: { image_url: string | null } | null;
}

export interface BundleRecord {
  id: number;
  type: "bundle";
  name: string;
  slug: string;
  sku: string | null;
  description: string | null;
  image_url: string | null;
  /** What the customer pays — do not sum the items. */
  price: number;
  /** Sum of the components' current individual prices, for a struck-through "regular price". */
  components_total_price: number;
  /** Gate "Add to cart" on this. */
  is_available: boolean;
  /** How many whole bundles current component stock supports; `null` = unconstrained. */
  max_available_quantity: number | null;
  starts_at: string | null;
  ends_at: string | null;
  items: BundleItem[];
}

export interface BundleListData {
  bundles: BundleRecord[];
}

export interface BundleDetailData {
  bundle: BundleRecord;
}
