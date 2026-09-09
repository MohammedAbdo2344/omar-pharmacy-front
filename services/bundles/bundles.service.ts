import { serviceRequest } from "@/services/http-client";
import type { BundleDetailData, BundleListData } from "./bundles.interface";

export const BundlesService = {
  getBundles(token: string): Promise<BundleListData> {
    return serviceRequest<BundleListData>("/api/bundles", { token });
  },

  getBundleBySlug(token: string, slug: string): Promise<BundleDetailData> {
    return serviceRequest<BundleDetailData>(`/api/bundles/${encodeURIComponent(slug)}`, { token });
  },
};
