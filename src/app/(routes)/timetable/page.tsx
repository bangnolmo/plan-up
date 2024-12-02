"use client";

import { useEffect, useState } from "react";
import Header from "@/app/_components/Header";
import PageInfo from "@/app/_components/PageInfo";
import TableView from "@/app/_components/tableview/TableView";
import { Lecture, LocalStorageManager } from "@/utils/localStorageManager";
import { Tabs, Tab, Button } from "@nextui-org/react";

const TimeTable = () => {
    const [timeTables, setTimeTables] = useState<{ tableName: string; lectures: Lecture[] }[]>([]);
    const [selectedTab, setSelectedTab] = useState<string>("");

    useEffect(() => {
        // LocalStorage에서 저장된 시간표 데이터를 가져오기
        const storedTimeTables = LocalStorageManager.getAllTimeTableWithLectures();
        setTimeTables(storedTimeTables);
        if (storedTimeTables.length > 0) {
            setSelectedTab(storedTimeTables[0].tableName); // 첫 번째 시간표를 기본 선택
        }
    }, []);

    const handleTabChange = (key: string | number) => {
        setSelectedTab(String(key));
    };

    const handleDeleteTimeTable = () => {
        if (selectedTab) {
            LocalStorageManager.removeTimeTable(selectedTab);
            const updatedTimeTables = timeTables.filter((table) => table.tableName !== selectedTab);
            setTimeTables(updatedTimeTables);
            if (updatedTimeTables.length > 0) {
                setSelectedTab(updatedTimeTables[0].tableName);
            } else {
                setSelectedTab("");
            }
        }
    };

    const selectedLectures = timeTables.find((table) => table.tableName === selectedTab)?.lectures || [];

    return (
        <>
            <Header />
            <PageInfo title="내 시간표" description="저장된 시간표를 확인할 수 있어요." />
            <div style={{ padding: "20px" }}>
                {timeTables.length > 0 ? (
                    <>
                    <div>
                        <Tabs
                            selectedKey={selectedTab}
                            onSelectionChange={handleTabChange}
                            variant="underlined"
                            size="lg"
                            color="primary"
                            className="m-2 mt-0 font-semibold"
                        >
                            {timeTables.map((table) => (
                                <Tab key={table.tableName} title={table.tableName}>
                                    <div style={{ marginTop: "20px" }}>
                                        <TableView items={selectedLectures} />
                                    </div>
                                </Tab>
                            ))}
                        </Tabs>
                    </div>
                    <div style={{ display: "flex", justifyContent: "center", gap: "1rem", alignItems: "center" }}>
                        <Button color="primary">
                            시간표 편집
                        </Button>
                        <Button color="danger" onClick={handleDeleteTimeTable} disabled={!selectedTab}>
                            시간표 삭제
                        </Button>     
                    </div>
                    </>
                ) : (
                    <p>저장된 시간표가 없습니다. 시간표를 먼저 생성해 주세요.</p>
                )}
            </div>
        </>
    );
};

export default TimeTable;