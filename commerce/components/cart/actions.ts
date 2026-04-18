"use server";

import { TAGS } from "lib/constants";
import {
  addToCart,
  createCart,
  getCart,
  removeFromCart,
  updateCart,
} from "lib/api";
import { revalidateTag } from "next/cache";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export async function addItem(
  prevState: any,
  payload: string | { selectedVariantId: string | undefined; quantity: number } | undefined
) {
  const selectedVariantId = typeof payload === "string" ? payload : payload?.selectedVariantId;
  const quantity = typeof payload === "string" ? 1 : payload?.quantity || 1;

  if (!selectedVariantId) {
    return "Error adding item to cart";
  }

  try {
    let cartId = (await cookies()).get("cartId")?.value;
    let cart;

    if (cartId) {
      cart = await getCart(cartId);
    }

    if (!cartId || !cart) {
      cart = await createCart();
      cartId = cart.id!;
      (await cookies()).set("cartId", cartId);
    }

    await addToCart(cartId, [{ merchandiseId: selectedVariantId, quantity }]);
    revalidateTag(TAGS.cart);
  } catch (e) {
    return "Error adding item to cart";
  }
}

export async function removeItem(prevState: any, merchandiseId: string) {
  try {
    const cartId = (await cookies()).get("cartId")?.value;

    if (!cartId) {
      return "Missing cart ID";
    }

    const cart = await getCart(cartId);

    if (!cart) {
      return "Error fetching cart";
    }

    const lineItem = cart.lines.find(
      (line) => line.merchandise.id === merchandiseId
    );

    if (lineItem && lineItem.id) {
      await removeFromCart(cartId, [lineItem.id]);
      revalidateTag(TAGS.cart);
    } else {
      return "Item not found in cart";
    }
  } catch (e) {
    return "Error removing item from cart";
  }
}

export async function updateItemQuantity(
  prevState: any,
  payload: {
    merchandiseId: string;
    quantity: number;
  }
) {
  const { merchandiseId, quantity } = payload;

  try {
    const cartId = (await cookies()).get("cartId")?.value;

    if (!cartId) {
      return "Missing cart ID";
    }

    const cart = await getCart(cartId);

    if (!cart) {
      return "Error fetching cart";
    }

    const lineItem = cart.lines.find(
      (line) => line.merchandise.id === merchandiseId
    );

    if (lineItem && lineItem.id) {
      if (quantity === 0) {
        await removeFromCart(cartId, [lineItem.id]);
      } else {
        await updateCart(cartId, [
          {
            id: lineItem.id,
            merchandiseId,
            quantity,
          },
        ]);
      }
    } else if (quantity > 0) {
      // If the item doesn't exist in the cart and quantity > 0, add it
      await addToCart(cartId, [{ merchandiseId, quantity }]);
    }

    revalidateTag(TAGS.cart);
  } catch (e) {
    console.error(e);
    return "Error updating item quantity";
  }
}

export async function redirectToCheckout() {
  const cartId = (await cookies()).get("cartId")?.value;
  
  if (!cartId) {
    return;
  }

  let cart = await getCart(cartId);
  
  if (cart) {
    redirect(cart.checkoutUrl);
  }
}

export async function createCartAndSetCookie() {
  let cart = await createCart();
  (await cookies()).set("cartId", cart.id!);
}

export async function getCartAction() {
  const cartId = (await cookies()).get("cartId")?.value;
  if (!cartId) return null;
  const cart = await getCart(cartId);
  return cart;
}
