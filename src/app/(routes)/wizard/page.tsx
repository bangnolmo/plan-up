"use client";

import { useEffect, useState } from "react";
import Header from "@/app/_components/Header";
import PageInfo from "@/app/_components/PageInfo";
import TableView from "@/app/_components/tableview/TableView";
import Unavailable from "@/app/_components/Unavailable";
import { CreateTimeTable } from "@/utils/createTimeTable";
import { Lecture, LocalStorageManager } from "@/utils/localStorageManager";
import { columns } from "@/app/_configs/timetableColumns";
import { PencilRuler, SwatchBook, Table2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { Select, SelectItem, Card, CardHeader, CardBody, Button } from "@nextui-org/react";
import CreateTimetableModal from "@/app/_components/modal/CreateTimetableModal";
import { removeLocalUserData, validateUserEmail } from "@/utils/apis/login";

const Wizard = () => {
    const router = useRouter();
    const [classifiedTimeTableData, setClassifiedTimeTableData] = useState<{
        [key: string]: Lecture[][];
    }>({});
    const [selectedDaysOff, setSelectedDaysOff] = useState<string[]>([]); // 공강일 선택을 위한 상태
    const [selectedSchedule, setSelectedSchedule] = useState<Lecture[]>([]);
    const [isCreateTimetableModalOpen, setIsCreateTimetableModalOpen] = useState(false);
    const [showAllSchedules, setShowAllSchedules] = useState(false); // State to track "Load More" action

    useEffect(() => {
        const testData = LocalStorageManager.getAllGroups();
        const testResult = CreateTimeTable.getValidCombinations(testData, 23);
        setClassifiedTimeTableData(testResult);
    }, []);

    useEffect(() => {
        if (typeof window === "undefined") return;
        const accessToken = localStorage.getItem("access_token");
        const userEmail = localStorage.getItem("user_email");

        if (!accessToken || !userEmail) {
            router.push("/login");
            return;
        }

        const checkUserValidity = async () => {
            try {
                const { auth } = await validateUserEmail(accessToken, userEmail);

                if (!auth) {
                    removeLocalUserData();
                    router.push("/login");
                }
            } catch (error) {
                console.error("User validation failed:", error);
                alert("접속 후 오랜 시간이 경과되어 다시 로그인해야 합니다.");
                removeLocalUserData();
                router.push("/login");
            }
        };
        checkUserValidity();
    }, [router]);

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

    const handleLoadMore = () => {
        setShowAllSchedules(true);
    };

    return (
        <>
            <Header />
            <PageInfo title="시간표 만들기" description="시간표 마법사를 통해 시간표를 빠르게 조합해보세요." />

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
                                    {filteredData.slice(0, showAllSchedules ? filteredData.length : 6).map((schedule, index) => (
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
                            {filteredData.length > 6 && !showAllSchedules && (
                                <div className="flex justify-center mt-5">
                                    <Button onClick={handleLoadMore} size="md" variant="flat" color="primary">
                                        더 보기
                                    </Button>
                                </div>
                            )}
                        </div>
                        <div className="flex justify-center m-8 gap-2">
                            <Button
                                aria-label="d"
                                onClick={() => router.push("/wizard/theme")}
                                size="md"
                                variant="flat"
                                color="primary"
                                startContent={<SwatchBook size={20} />}
                                className="text-green-800 dark:text-green-400"
                            >
                                테마별 추천
                            </Button>
                            <Button
                                aria-label="d"
                                onClick={() => router.push("/wizard/precise")}
                                size="md"
                                variant="flat"
                                startContent={<PencilRuler size={20} />}
                            >
                                맞춤형 시간표
                            </Button>
                        </div>
                    </>
                )}
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
