import clsx from "clsx";
import Image from "next/image";

export default function LogoSquare({ size }: { size?: "sm" | undefined }) {
  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:3001";
  
  return (
    <div
      className={clsx(
        "flex flex-none items-center justify-center",
        {
          "h-[40px] w-[40px]": !size,
          "h-[30px] w-[30px]": size === "sm",
        },
      )}
    >
      <Image
        src={`${backendUrl}/uploads/products/logo.png`}
        alt="Khai Nguyen Pharma Logo"
        width={size === "sm" ? 30 : 40}
        height={size === "sm" ? 30 : 40}
        className="object-contain"
        priority
      />
    </div>
  );
}
