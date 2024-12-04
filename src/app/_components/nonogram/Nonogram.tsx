"use client";

import React, { useState } from "react";

interface NonogramTableProps {
    onActiveCellsChange?: (activeCells: number[]) => void; // 활성화된 칸 정보를 상위 컴포넌트로 전달하는 콜백 함수
}

const NonogramTable: React.FC<NonogramTableProps> = ({ onActiveCellsChange }) => {
    const maxRow = 10; // 10교시
    const maxColumn = 5; // 월~금
    const cellHeight = "2fr";
    const cellWidth = "3fr";
    const days = ["월", "화", "수", "목", "금"];
    const periods = Array.from({ length: maxRow }, (_, i) => i + 1);

    // 활성화된 칸을 추적하기 위한 상태
    const [activeCells, setActiveCells] = useState<number[]>([]);

    // 클릭 이벤트 핸들러
    const handleCellClick = (dayIndex: number, period: number) => {
        const cellNumber = dayIndex * 10 + period; // 클릭한 칸에 해당하는 숫자 (1~50)
        let updatedActiveCells;
        if (activeCells.includes(cellNumber)) {
            // 이미 활성화된 칸이면 비활성화
            updatedActiveCells = activeCells.filter((cell) => cell !== cellNumber);
        } else {
            // 활성화되지 않은 칸이면 활성화
            updatedActiveCells = [...activeCells, cellNumber];
        }

        setActiveCells(updatedActiveCells);
        if (onActiveCellsChange) {
            onActiveCellsChange(updatedActiveCells); // 상위 컴포넌트로 활성화된 칸 정보 전달
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
                    {/* 요일 헤더 */}
                    {days.map((day) => (
                        <div
                            key={day}
                            className="p-1 text-sm text-center text-gray-600 dark:text-gray-200 font-bold border-l border-gray-200 dark:border-gray-600"
                        >
                            {day}
                        </div>
                    ))}
                    {/* 시간표 그리드 */}
                    {periods.map((period) => (
                        <React.Fragment key={period}>
                            {/* 시간표의 교시 열 (1교시, 2교시 등) */}
                            <div className="p-2 text-center text-sm text-gray-600 dark:text-gray-200 font-bold border-t border-gray-200 dark:border-gray-600">
                                {period}
                            </div>
                            {/* 시간표의 각 칸 */}
                            {days.map((_, dayIndex) => {
                                const cellNumber = dayIndex * 10 + period; // 칸에 해당하는 숫자 계산 (1~50)
                                const isActive = activeCells.includes(cellNumber); // 활성화 여부 확인
                                return (
                                    <div
                                        key={`${dayIndex}-${period}`}
                                        className={`p-2 border-t border-l border-gray-200 dark:border-gray-600 cursor-pointer ${
                                            isActive ? "bg-gray-300" : "bg-white"
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

export default NonogramTable;
