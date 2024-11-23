import type { Metadata } from "next";
import { Providers } from "./providers";
// import localFont from "next/font/local";

import "./globals.css";

export const metadata: Metadata = {
  title: "플랜업 PlanUp",
  description: "플랜업 시간표 마법사",
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko">
      <body className="min-h-screen flex justify-center">
        <div className="max-w-[1024px] w-full">
          <Providers>{children}</Providers>
        </div>
      </body>
    </html>
  );
}
