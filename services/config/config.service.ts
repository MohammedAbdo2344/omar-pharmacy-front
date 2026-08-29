import { serviceRequest } from "@/services/http-client";
import type { ConfigData } from "./config.interface";

export const ConfigService = {
  getConfig(token: string): Promise<ConfigData> {
    return serviceRequest<ConfigData>("/api/config", { token });
  },
};
