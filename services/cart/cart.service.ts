import { serviceRequest, serviceRequestMessage } from "@/services/http-client";
import type {
  AddToCartPayload,
  CartData,
  CartItemData,
  UpdateCartQuantityPayload,
} from "./cart.interface";

export const CartService = {
  getCart(token: string): Promise<CartData> {
    return serviceRequest<CartData>("/api/cart", { token });
  },

  addItem(token: string, payload: AddToCartPayload): Promise<CartItemData> {
    return serviceRequest<CartItemData>("/api/cart/items", { method: "POST", token, body: payload });
  },

  updateItemQuantity(
    token: string,
    productId: number,
    payload: UpdateCartQuantityPayload
  ): Promise<CartItemData> {
    return serviceRequest<CartItemData>(`/api/cart/items/${productId}`, {
      method: "PUT",
      token,
      body: payload,
    });
  },

  removeItem(token: string, productId: number) {
    return serviceRequestMessage(`/api/cart/items/${productId}`, { method: "DELETE", token });
  },

  clearCart(token: string) {
    return serviceRequestMessage("/api/cart", { method: "DELETE", token });
  },
};
