import { serviceRequest } from "@/services/http-client";
import type { ProductDetailData, ProductListData, ProductListParams } from "./products.interface";

export const ProductsService = {
  getProducts(token: string, params: ProductListParams = {}): Promise<ProductListData> {
    return serviceRequest<ProductListData>("/api/products", { token, query: params });
  },

  getProductBySlug(token: string, slug: string): Promise<ProductDetailData> {
    return serviceRequest<ProductDetailData>(`/api/products/${encodeURIComponent(slug)}`, { token });
  },
};
