import type { Metadata } from "next";
import { Providers } from "./providers";
// import localFont from "next/font/local";

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
        url: "http://34.47.112.126/",
        images: [
            {
                url: "http://34.47.112.126/og-image.png",
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
