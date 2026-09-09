import { backendRequest } from "@/lib/api/backend-client";
import type { BundleDetailData, BundleListData } from "./bundles.interface";

export const BundlesServiceServer = {
  async getBundles(token: string | null, locale?: string | null): Promise<BundleListData> {
    const result = await backendRequest<BundleListData>("/bundles", { token, locale });
    return result.data;
  },

  async getBundleBySlug(
    token: string | null,
    slug: string,
    locale?: string | null
  ): Promise<BundleDetailData> {
    const result = await backendRequest<BundleDetailData>(`/bundles/${encodeURIComponent(slug)}`, {
      token,
      locale,
    });
    return result.data;
  },
};
