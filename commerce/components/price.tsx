"use client";

import clsx from "clsx";
import { useEffect, useState } from "react";

const Price = ({
  amount,
  className,
  currencyCode = "USD",
  currencyCodeClassName,
}: {
  amount: string;
  className?: string;
  currencyCode: string;
  currencyCodeClassName?: string;
} & React.ComponentProps<"span">) => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <span className={className}>...</span>;
  }

  return (
    <span className={className}>
      <span className={className}>
        {`${new Intl.NumberFormat("vi-VN", {
          style: "currency",
          currency: currencyCode,
          currencyDisplay: "narrowSymbol",
        }).format(parseFloat(amount))}`}
      </span>
      <span className={clsx("ml-1 inline", currencyCodeClassName)}>
        {`${currencyCode}`}
      </span>
    </span>
  );
};

export default Price;
