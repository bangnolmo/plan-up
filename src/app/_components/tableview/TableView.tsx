import React, { useEffect, useState } from "react";
import { getLocalStorage } from "@/app/_managers/localStorageManager";

interface Lecture {
    sub_num: string;
    name: string;
    grade: number;
    course_type: string;
    credits: number;
    professor: string;
    note: string;
    period: string;
    location: string;
    groupAttribute: number;
}

interface ParsedLecture {
    day: string;
    startPeriod: number;
    endPeriod: number;
    name: string;
}

const TableView: React.FC = () => {
    const [lectures, setLectures] = useState<ParsedLecture[]>([]);
    const days = ["월", "화", "수", "목", "금"];
    const periods = Array.from({ length: 8 }, (_, i) => i + 1);

    useEffect(() => {
        const rawData = getLocalStorage("clickedItemData") as Lecture[] | null;
        if (rawData) {
            const parsedLectures = rawData.flatMap((lecture) => {
                const periodParts = lecture.period.split(" ");
                const day = periodParts[0];
                const periods = periodParts.slice(1).map(Number);
                if (periods.length < 1) return [];
                return [
                    {
                        day,
                        startPeriod: periods[0],
                        endPeriod: periods[periods.length - 1],
                        name: lecture.name,
                    },
                ];
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
                <div
                    className="grid grid-cols-6 gap-0 p-px border-1 rounded-xl border-gray-200 dark:border-gray-600" // Set gap-0 here to remove grid item spacing
                    style={{
                        gridTemplateColumns: "1fr 3fr 3fr 3fr 3fr 3fr", // First column is fixed width, others are evenly distributed
                    }}
                >
                    <div className="p-2"></div> {/* Corner cell */}
                    {days.map((day) => (
                        <div
                            key={day}
                            className="p-2 text-center text-gray-500 dark:text-gray-200 font-normal border-l border-gray-200 dark:border-gray-600"
                        >
                            {day}
                        </div> // Adding border
                    ))}
                    {periods.map((period) => (
                        <React.Fragment key={period}>
                            <div className="p-2 text-center text-gray-500 dark:text-gray-200 font-normal border-t border-gray-200 dark:border-gray-600">
                                {period}
                            </div>
                            {days.map((day) => {
                                const lecture = getLectureForCell(day, period);
                                const isLectureStart = lecture && lecture.startPeriod === period;
                                const lectureLength = lecture ? lecture.endPeriod - lecture.startPeriod + 1 : 1;

                                return isLectureStart ? (
                                    <div
                                        key={`${day}-${period}`}
                                        className={`p-2 ${lecture ? "bg-blue-100 dark:bg-blue-900" : ""} text-center border-t border-l border-gray-200 dark:border-gray-600`}
                                        style={{
                                            gridRow: `span ${lectureLength}`,
                                            display: "flex",
                                            alignItems: "center",
                                            justifyContent: "center",
                                        }}
                                    >
                                        {lecture && <div className="text-sm">{lecture.name}</div>}
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
