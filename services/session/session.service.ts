import { serviceRequest } from "@/services/http-client";
import type { SessionData } from "./session.interface";

export const SessionService = {
  /** Creates a new guest session and returns its plain bearer token. */
  create(): Promise<SessionData> {
    return serviceRequest<SessionData>("/api/session", { method: "POST" });
  },
};
