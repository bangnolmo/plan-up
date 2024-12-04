"use client";

import { useEffect, useState } from "react";
import Header from "@/app/_components/Header";
import PageInfo from "@/app/_components/PageInfo";
import TableView from "@/app/_components/tableview/TableView";
import { CreateTimeTable } from "@/utils/createTimeTable";
import { Lecture, LocalStorageManager } from "@/utils/localStorageManager";
import { Table2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { Card, CardHeader, CardBody, Button } from "@nextui-org/react";
import CreateTimetableModal from "@/app/_components/modal/CreateTimetableModal";
import ClickableTable from "@/app/_components/tableview/Clickable";

const Wizard = () => {
    const router = useRouter();
    const [selectedSchedule, setSelectedSchedule] = useState<Lecture[]>([]);
    const [isCreateTimetableModalOpen, setIsCreateTimetableModalOpen] = useState(false);
    const [disabledCells, setDisabledCells] = useState<number[]>([]);
    const [generatedSchedules, setGeneratedSchedules] = useState<Lecture[][]>([]);
    const [isNonogramActive, setIsNonogramActive] = useState(true);

    const handleScheduleClick = (schedule: Lecture[]) => {
        setSelectedSchedule(schedule);
        setIsCreateTimetableModalOpen(true);
    };

    const handleNonogramCellsChange = (activeCells: number[]) => {
        setDisabledCells(activeCells);
    };

    const handleGenerateSchedules = () => {
        const testData = LocalStorageManager.getAllGroups();
        const validCombinations = CreateTimeTable.getValidCombinationsWithExclusions(testData, 23, new Set(disabledCells));
        const filteredSchedules = Object.values(validCombinations).flat();
        setGeneratedSchedules(filteredSchedules);
        setIsNonogramActive(false);
    };

    const handleResetNonogram = () => {
        setIsNonogramActive(true);
    };

    const handleRoute = () => {
        router.push("/timetable");
    };

    const getRandomSchedules = (schedules: Lecture[][], count: number) => {
        if (schedules.length <= count) return schedules;

        const shuffled = [...schedules].sort(() => 0.5 - Math.random());
        return shuffled.slice(0, count);
    };

    return (
        <>
            <Header />
            <PageInfo title="맞춤형 시간표 만들기" description="셀을 클릭하여 제외할 시간을 선택하세요. 선택된 시간은 과목이 배정되지 않습니다." />
            <div className="p-5">
                <div className="p-5">
                    {isNonogramActive ? (
                        <>
                            <h2 className="text-xl font-bold mb-4">맞춤 시간표 생성</h2>
                            <p className="text-gray-500 text-sm mb-4">.</p>
                            <ClickableTable onActiveCellsChange={handleNonogramCellsChange} />
                            <div className="flex justify-center">
                                <Button className="mt-4" color="primary" onPress={handleGenerateSchedules}>
                                    조회
                                </Button>
                            </div>
                        </>
                    ) : (
                        <>
                            <div className="flex justify-between items-center">
                                <h2 className="text-xl font-bold mb-4">생성된 시간표</h2>
                                <Button className="mt-4" color="default" onPress={handleResetNonogram}>
                                    재설정
                                </Button>
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mt-6">
                                {generatedSchedules.map((schedule, index) => (
                                    <Card key={index} onPress={() => handleScheduleClick(schedule)} className="cursor-pointer" isPressable>
                                        <CardHeader className="flex gap-3 text-sm font-semibold p-4 pb-1">
                                            <Table2 size={18} strokeWidth={2.5} />
                                            시간표 {index + 1}
                                        </CardHeader>
                                        <CardBody>
                                            <TableView items={schedule} cellHeight="2rem" maxRow={8} isPreview />
                                        </CardBody>
                                    </Card>
                                ))}
                            </div>
                        </>
                    )}
                </div>
            </div>
            <CreateTimetableModal
                isOpen={isCreateTimetableModalOpen}
                onClose={() => setIsCreateTimetableModalOpen(false)}
                onChange={handleRoute}
                selectedLectures={selectedSchedule}
            />
        </>
    );
};

export default Wizard;
