"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Header from "@/app/_components/Header";
import PageInfo from "@/app/_components/PageInfo";

const Wizard = () => {
    const router = useRouter();

    useEffect(() => {
        const accessToken = localStorage.getItem("access_token");

        if (!accessToken) {
            router.push("/login");
        }
    }, [router]);

    return (
        <>
            <Header />
            <PageInfo title="내 프로필" description="프로필 정보를 확인하고 변경할 수 있습니다." />
        </>
    );
};

export default Wizard;
