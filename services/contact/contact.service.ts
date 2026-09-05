import { serviceRequestMessage } from "@/services/http-client";
import type { ContactMessagePayload } from "./contact.interface";

export const ContactService = {
  sendMessage(token: string, payload: ContactMessagePayload) {
    return serviceRequestMessage("/api/contact-messages", { method: "POST", token, body: payload });
  },
};
