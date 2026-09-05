import { backendRequest } from "@/lib/api/backend-client";
import type { ProductDetailData, ProductListData, ProductListParams } from "./products.interface";

export const ProductsServiceServer = {
  async getProducts(
    token: string | null,
    params: ProductListParams = {},
    locale?: string | null
  ): Promise<ProductListData> {
    const result = await backendRequest<ProductListData>("/products", { token, query: params, locale });
    return result.data;
  },

  async getProductBySlug(token: string | null, slug: string, locale?: string | null): Promise<ProductDetailData> {
    const result = await backendRequest<ProductDetailData>(`/products/${encodeURIComponent(slug)}`, {
      token,
      locale,
    });
    return result.data;
  },
};
