"use client";

import React from "react";
import { locationShortener } from "@/utils/locationShortener";
import { colors } from "@/app/_configs/lectureColumns";
import { Lecture } from "@/utils/localStorageManager";
import { parsePeriodToArray } from "@/utils/periodParser";

interface TableViewProps {
    items: Lecture[];
    maxRow?: number;
    maxColumn?: number;
    cellWidth?: string;
    cellHeight?: string;
    isPreview?: boolean; // 미리보기 시 작은 시간표 대응
}

const TableView: React.FC<TableViewProps> = ({ items, maxRow = 10, maxColumn = 5, cellHeight = "2fr", cellWidth = "3fr", isPreview = false }) => {
    const days = ["월", "화", "수", "목", "금"].slice(0, maxColumn);
    const periods = Array.from({ length: maxRow }, (_, i) => i + 1);

    const getLectureForCell = (day: string, period: number) => {
        return items.find((lecture) => {
            const lecturePeriods = parsePeriodToArray(lecture.period);
            return lecturePeriods.some((p) => {
                const lectureDay = Math.floor(p / 10);
                const lecturePeriod = (p % 10) + 1;
                return days[lectureDay] === day && lecturePeriod === period;
            });
        });
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
                    <div className="p-2"></div> {/* 코너 셀 */}
                    {days.map((day) => (
                        <div
                            key={day}
                            className="p-1 text-sm text-center text-gray-600 dark:text-gray-200 font-normal border-l border-gray-200 dark:border-gray-600"
                        >
                            {day}
                        </div>
                    ))}
                    {periods.map((period) => (
                        <React.Fragment key={period}>
                            <div className="p-2 text-center text-gray-600 dark:text-gray-200 font-normal border-t border-gray-200 dark:border-gray-600">
                                {period}
                            </div>
                            {days.map((day, index) => {
                                const lecture = getLectureForCell(day, period);
                                const isLectureStart = lecture && (parsePeriodToArray(lecture.period)[0] % 10) + 1 === period;
                                const lectureLength = lecture ? parsePeriodToArray(lecture.period).length : 1;
                                const lectureColor = lecture ? colors[(index + 4) % colors.length] : "";

                                return isLectureStart ? (
                                    <div
                                        key={`${day}-${period}`}
                                        className={`flex items-center text-center justify-center p-2 border-t border-l border-gray-200 dark:border-gray-600`}
                                        style={{
                                            backgroundColor: `${lectureColor}`,
                                            gridRow: `span ${lectureLength}`,
                                        }}
                                    >
                                        {lecture && (
                                            <div>
                                                <div
                                                    className={`${
                                                        isPreview ? "text-xs sm:text-sm" : "text-sm sm:text-md"
                                                    } text-white font-semibold line-clamp-3`}
                                                >
                                                    {lecture.name}
                                                </div>
                                                {!isPreview && (
                                                    <div className="text-xs sm:text-sm text-white/80 mt-1">{locationShortener(lecture.location)}</div>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                ) : lecture ? null : (
                                    <div key={`${day}-${period}`} className="p-2 border-t border-l border-gray-200 dark:border-gray-600"></div>
                                );
                            })}
                        </React.Fragment>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default TableView;
