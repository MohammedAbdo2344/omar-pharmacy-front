import { serviceRequest } from "@/services/http-client";
import type { HomeData } from "./home.interface";

export const HomeService = {
  getHome(token: string): Promise<HomeData> {
    return serviceRequest<HomeData>("/api/home", { token });
  },
};
