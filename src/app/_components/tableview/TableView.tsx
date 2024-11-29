import React, { useEffect, useState } from "react";
import { getClassroomInfo } from "@/utils/locationShortener";
import { colors } from "@/app/_configs/lectureColumns";
import { dayDeMapping, LectureItem } from "@/app/_configs/commonInfo";


interface ParsedLecture {
    day: number;
    startPeriod: number;
    endPeriod: number;
    name: string;
    location: string;
}

interface TableViewProps {
    timeTableData: LectureItem[];
}

const TableView: React.FC<TableViewProps> = ( {timeTableData,} ) => {
    const [lectures, setLectures] = useState<ParsedLecture[]>([]);
    const days = [0, 1, 2, 3, 4];
    const periods = Array.from({ length: 8 }, (_, i) => i + 1);
    

    useEffect(() => {
        if (Array.isArray(timeTableData)) {
            console.log(timeTableData);
            const parsedLectures = timeTableData.flatMap((lecture: LectureItem) => {
                // 0 ~ 4 사이의 정수를 기반으로 요일 판별 
                const day = lecture.classTime ? Math.floor(lecture.classTime[0] / 10) : -1;
                console.log(day)
                // classTime 속성을 사용
                const periods = lecture.classTime as number[];
                if (periods.length < 1) return [];
                return [
                    {
                        day,
                        startPeriod: periods[0] % 10,
                        endPeriod: periods[periods.length - 1] % 10,
                        name: lecture.name,
                        location: lecture.location,
                    },
                ];
            });
            setLectures(parsedLectures);
        }
    }, [timeTableData]);

    const getLectureForCell = (day: number, period: number) => {
        return lectures.find((lecture) => lecture.day === day && period >= lecture.startPeriod && period <= lecture.endPeriod);
    };

    return (
        <div className="container mx-auto p-4">
            <div className="overflow-x-auto">
                <div
                    className="grid grid-cols-6 gap-0 p-px border-1 rounded-xl border-gray-200 dark:border-gray-600"
                    style={{
                        gridTemplateColumns: "1fr 3fr 3fr 3fr 3fr 3fr",
                    }}
                >
                    <div className="p-2"></div> {/* 코너 셀 */}
                    {days.map((day) => (
                        <div
                            key={day}
                            className="p-2 text-center text-gray-600 dark:text-gray-200 font-normal border-l border-gray-200 dark:border-gray-600"
                        >
                            {dayDeMapping[day as keyof typeof dayDeMapping]}
                        </div>
                    ))}
                    {periods.map((period) => (
                        <React.Fragment key={period}>
                            <div className="p-2 text-center text-gray-600 dark:text-gray-200 font-normal border-t border-gray-200 dark:border-gray-600">
                                {period}
                            </div>
                            {days.map((day, index) => {
                                const lecture = getLectureForCell(day, period);
                                console.log(lecture);
                                const isLectureStart = lecture && lecture.startPeriod === period;
                                const lectureLength = lecture ? lecture.endPeriod - lecture.startPeriod + 1 : 1;
                                const lectureColor = lecture ? colors[(index + 4) % colors.length] : "";
                                

                                return isLectureStart ? (
                                    <div
                                        key={`${day}-${period}`}
                                        className={`p-2 text-center border-t border-l border-gray-200 dark:border-gray-600`}
                                        style={{
                                            backgroundColor: `${lectureColor}`,
                                            gridRow: `span ${lectureLength}`,
                                            display: "flex",
                                            alignItems: "center",
                                            justifyContent: "center",
                                        }}
                                    >
                                        {lecture && (
                                            <div>
                                                <div className="text-sm sm:text-md text-white font-semibold">{lecture.name}</div>
                                                <div className="text-xs sm:text-sm text-white/80 mt-1">{getClassroomInfo(lecture.location)}</div>
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
