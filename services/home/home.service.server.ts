import { backendRequest } from "@/lib/api/backend-client";
import type { HomeData } from "./home.interface";

export const HomeServiceServer = {
  async getHome(token: string | null): Promise<HomeData> {
    const result = await backendRequest<HomeData>("/home", { token });
    return result.data;
  },
};
