/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Header from "@/app/_components/Header";
import PageInfo from "@/app/_components/PageInfo";
import { validateUserEmail, removeLocalUserData } from "@/utils/apis/login";
import { Button, Spacer } from "@nextui-org/react";

const MyPage = () => {
    const router = useRouter();
    const [userEmail, setUserEmail] = useState<string | null>(null);

    useEffect(() => {
        if (typeof window === "undefined") return;
        const accessToken = localStorage.getItem("access_token");
        const userEmail = localStorage.getItem("user_email");

        if (!accessToken || !userEmail) {
            router.push("/login");
            return;
        }

        setUserEmail(userEmail); // 로컬 스토리지에서 이메일을 가져와서 state에 저장

        const checkUserValidity = async () => {
            try {
                const { res, auth } = await validateUserEmail(accessToken, userEmail);

                if (!auth) {
                    removeLocalUserData();
                    router.push("/login");
                }
            } catch (error) {
                console.error("User validation failed:", error);
                alert("접속 후 오랜 시간이 경과되어 다시 로그인해야 합니다.");
                removeLocalUserData();
                router.push("/login");
            }
        };
        checkUserValidity();
    }, [router]);

    const handleLogout = () => {
        removeLocalUserData(); // 로컬 스토리지에서 사용자 정보 삭제
        router.push("/login"); // 로그인 페이지로 리다이렉트
    };

    const handleClearLocalStorage = () => {
        localStorage.removeItem("access_token");
        localStorage.removeItem("user_email");
        alert("로컬 스토리지가 초기화되었습니다.");
        router.push("/login"); // 로그인 페이지로 리다이렉트
    };

    return (
        <>
            <Header />
            <PageInfo title="내 프로필" description="프로필 정보를 확인하고 변경할 수 있습니다." />

            <div className="container mx-auto p-6">
                <div className="mt-4 space-y-4">
                    <div className="flex flex-row items-center">
                        <p className="text-sm w-16"> 나의 이메일</p>
                        <Spacer x={16} />
                        <p>{userEmail}</p>
                    </div>
                    <div className="flex flex-row items-center">
                        <p className="text-sm w-16"> 로그아웃</p>
                        <Spacer x={16} />
                        <Button onPress={handleLogout} color="danger">
                            로그아웃
                        </Button>
                    </div>
                    <div className="flex flex-row items-center">
                        <p className="text-sm w-16"> 데이터 관리</p>
                        <Spacer x={16} />
                        <Button onPress={handleClearLocalStorage} color="default">
                            로컬 저장소 초기화
                        </Button>
                    </div>
                </div>
            </div>
        </>
    );
};

export default MyPage;
