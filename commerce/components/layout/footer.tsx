import Image from "next/image";
import Link from "next/link";

import FooterMenu from "components/layout/footer-menu";
import { getMenu } from "lib/api";
import { Suspense } from "react";

const { SITE_NAME, NEXT_PUBLIC_BACKEND_URL } = process.env;
const backendUrl = NEXT_PUBLIC_BACKEND_URL || "https://khainguyenpharma.onrender.com";
const COMPANY_NAME = process.env?.COMPANY_NAME || 'Khải Nguyên Pharma';

const skeleton = "w-full h-6 animate-pulse rounded-sm bg-neutral-200";

// Tách riêng phần fetch menu vào component async riêng
// để Next.js có thể Suspense-stream mà không block static render
async function FooterMenuAsync() {
  const menu = await getMenu("next-js-frontend-footer-menu");
  return <FooterMenu menu={menu} />;
}

export default async function Footer() {
  const currentYear = new Date().getFullYear();
  const copyrightDate = 2023 + (currentYear > 2023 ? `-${currentYear}` : "");
  const copyrightName = COMPANY_NAME || SITE_NAME || "";

  return (
    <footer className="text-sm text-neutral-500">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-6 border-t border-neutral-200 px-6 py-12 text-sm md:flex-row md:gap-12 md:px-4 min-[1320px]:px-0">
        <div>
          <Link
            className="flex items-center hover:opacity-80 transition-opacity"
            href="/"
          >
            <Image
              src={`${backendUrl}/uploads/products/logo.png`}
              alt={SITE_NAME || "Khải Nguyên Pharma"}
              width={180}
              height={60}
              className="h-10 w-auto object-contain"
            />
          </Link>
        </div>
        <Suspense
          fallback={
            <div className="flex h-[188px] w-[200px] flex-col gap-2">
              <div className={skeleton} />
              <div className={skeleton} />
              <div className={skeleton} />
              <div className={skeleton} />
              <div className={skeleton} />
              <div className={skeleton} />
            </div>
          }
        >
          <FooterMenuAsync />
        </Suspense>
      </div>
      <div className="border-t border-neutral-200 py-6 text-sm">
        <div className="mx-auto flex w-full max-w-7xl flex-col items-center gap-1 px-4 md:flex-row md:gap-0 md:px-4 min-[1320px]:px-0">
          <p suppressHydrationWarning>
            &copy; {copyrightDate} {copyrightName}
            {copyrightName.length && !copyrightName.endsWith(".")
              ? "."
              : ""}{" "}
            All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
