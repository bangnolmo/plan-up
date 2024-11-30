import React, { useEffect, useState } from "react";
import { LocalStorageManager } from "@/utils/localStorageManager";
import { locationShortener } from "@/utils/locationShortener";
import { colors } from "@/app/_configs/lectureColumns";

interface ParsedLecture {
    day: string;
    startPeriod: number;
    endPeriod: number;
    name: string;
    location: string;
}

const TableView: React.FC = () => {
    const [lectures, setLectures] = useState<ParsedLecture[]>([]);
    const days = ["월", "화", "수", "목", "금"];
    const periods = Array.from({ length: 8 }, (_, i) => i + 1);

    useEffect(() => {
        // LocalStorage에서 모든 강의를 가져옴
        const rawLectures = LocalStorageManager.getAllLectures(); // 중복 없는 강의 목록
        if (rawLectures) {
            const parsedLectures = rawLectures.flatMap((lecture) => {
                const periodParts = lecture.period.split(" ");
                const day = periodParts[0];
                const periods = periodParts.slice(1).map(Number);
                if (periods.length < 1) return [];
                return periods.map((period) => ({
                    day,
                    startPeriod: period,
                    endPeriod: periods[periods.length - 1],
                    name: lecture.name,
                    location: lecture.location,
                }));
            });
            setLectures(parsedLectures);
        }
    }, []);

    const getLectureForCell = (day: string, period: number) => {
        return lectures.find((lecture) => lecture.day === day && period >= lecture.startPeriod && period <= lecture.endPeriod);
    };

    return (
        <div className="container mx-auto p-4">
            <div className="overflow-x-auto">
                <div className="grid grid-cols-[1fr_repeat(5,_3fr)] sm:grid-rows-[1fr_repeat(8,_2fr)] gap-0 p-px border-1 rounded-xl border-gray-200 dark:border-gray-600">
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
                                const isLectureStart = lecture && lecture.startPeriod === period;
                                const lectureLength = lecture ? lecture.endPeriod - lecture.startPeriod + 1 : 1;
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
                                                <div className="text-sm sm:text-md text-white font-semibold">{lecture.name}</div>
                                                <div className="text-xs sm:text-sm text-white/80 mt-1">{locationShortener(lecture.location)}</div>
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
