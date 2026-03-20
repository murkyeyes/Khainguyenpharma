import clsx from "clsx";
import Image from "next/image";

export default function LogoSquare({ size }: { size?: "sm" | undefined }) {
  // Use a hardcoded inline SVG for logo to avoid backend dependency and potential Vercel logo
  return (
    <div
      className={clsx(
        "flex flex-none items-center justify-center rounded-lg bg-blue-600 text-white font-bold",
        {
          "h-[40px] w-[40px] text-lg": !size,
          "h-[30px] w-[30px] text-sm": size === "sm",
        },
      )}
    >
      KN
    </div>
  );
}
