"use client";

import React, { Suspense } from "react";
import { useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { useRouter } from "next/navigation";
import Header from "@/app/_components/Header";
import PageInfo from "@/app/_components/PageInfo";

const localStorageCheck = () => {
    try {
        const testKey = "__test__";
        localStorage.setItem(testKey, testKey);
        localStorage.removeItem(testKey);
        return true;
    } catch (err) {
        console.log(err, "can not use local storage");
        return false;
    }
};

// GoogleCallback 컴포넌트
const GoogleCallback = () => {
    const searchParams = useSearchParams();
    const router = useRouter();

    useEffect(() => {
        const code = searchParams.get("code");

        if (code) {
            const fetchAccessToken = async () => {
                try {
                    const apiUrl = process.env.NEXT_PUBLIC_API_URL;

                    const response = await fetch(`${apiUrl}oauth/google/login?auth_code=${code}`, {
                        method: "GET",
                    });

                    if (!response.ok) {
                        const errorData = await response.json();
                        console.error("로그인 실패 응답:", errorData);
                        alert("로그인 처리 중 오류가 발생했습니다.");
                        router.push("/login");
                        return;
                    }

                    const data = await response.json();

                    if (data.access_token) {
                        if (localStorageCheck()) {
                            localStorage.setItem("access_token", data.access_token);
                            localStorage.setItem("refresh_token", data.refresh_token);
                            localStorage.setItem("user_email", data.user_email);
                        } else {
                            console.error("로컬 스토리지 사용 불가능");
                            alert("로컬 스토리지가 사용 불가능한 환경입니다.");
                        }

                        router.push("/");
                    } else {
                        console.error("로그인 실패: 액세스 토큰 없음");
                        alert("로그인 실패");
                        router.push("/login");
                    }
                } catch (error) {
                    console.error("로그인 처리 중 오류가 발생했습니다:", error);
                    alert("로그인 처리 중 오류가 발생했습니다.");
                    router.push("/login");
                }
            };

            fetchAccessToken();
        }
    }, [searchParams, router]);

    return (
        <>
            <Header />
            <PageInfo title="구글 로그인" description="잠시만 기다려주세요." />
            <div className="flex justify-center items-center">
                <h3>로그인 처리 중...</h3>
            </div>
        </>
    );
};

export default function SuspenseWrapper() {
    return (
        <Suspense fallback={<div>로딩 중...</div>}>
            <GoogleCallback />
        </Suspense>
    );
}
