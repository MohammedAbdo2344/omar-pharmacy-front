import { serviceRequest } from "@/services/http-client";
import type { CheckoutData, CheckoutPayload } from "./checkout.interface";

export const CheckoutService = {
  checkout(token: string, payload: CheckoutPayload): Promise<CheckoutData> {
    return serviceRequest<CheckoutData>("/api/checkout", { method: "POST", token, body: payload });
  },
};
