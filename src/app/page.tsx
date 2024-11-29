"use client";

import { useEffect } from "react";
import Header from "./_components/Header";
import { BlurGradientBg } from "@/app/_components/BlurGradientBg.module";

export default function Page() {
    useEffect(() => {
        new BlurGradientBg({
            dom: "banner",
            colors: ["#11694e", "#40a07b", "#7fc395", "#138660"],
            loop: true,
        });
    }, []);

    return (
        <>
            <Header />
            <div
                id="banner"
                className="rounded-[2rem] relative z-0 overflow-hidden my-8 mx-4"
                style={{ boxShadow: "0px 4px 20px rgba(0, 0, 0, 0.05)" }}
            >
                <div className="flex flex-col justify-center items-center text-white text-center h-80 z-10 relative">
                    <h1 className="text-3xl font-bold mt-4">더 쉽게 시간표 짜기</h1>
                    <p className="text-medium font-medium m-2">플랜업과 함께 다음 학기 시간표를 만들어보세요.</p>
                </div>
            </div>
        </>
    );
}
