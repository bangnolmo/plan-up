"use client";

import { useEffect, useState } from "react";
import Header from "@/app/_components/Header";
import PageInfo from "@/app/_components/PageInfo";
import TableView from "@/app/_components/tableview/TableView";
import { Lecture, LocalStorageManager } from "@/utils/localStorageManager";

const TimeTable = () => {
    const [lectures, setLectures] = useState<Lecture[]>([]); // Lecture 타입을 사용

    useEffect(() => {
        // LocalStorage에서 강의 데이터를 가져오기
        const rawLectures = LocalStorageManager.getAllLectures();
        if (rawLectures) {
            const parsedLectures = rawLectures.flatMap((lecture) => {
                const periodParts = lecture.period.split(" ");
                const day = periodParts[0];
                const periods = periodParts.slice(1).map(Number);
                if (periods.length < 1) return [];
                return periods.map((period) => ({
                    ...lecture, // 기존 강의 정보도 포함
                    day,
                    startPeriod: period,
                    endPeriod: periods[periods.length - 1],
                }));
            });
            setLectures(parsedLectures); // 상태에 강의 데이터를 설정
        }
    }, []);

    return (
        <>
            <Header />
            <PageInfo title="시간표" description="시간표를 확인할 수 있어요." />
            {/* TableView에 lectures 데이터를 전달 */}
            <TableView items={lectures} />
        </>
    );
};

export default TimeTable;
