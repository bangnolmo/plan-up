"use client";

import Header from "@/app/_components/Header";
import PageInfo from "@/app/_components/PageInfo";
import TableView from "@/app/_components/tableview/TableView";
import { CreateTimeTable } from "@/utils/createTimeTable";
import { Lecture, LocalStorageManager } from "@/utils/localStorageManager";
import { useEffect, useState } from "react";
import { Pagination, Tabs, Checkbox, Button, Tab, CheckboxGroup } from "@nextui-org/react";

const Wizard = () => {
    const [classifiedTimeTableData, setClassifiedTimeTableData] = useState<{
        [key: string]: Lecture[][];
    }>({});
    const [currentPage, setCurrentPage] = useState(1);
    const [selectedTab, setSelectedTab] = useState<string>("공강 설정");
    const [selectedDaysOff, setSelectedDaysOff] = useState<string[]>([]);
    const [selectedSchedules, setSelectedSchedules] = useState<Lecture[][]>([]);
    const itemsPerPage = 1;

    useEffect(() => {
        if (selectedTab === "결과 보기") {
            const testData = LocalStorageManager.getAllGroups();
            const generatedKey = generateKeyFromSelectedDays(selectedDaysOff);
            const testResult = CreateTimeTable.getValidCombinations(testData, 23);
            setClassifiedTimeTableData({ [generatedKey]: testResult[generatedKey] || [] });
        }
    }, [selectedTab, selectedDaysOff]);

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
    };

    const handleTabChange = (key: string | number) => {
        setSelectedTab(String(key));
        setCurrentPage(1); // 탭이 변경될 때 페이지를 첫 페이지로 초기화
    };

    const handleDaysOffChange = (day: string[]) => {
        setSelectedDaysOff(day);
    };

    const generateCombinations = () => {
        setSelectedTab("결과 보기");
    };

    const handleScheduleSelect = (schedule: Lecture[]) => {
        setSelectedSchedules((prev) =>
            prev.includes(schedule) ? prev.filter((s) => s !== schedule) : [...prev, schedule]
        );
    };

    const saveSchedule = () => {
        // 시간표 저장 로직 구현
        console.log("Selected Schedules:", selectedSchedules);
    };

    // 선택된 요일을 기반으로 키값 생성
    const generateKeyFromSelectedDays = (days: string[]): string => {
        return days.sort().join("");  // 선택된 요일들을 정렬하고 문자열로 연결하여 키 생성
    };

    // 현재 선택된 요일을 기반으로 키값을 생성하여 해당 데이터만 추출
    const generatedKey = generateKeyFromSelectedDays(selectedDaysOff);
    const currentData = classifiedTimeTableData[generatedKey]?.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    ) || [];

    return (
        <>
            <Header />
            <PageInfo title="시간표 만들기" description="시간표를 만들 수 있어요." />
            <Tabs selectedKey={selectedTab} onSelectionChange={handleTabChange}>
                <Tab key="공강 설정" title="공강설정">
                    <div style={{ padding: "20px" }}>
                        <h3>공강을 원하는 요일을 선택하세요:</h3>
                        <CheckboxGroup
                            label="요일 선택"
                            value={selectedDaysOff}
                            onChange={handleDaysOffChange}
                        >
                            <Checkbox value="월">월요일</Checkbox>
                            <Checkbox value="화">화요일</Checkbox>
                            <Checkbox value="수">수요일</Checkbox>
                            <Checkbox value="목">목요일</Checkbox>
                            <Checkbox value="금">금요일</Checkbox>
                        </CheckboxGroup>
                        <Button onClick={generateCombinations} style={{ marginTop: "20px" }}>
                                조합 생성
                        </Button>
                    </div>        
                </Tab>
                <Tab key="결과 보기" title="결과 보기">
                    <div style={{ padding: "20px" }}>
                        <TableView
                            items={currentData.flat()}  // TableView에 전달할 items
                        />
                        <Pagination
                            total={Math.ceil((classifiedTimeTableData[generatedKey]?.length || 0) / itemsPerPage)}
                            initialPage={1}
                            page={currentPage}
                            onChange={handlePageChange}
                        />
                        <Button onClick={() => setSelectedTab("시간표 편집")} style={{ marginTop: "20px" }}>
                            다음
                        </Button>
                    </div>
                    </Tab>
                    <Tab key="시간표 편집" title="시간표 편집">
                        <div style={{ padding: "20px" }}>
                            <h3>선택한 시간표 편집 및 저장하기</h3>
                            편집 UI 구현
                            <Button onClick={saveSchedule} style={{ marginTop: "20px" }}>
                                내 시간표에 저장
                            </Button>
                        </div>
                    </Tab>  
            </Tabs>
        </>
    );
};

export default Wizard;
