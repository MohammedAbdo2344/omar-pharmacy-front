import { backendRequest } from "@/lib/api/backend-client";
import type { CategoryRecord } from "./categories.interface";

export const CategoriesServiceServer = {
  async getCategories(token: string | null): Promise<CategoryRecord[]> {
    const result = await backendRequest<CategoryRecord[]>("/categories", { token });
    return result.data;
  },
};
