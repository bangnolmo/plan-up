import type { Metadata } from "next";
import { Providers } from "./providers";
import "./globals.css";

export const metadata: Metadata = {
    title: "경기대학교 PLANUP",
    description: "플랜업 시간표 마법사",
    icons: {
        icon: "/favicon.ico",
    },
    openGraph: {
        title: "경기대학교 PLANUP",
        description: "시간표를 쉽게 만들어보세요.",
        url: process.env.NEXT_PUBLIC_FRONTEND_URL || "http://planup.duckdns.org",
        images: [
            {
                url: `${process.env.NEXT_PUBLIC_FRONTEND_URL}/og-image.png`,
                alt: "OG-IMAGE",
            },
        ],
    },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
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
