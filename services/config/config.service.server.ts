import { backendRequest } from "@/lib/api/backend-client";
import type { ConfigData } from "./config.interface";

export const ConfigServiceServer = {
  async getConfig(token: string | null, locale?: string | null): Promise<ConfigData> {
    const result = await backendRequest<ConfigData>("/config", { token, locale });
    return result.data;
  },
};
