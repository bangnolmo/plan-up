"use client";

import { useEffect } from "react";
import Header from "./_components/Header";
import { BlurGradientBg } from "@/app/_components/BlurGradientBg.module";
import { Search, RefreshCcw, Layers, Github, Link } from "lucide-react";

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
                    <h1 className="text-3xl font-bold mt-4">경기대학교 PLANUP</h1>
                    <p className="text-medium font-medium m-2">플랜업과 함께 다음 학기 시간표를 만들어보세요.</p>
                </div>
            </div>
            <div className="m-4 flex justify-center">
                <h1 className="mt-16 m-4 text-3xl text-center font-bold">더 이상, 시간표를 직접 채우지 마세요</h1>
            </div>
            <div className="mt-12 m-4 flex justify-center space-x-4">
                <div className="flex flex-col items-center w-1/3">
                    <div className="bg-pink-100 p-6 rounded-full mb-4">
                        <Search className="text-pink-600" size={32} />
                    </div>
                    <h1 className="text-xl text-center font-semibold m-4 mb-2">개설과목 조회</h1>
                    <p className="text-center">
                        교양/전공 과목 모두
                        <br />
                        빠짐없이 준비되어 있어요
                    </p>
                </div>
                <div className="flex flex-col items-center w-1/3">
                    <div className="bg-blue-100 p-6 rounded-full mb-4">
                        <RefreshCcw className="text-blue-600" size={32} />
                    </div>
                    <h1 className="text-xl text-center font-semibold m-4 mb-2">매 학기 업데이트</h1>
                    <p className="text-center">
                        주기적인 업데이트를 통해
                        <br />
                        최신 정보를 제공해요
                    </p>
                </div>
                <div className="flex flex-col items-center w-1/3">
                    <div className="bg-green-100 p-6 rounded-full mb-4">
                        <Layers className="text-green-600" size={32} />
                    </div>
                    <h1 className="text-xl text-center font-semibold m-4 mb-2">맞춤형 조합</h1>
                    <p className="text-center">
                        원하는 요일에 공강을 만들고,
                        <br />
                        최고의 시간표를 만들어보세요
                    </p>
                </div>
            </div>

            <footer className="mt-16 p-4">
                <div className="flex justify-center space-x-4">
                    <a
                        href="https://github.com/bangnolmo/plan-up"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-gray-300 hover:text-gray-400"
                    >
                        <Github size={20} />
                    </a>
                    <a href="https://github.com/bangnolmo" target="_blank" rel="noopener noreferrer" className="text-gray-300 hover:text-gray-400">
                        <Link size={20} />
                    </a>
                </div>
                <div className="text-center text-xs text-gray-400 mt-4">
                    <p>2024 오픈소스SW실습 플랜업</p>
                </div>
            </footer>
        </>
    );
}
