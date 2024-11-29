"use client";

import Header from "@/app/_components/Header";
import PageInfo from "@/app/_components/PageInfo";
import TableView from "@/app/_components/tableview/TableView";
import { LectureItem } from "@/app/_configs/commonInfo";
import { getLocalStorage } from "@/utils/localStorageManager";

const TimeTable = () => {
    return (
        <>
            <Header />
            <PageInfo title="시간표" description="시간표를 확인할 수 있어요." />
            <TableView timeTableData = {getLocalStorage("cartItem") as LectureItem[]}/>
        </>
    );
};

export default TimeTable;
