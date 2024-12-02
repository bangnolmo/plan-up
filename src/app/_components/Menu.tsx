"use client";

import { DropdownItem, DropdownMenu } from "@nextui-org/react";
import { useRouter } from "next/navigation";
import { ThemeSwitcher } from "@/app/_components/ThemeSwitcher";
import { useEffect, useState } from "react";

export default function Menu() {
    const router = useRouter();
    const [userEmail, setUserEmail] = useState<string | null>(null);

    // TODO : 빌드하기 전 localStorage 예외조건 추가해야 함
    const accessToken = localStorage.getItem("access_token");
    const storedEmail = localStorage.getItem("user_email");

    useEffect(() => {
        const validateUserEmail = async () => {
            if (accessToken && storedEmail) {
                console.log("accessToken:", accessToken);
                console.log("storedEmail:", storedEmail);

                try {
                    const apiUrl = process.env.NEXT_PUBLIC_API_URL;
                    console.log("API URL:", apiUrl);
                    const response = await fetch(`${apiUrl}oauth/google/auth?email=${storedEmail}`, {
                        method: "GET",
                        headers: {
                            auth: `Bearer ${accessToken}`,
                        },
                    });

                    console.log("API Response Status:", response.status);

                    const data = await response.json();
                    console.log("API Response Data:", data);

                    if (data.res === "ok!" && data.auth) {
                        console.log("유효한 이메일:", storedEmail);
                        setUserEmail(storedEmail);
                    } else {
                        handleInvalidAuth(data.res);
                    }
                } catch (error) {
                    console.error("유효성 검사 오류:", error);
                    handleInvalidAuth("error");
                }
            } else {
                console.log("accessToken 또는 storedEmail 없음");
            }
        };

        validateUserEmail();
    }, [accessToken, storedEmail]);

    const handleInvalidAuth = (errorCode: string) => {
        if (errorCode === "error" || errorCode === "invalid email") {
            alert("로그인 정보가 잘못되었거나 만료되었습니다. 다시 로그인해주세요.");
            router.push("/login");
        } else if (errorCode === "expire") {
            // refresh_token을 이용해 access_token을 갱신하는 로직을 여기에 추가해야 할 수 있습니다.
            alert("세션이 만료되었습니다. 다시 로그인해주세요.");
            router.push("/login");
        }
    };

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
