"use client";

import { DropdownItem, DropdownMenu } from "@nextui-org/react";
import { useRouter } from "next/navigation";
import { ThemeSwitcher } from "@/app/_components/ThemeSwitcher"; // ThemeSwitcher를 import

export default function Menu() {
    const router = useRouter();

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
            <DropdownItem key="profile" className="h-14 gap-2">
                <p className="font-semibold">플랜업을 사용하려면</p>
                <p className="font-semibold">로그인하세요.</p>
            </DropdownItem>

            <DropdownItem key="timetable">나의 시간표</DropdownItem>

            <DropdownItem key="wizard">시간표 만들기</DropdownItem>

            <DropdownItem key="lecture">개설과목 조회</DropdownItem>

            <DropdownItem key="theme-switcher">
                <ThemeSwitcher />
            </DropdownItem>
        </DropdownMenu>
    );
}
