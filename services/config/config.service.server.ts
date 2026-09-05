import { backendRequest } from "@/lib/api/backend-client";
import type { ConfigData } from "./config.interface";

export const ConfigServiceServer = {
  async getConfig(token: string | null): Promise<ConfigData> {
    const result = await backendRequest<ConfigData>("/config", { token });
    return result.data;
  },
};
