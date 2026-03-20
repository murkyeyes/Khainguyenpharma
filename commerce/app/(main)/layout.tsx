import { CartProvider } from "components/cart/cart-context";
import { Navbar } from "components/layout/navbar";
import { WelcomeToast } from "components/welcome-toast";
import { getCart } from "lib/api";
import { cookies } from "next/headers";
import { ReactNode } from "react";
import { Toaster } from "sonner";

export default async function MainLayout({
  children,
}: {
  children: ReactNode;
}) {
  const cartId = (await cookies()).get("cartId")?.value;
  const cart = getCart(cartId);

  return (
    <CartProvider cartPromise={cart}>
      <Navbar />
      <main>
        {children}
        <Toaster closeButton />
        <WelcomeToast />
      </main>
    </CartProvider>
  );
}
