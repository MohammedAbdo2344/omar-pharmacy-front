import { serviceRequest } from "@/services/http-client";
import type { CategoryRecord } from "./categories.interface";

export const CategoriesService = {
  getCategories(token: string): Promise<CategoryRecord[]> {
    return serviceRequest<CategoryRecord[]>("/api/categories", { token });
  },
};
