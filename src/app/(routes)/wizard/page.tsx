"use client";

import { useEffect, useState } from "react";
import Header from "@/app/_components/Header";
import PageInfo from "@/app/_components/PageInfo";
import TableView from "@/app/_components/tableview/TableView";
import Unavailable from "@/app/_components/Unavailable";
import { CreateTimeTable } from "@/utils/createTimeTable";
import { Lecture, LocalStorageManager } from "@/utils/localStorageManager";
import { columns } from "@/app/_configs/timetableColumns";
import { Table2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { Select, SelectItem, Card, CardHeader, CardBody, Tabs, Tab, Accordion, AccordionItem } from "@nextui-org/react";
import CreateTimetableModal from "@/app/_components/modal/CreateTimetableModal";

const Wizard = () => {
    const router = useRouter();
    const [classifiedTimeTableData, setClassifiedTimeTableData] = useState<{
        [key: string]: Lecture[][];
    }>({});
    const [recommendedSchedules, setRecommendedSchedules] = useState<{
        [key: string]: Lecture[][];
    }>({});
    const [selectedDaysOff, setSelectedDaysOff] = useState<string[]>([]); // 공강일 선택을 위한 상태
    const [selectedSchedule, setSelectedSchedule] = useState<Lecture[]>([]);
    const [isCreateTimetableModalOpen, setIsCreateTimetableModalOpen] = useState(false);

    useEffect(() => {
        const testData = LocalStorageManager.getAllGroups();
        const validCombinations = CreateTimeTable.getValidCombinations(testData, 23);
        setClassifiedTimeTableData(validCombinations);

        const recommended = CreateTimeTable.getIndependentRecommendations(validCombinations);
        setRecommendedSchedules({
            mondayOff: getRandomSchedules(validCombinations["월"] || [], 3),
            fridayOff: getRandomSchedules(validCombinations["금"] || [], 3),
            mondayAndFridayOff: getRandomSchedules(validCombinations["월금"] || [], 3),
            morningOff: getRandomSchedules(recommended.morningOff, 3),
            maxDaysOff: getRandomSchedules(recommended.maxDaysOff, 3),
            noGaps: getRandomSchedules(recommended.noGaps, 3),
        });
    }, []);

    const handleDaysOffChange = (values: Set<string>) => {
        setSelectedDaysOff(Array.from(values));
    };

    const handleScheduleClick = (schedule: Lecture[]) => {
        setSelectedSchedule(schedule);
        setIsCreateTimetableModalOpen(true);
    };

    const filteredData = Object.entries(classifiedTimeTableData)
        .filter(([key]) => {
            return selectedDaysOff.every((day) => key.includes(day));
        })
        .flatMap(([, value]) => value);

    const totalLectureCount = LocalStorageManager.getTotalLectureCount();

    const handleRoute = () => {
        router.push("/timetable");
    };

    // 랜덤하게 스케줄 선택 함수
    const getRandomSchedules = (schedules: Lecture[][], count: number) => {
        if (schedules.length <= count) return schedules;

        const shuffled = [...schedules].sort(() => 0.5 - Math.random());
        return shuffled.slice(0, count);
    };

    // 각 추천 조건에 따른 설명 문구
    const recommendationDescriptions = {
        mondayOff: "주말 이후 하루만 더 쉬고 싶은 당신을 위한 추천!",
        fridayOff: "하루 일찍 주말을 맏이하고 싶은 당신을 위한 추천!",
        mondayAndFridayOff: "나는 욕심쟁이, 수강신청에 자신이 있는 당신을 위한 추천!",
        morningOff: "잠자는 숲속의 대학생인, 당신을 위한 추천!",
        maxDaysOff: "학교가 가고 싶지 않아~, 쉬고만 싶은 당신을 위한 추천!",
        noGaps: "수강신청 자신이 없어..., 하지만 우주 공강은 안된다 하는 당신을 위한 추천!",
    };

    return (
        <>
            <Header />
            <PageInfo title="시간표 만들기" description="시간표 마법사를 통해 시간표를 빠르게 조합해보세요." />
            <div className="p-5">
                <Tabs>
                    <Tab key="추천 시간표" title="추천 시간표">
                        {totalLectureCount === 0 ? (
                            <Unavailable buttonText="개설과목 조회" routePath="/lecture">
                                <p className="text-gray-500 text-sm m-4 mb-8">추천 시간표를 조회하려면, 먼저 강의를 장바구니에 추가하세요.</p>
                            </Unavailable>
                        ) : (
                            <Accordion variant="light" selectionMode="multiple" showDivider>
                                {Object.entries(recommendedSchedules)
                                    .filter(([, schedules]) => schedules.length > 0)
                                    .map(([criteria, schedules]) => (
                                        <AccordionItem key={criteria} title={recommendationDescriptions[criteria as keyof typeof recommendationDescriptions]}>
                                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mt-6">
                                                {schedules.map((schedule, idx) => (
                                                    <Card
                                                        key={idx}
                                                        onPress={() => handleScheduleClick(schedule)}
                                                        className="cursor-pointer"
                                                        isPressable
                                                    >
                                                        <CardHeader className="flex gap-3 text-sm font-semibold p-4 pb-1">
                                                            <Table2 size={18} strokeWidth={2.5} />
                                                            시간표 {idx + 1}
                                                        </CardHeader>
                                                        <CardBody>
                                                            <TableView items={schedule} cellHeight="2rem" maxRow={8} isPreview />
                                                        </CardBody>
                                                    </Card>
                                                ))}
                                            </div>
                                        </AccordionItem>
                                    ))}
                            </Accordion>
                        )}
                    </Tab>
                    <Tab key="맞춤 시간표 생성" title="맞춤 시간표 생성"></Tab>
                    <Tab key="전체 시간표" title="전체 시간표">
                        <div className="p-5">
                            {totalLectureCount === 0 ? (
                                <Unavailable buttonText="개설과목 조회" routePath="/lecture">
                                    <p className="text-gray-500 text-sm m-4 mb-8">시간표 마법사를 이용하려면, 먼저 강의를 장바구니에 추가하세요.</p>
                                </Unavailable>
                            ) : (
                                <>
                                    <div className="flex justify-end items-center mb-5">
                                        <Select
                                            items={columns}
                                            selectionMode="multiple"
                                            label="공강일 선택"
                                            placeholder="공강 요일을 추가하세요"
                                            className="max-w-60"
                                            onSelectionChange={(values) => handleDaysOffChange(values as Set<string>)}
                                        >
                                            {(column) => <SelectItem key={column.key}>{column.label}</SelectItem>}
                                        </Select>
                                    </div>
                                    <div className="mt-5">
                                        <h2 className="text-xl font-bold py-4">
                                            총 <span className={filteredData.length === 0 ? "text-gray-500" : "text-primary"}>{filteredData.length}개</span>의
                                            시간표 조합이 생성되었습니다.
                                        </h2>
                                        {filteredData.length === 0 ? (
                                            <Unavailable buttonText="장바구니 수정" routePath="/cart">
                                                <p className="text-gray-500 text-sm mt-4 mx-4">만들 수 있는 조합이 없어요.</p>
                                                <p className="text-gray-500 text-sm mb-8 mx-4">공강 날짜를 변경하거나, 비어 있는 그룹이 있는지 확인해보세요.</p>
                                            </Unavailable>
                                        ) : (
                                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mt-6">
                                                {filteredData.map((schedule, index) => (
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
                                        )}
                                    </div>
                                </>
                            )}
                        </div>
                    </Tab>
                </Tabs>
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
