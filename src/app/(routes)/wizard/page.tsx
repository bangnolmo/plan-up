"use client";

import Header from "@/app/_components/Header";
import PageInfo from "@/app/_components/PageInfo";
import TableView from "@/app/_components/tableview/TableView";
import { timeTable } from "@/app/_configs/commonInfo";
import { getAllTimeTables } from "@/utils/timeTableManager";
import { useEffect, useState } from "react";


const Wizard = () => {

    const [timeTableData, setTimeTableData] = useState<timeTable[]>([]);

    // 시간표 데이터를 로드
    useEffect(() => {
        const loadTimeTableData = () => {
            const allTimeTables = getAllTimeTables();
            const firstTimeTableKey = Object.keys(allTimeTables)[0]; // 첫 번째 시간표를 사용
            const firstTimeTable = allTimeTables[firstTimeTableKey] || [];
            setTimeTableData(firstTimeTable);
        };

        loadTimeTableData();
    }, []);

    return (
        <>
            <Header />
            <PageInfo title="시간표 만들기" description="시간표를 만들 수 있어요." />
            <TableView timeTableData={timeTableData}/>
        </>
    );
};

export default Wizard;
