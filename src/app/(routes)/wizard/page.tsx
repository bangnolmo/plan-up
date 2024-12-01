"use client";

import Header from "@/app/_components/Header";
import PageInfo from "@/app/_components/PageInfo";
import TableView from "@/app/_components/tableview/TableView";
import { CreateTimeTable } from "@/utils/createTimeTable";
import { Lecture, LocalStorageManager } from "@/utils/localStorageManager";
import { useEffect, useState } from "react";
import { Pagination } from "@nextui-org/react";

const Wizard = () => {
    const [classifiedTimeTableData, setClassifiedTimeTableData] = useState<{
        [key: string]: Lecture[][];
    }>({});
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 1;

    useEffect(() => {
        const testData = LocalStorageManager.getAllGroups();
        const testResult = CreateTimeTable.getValidCombinations(testData, 23);
        console.log(testResult);
        setClassifiedTimeTableData(testResult);
    }, []);

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
    };

    // 현재 페이지에 해당하는 데이터 계산
    const currentData = classifiedTimeTableData["금"]?.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    ) || [];

    return (
        <>
            <Header />
            <PageInfo title="시간표 만들기" description="시간표를 만들 수 있어요." />
            <div style={{ padding: "20px" }}>
                <TableView items={currentData.flat()} />
                <Pagination
                    total={Math.ceil((classifiedTimeTableData["금"]?.length || 0) / itemsPerPage)}
                    initialPage={1}
                    page={currentPage}
                    onChange={handlePageChange}
                />
            </div>
        </>
    );
};

export default Wizard;
