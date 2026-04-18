"use client";

import { PlusIcon } from "@heroicons/react/24/outline";
import clsx from "clsx";
import { addItem } from "components/cart/actions";
import { Product, ProductVariant } from "lib/shopify/types";
import { useSearchParams, useRouter } from "next/navigation";
import { useActionState } from "react";
import { toast } from "sonner";
import { useCart } from "./cart-context";

function SubmitButton({
  availableForSale,
  selectedVariantId,
  isPending,
}: {
  availableForSale: boolean;
  selectedVariantId: string | undefined;
  isPending: boolean;
}) {
  const buttonClasses =
    "relative flex w-full items-center justify-center rounded-full bg-blue-600 p-4 tracking-wide text-white";
  const disabledClasses = "cursor-not-allowed opacity-60 hover:opacity-60";

  if (!availableForSale) {
    return (
      <button disabled className={clsx(buttonClasses, disabledClasses)}>
        Hết hàng
      </button>
    );
  }

  if (!selectedVariantId) {
    return (
      <button
        aria-label="Vui lòng chọn tuỳ chọn"
        disabled
        className={clsx(buttonClasses, disabledClasses)}
      >
        <div className="absolute left-0 ml-4">
          <PlusIcon className="h-5" />
        </div>
        Thêm vào giỏ
      </button>
    );
  }

  return (
    <button
      aria-label="Thêm vào giỏ"
      disabled={isPending}
      className={clsx(buttonClasses, {
        "hover:opacity-90": true,
        [disabledClasses]: isPending,
      })}
    >
      <div className="absolute left-0 ml-4">
        {isPending ? (
          <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
        ) : (
          <PlusIcon className="h-5" />
        )}
      </div>
      {isPending ? "Đang thêm..." : "Thêm vào giỏ"}
    </button>
  );
}

export function AddToCart({ product }: { product: Product }) {
  const { variants, availableForSale } = product;
  const { addCartItem } = useCart();
  const searchParams = useSearchParams();
  const router = useRouter();
  const [message, formAction, isPending] = useActionState(addItem, null);

  const variant = variants.find((variant: ProductVariant) =>
    variant.selectedOptions.every(
      (option) => option.value === searchParams.get(option.name.toLowerCase()),
    ),
  );
  const defaultVariantId = variants.length === 1 ? variants[0]?.id : undefined;
  const selectedVariantId = variant?.id || defaultVariantId;
  const addItemAction = formAction.bind(null, selectedVariantId);
  const finalVariant = variants.find(
    (variant) => variant.id === selectedVariantId,
  )!;

  return (
    <form
      action={async () => {
        const token = localStorage.getItem("user_token");
        if (!token) {
          toast.error("Vui lòng đăng nhập để thêm vào giỏ hàng");
          router.push("/auth/login");
          return;
        }

        addCartItem(finalVariant, product);
        addItemAction();
      }}
    >
      <SubmitButton
        availableForSale={availableForSale}
        selectedVariantId={selectedVariantId}
        isPending={isPending}
      />
      <p aria-live="polite" className="sr-only" role="status">
        {message}
      </p>
    </form>
  );
}
