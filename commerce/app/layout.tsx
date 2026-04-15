import { GeistSans } from "geist/font/sans";
import { ReactNode } from "react";
import "./globals.css";
import { baseUrl } from "lib/utils";

const SITE_NAME = (typeof process !== 'undefined' && process.env?.SITE_NAME) || 'Khải Nguyên Pharma';

export const metadata = {
  metadataBase: new URL(baseUrl),
  title: {
    default: SITE_NAME!,
    template: `%s | ${SITE_NAME}`,
  },
  icons: {
    icon: '/icon',
    apple: '/icon',
  },
  robots: {
    follow: true,
    index: true,
  },
};

export default function RootLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <html lang="vi" className={GeistSans.variable} suppressHydrationWarning>
      <body className="bg-gradient-to-b from-blue-100 to-blue-50 text-gray-900" suppressHydrationWarning>
        {children}
      </body>
    </html>
  );
}
