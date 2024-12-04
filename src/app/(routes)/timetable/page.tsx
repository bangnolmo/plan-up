"use client";

import { useEffect, useState } from "react";
import Header from "@/app/_components/Header";
import PageInfo from "@/app/_components/PageInfo";
import TableView from "@/app/_components/tableview/TableView";
import { getTimeTablesByUserEmail, getLecturesByTimeTable, deleteTimeTable } from "@/utils/apis/timetable";
import { Button } from "@nextui-org/react";
import { Lecture } from "@/utils/localStorageManager";
import { enClassTime } from "@/utils/localStorageManager";

const TimeTable = () => {
    const [timeTables, setTimeTables] = useState<{ id: number; name: string }[]>([]); // 시간표 리스트
    const [selectedTimeTable, setSelectedTimeTable] = useState<{ tableIdx: number; tableName: string; lectures: (Lecture & { classTime: number[] })[] } | null>(null); // 선택된 시간표

    type TimeTable = {
        id: number; // table_id
        name: string; // 시간표 이름
        year: number; // 연도 (예: 202420)
        owner: string; // 소유자 이메일
    };

    useEffect(() => {
        const fetchTimeTables = async () => {
            try {
                const userEmail = localStorage.getItem("user_email");
                if (!userEmail) {
                    console.error("User email is missing");
                    return;
                }

                const fetchedTables = await getTimeTablesByUserEmail(userEmail);
                const simplifiedTables = fetchedTables.map((table: TimeTable) => ({
                    id: table.id,
                    name: table.name,
                }));

                setTimeTables(simplifiedTables);

                // 첫 번째 시간표 선택
                if (simplifiedTables.length > 0) {
                    loadTimeTable(simplifiedTables[0].id, simplifiedTables[0].name);
                }
            } catch (error) {
                console.error("Failed to fetch timetables:", error);
            }
        };

        fetchTimeTables();
    }, []);

    const loadTimeTable = async (tableIdx: number, tableName: string) => {
        try {
            const lectures = await getLecturesByTimeTable(tableIdx);

            const lecturesWithClassTime = lectures.map((lecture) => ({
                ...lecture,
                classTime: enClassTime(lecture.period), // enClassTime 호출
            }));

            setSelectedTimeTable({
                tableIdx,
                tableName,
                lectures: lecturesWithClassTime,
            });
        } catch (error) {
            console.error("Failed to load timetable:", error);
        }
    };

    const handleDeleteTimeTable = async () => {
        if (!selectedTimeTable) return;
        try {
            await deleteTimeTable(selectedTimeTable.tableIdx);

            const updatedTimeTables = timeTables.filter((table) => table.id !== selectedTimeTable.tableIdx);
            setTimeTables(updatedTimeTables);

            if (updatedTimeTables.length > 0) {
                loadTimeTable(updatedTimeTables[0].id, updatedTimeTables[0].name);
            } else {
                setSelectedTimeTable(null);
            }
        } catch (error) {
            console.error("Failed to delete timetable:", error);
        }
    };

    return (
        <>
            <Header />
            <PageInfo title="내 시간표" description="저장된 시간표를 확인할 수 있어요." />
            <div style={{ display: "flex", padding: "20px", gap: "20px" }}>
                {/* 좌측: 시간표 리스트 */}
                <div style={{ width: "200px", borderRight: "1px solid #ddd", paddingRight: "20px" }}>
                    <h3 style={{ fontSize: "20px", fontWeight: "bold", marginBottom: "5px" }}>시간표 리스트</h3>
                    <ul style={{ listStyle: "none", padding: "0" }}>
                        {timeTables.map((table) => (
                            <li key={table.id} style={{ marginBottom: "10px" }}>
                                <button
                                    style={{
                                        width: "100%",
                                        padding: "10px",
                                        textAlign: "left",
                                        backgroundColor:
                                            selectedTimeTable?.tableIdx === table.id ? "#e0f7fa" : "transparent",
                                        border: "1px solid #ddd",
                                        cursor: "pointer",
                                    }}
                                    onClick={() => loadTimeTable(table.id, table.name)}
                                >
                                    {table.name}
                                </button>
                            </li>
                        ))}
                    </ul>
                </div>

                {/* 우측: 선택된 시간표 */}
                <div style={{ flexGrow: 1 }}>
                    {selectedTimeTable ? (
                        <>
                            <TableView items={selectedTimeTable.lectures} />
                            <div style={{ marginTop: "20px", textAlign: "center" }}>
                                <Button color="danger" onClick={handleDeleteTimeTable}>
                                    시간표 삭제
                                </Button>
                            </div>
                        </>
                    ) : (
                        <p>시간표를 선택해 주세요.</p>
                    )}
                </div>
            </div>
        </>
    );
};

export default TimeTable;
