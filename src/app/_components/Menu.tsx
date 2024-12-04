"use client";

import { DropdownItem, DropdownMenu } from "@nextui-org/react";
import { useRouter } from "next/navigation";
import { ThemeSwitcher } from "@/app/_components/ThemeSwitcher";
import { useEffect, useState } from "react";

export default function Menu() {
    const router = useRouter();
    const [userEmail, setUserEmail] = useState<string | null>(null);

    useEffect(() => {
        if (typeof window === "undefined") return;
        setUserEmail(localStorage.getItem("user_email"));
    }, []);

    const handleAction = (key: React.Key) => {
        switch (key) {
            case "timetable":
                router.push("/timetable");
                break;
            case "wizard":
                router.push("/wizard");
                break;
            case "lecture":
                router.push("/lecture");
                break;
            case "profile":
                router.push("/my");
                break;
            default:
                break;
        }
    };

    return (
        <DropdownMenu aria-label="Profile Actions" variant="flat" onAction={handleAction}>
            {userEmail ? (
                <DropdownItem key="profile" className="h-10 gap-2">
                    <p className="font-semibold">{userEmail}</p>
                </DropdownItem>
            ) : (
                <DropdownItem key="profile" className="h-14 gap-2">
                    <p className="font-semibold">플랜업을 사용하려면</p>
                    <p className="font-semibold">로그인하세요.</p>
                </DropdownItem>
            )}

            <DropdownItem key="timetable">나의 시간표</DropdownItem>

            <DropdownItem key="wizard">시간표 만들기</DropdownItem>

            <DropdownItem key="lecture">개설과목 조회</DropdownItem>

            <DropdownItem key="theme-switcher" shortcut="⌘+D">
                <ThemeSwitcher />
            </DropdownItem>
        </DropdownMenu>
    );
}
