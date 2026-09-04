import { backendRequest } from "@/lib/api/backend-client";
import type { ProductDetailData, ProductListData, ProductListParams } from "./products.interface";

export const ProductsServiceServer = {
  async getProducts(token: string | null, params: ProductListParams = {}): Promise<ProductListData> {
    const result = await backendRequest<ProductListData>("/products", { token, query: params });
    return result.data;
  },

  async getProductBySlug(token: string | null, slug: string): Promise<ProductDetailData> {
    const result = await backendRequest<ProductDetailData>(`/products/${encodeURIComponent(slug)}`, { token });
    return result.data;
  },
};
