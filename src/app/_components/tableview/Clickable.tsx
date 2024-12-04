"use client";

import { removeLocalUserData, validateUserEmail } from "@/utils/apis/login";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

interface ClickableTableProps {
    onActiveCellsChange?: (activeCells: number[]) => void;
}

const ClickableTable: React.FC<ClickableTableProps> = ({ onActiveCellsChange }) => {
    const router = useRouter();
    const maxRow = 10; // 10교시
    const maxColumn = 5; // 월 ~ 금
    const cellHeight = "2fr";
    const cellWidth = "3fr";
    const days = ["월", "화", "수", "목", "금"];
    const periods = Array.from({ length: maxRow }, (_, i) => i + 1);
    const [activeCells, setActiveCells] = useState<number[]>([]);

    useEffect(() => {
        if (typeof window === "undefined") return;
        const accessToken = localStorage.getItem("access_token");
        const userEmail = localStorage.getItem("user_email");

        if (!accessToken || !userEmail) {
            router.push("/login");
            return;
        }

        const checkUserValidity = async () => {
            try {
                const { auth } = await validateUserEmail(accessToken, userEmail);

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

    const handleCellClick = (dayIndex: number, period: number) => {
        const cellNumber = dayIndex * 10 + period;
        let updatedActiveCells;
        if (activeCells.includes(cellNumber)) {
            updatedActiveCells = activeCells.filter((cell) => cell !== cellNumber);
        } else {
            updatedActiveCells = [...activeCells, cellNumber];
        }

        setActiveCells(updatedActiveCells);
        if (onActiveCellsChange) {
            onActiveCellsChange(updatedActiveCells);
        }
    };

    return (
        <div className="container mx-auto">
            <div className="overflow-x-hidden scrollbar-hide">
                <div
                    className="grid gap-0 p-px border-1 rounded-xl border-gray-200 dark:border-gray-600"
                    style={{
                        gridTemplateRows: `1fr repeat(${maxRow}, ${cellHeight})`,
                        gridTemplateColumns: `1fr repeat(${maxColumn}, ${cellWidth})`,
                    }}
                >
                    {/* 코너 셀 */}
                    <div className="p-2"></div>
                    {days.map((day) => (
                        <div
                            key={day}
                            className="p-1 text-sm text-center text-gray-600 dark:text-gray-200 border-l border-gray-200 dark:border-gray-600"
                        >
                            {day}
                        </div>
                    ))}
                    {periods.map((period) => (
                        <React.Fragment key={period}>
                            <div className="p-2 text-center text-sm text-gray-600 dark:text-gray-200 border-t border-gray-200 dark:border-gray-600">
                                {period}
                            </div>
                            {days.map((_, dayIndex) => {
                                const cellNumber = dayIndex * 10 + period; // 칸에 해당하는 숫자 계산 (1~50)
                                const isActive = activeCells.includes(cellNumber); // 활성화 여부 확인
                                return (
                                    <div
                                        key={`${dayIndex}-${period}`}
                                        className={`p-2 border-t border-l border-gray-200 dark:border-gray-600 cursor-pointer ${
                                            isActive ? "bg-gray-300 dark:bg-gray-700" : "bg-white dark:bg-black"
                                        }`}
                                        onClick={() => handleCellClick(dayIndex, period)}
                                    ></div>
                                );
                            })}
                        </React.Fragment>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default ClickableTable;
