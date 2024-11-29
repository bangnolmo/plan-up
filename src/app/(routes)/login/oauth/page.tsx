"use client";

import { useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { useRouter } from "next/navigation";
import Header from "@/app/_components/Header";
import PageInfo from "@/app/_components/PageInfo";

const GoogleCallback = () => {
    const searchParams = useSearchParams();
    const router = useRouter();

    useEffect(() => {
        const code = searchParams.get("code");

        if (code) {
            const fetchAccessToken = async () => {
                try {
                    const apiUrl = process.env.NEXT_PUBLIC_API_URL;

                    // TODO : 백엔드 명세 바뀌면 oauth/google/login 로 수정 필요
                    const response = await fetch(`${apiUrl}oauth/google?auth_code=${code}`, {
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
            <PageInfo title="구글 로그인" description="로그인 중..." />
            <div className="flex justify-center items-center">
                <h3>로그인 처리 중...</h3>
            </div>
        </>
    );
};

export default GoogleCallback;
