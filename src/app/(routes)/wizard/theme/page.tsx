/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { useEffect, useState } from "react";
import Header from "@/app/_components/Header";
import PageInfo from "@/app/_components/PageInfo";
import TableView from "@/app/_components/tableview/TableView";
import Unavailable from "@/app/_components/Unavailable";
import { CreateTimeTable } from "@/utils/createTimeTable";
import { Lecture, LocalStorageManager } from "@/utils/localStorageManager";
import { Table2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { Card, CardHeader, CardBody, Accordion, AccordionItem } from "@nextui-org/react";
import CreateTimetableModal from "@/app/_components/modal/CreateTimetableModal";
import { removeLocalUserData, validateUserEmail } from "@/utils/apis/login";

const Wizard = () => {
    const router = useRouter();
    const [classifiedTimeTableData, setClassifiedTimeTableData] = useState<{
        [key: string]: Lecture[][];
    }>({});
    const [recommendedSchedules, setRecommendedSchedules] = useState<{
        [key: string]: Lecture[][];
    }>({});
    const [selectedSchedule, setSelectedSchedule] = useState<Lecture[]>([]);
    const [isCreateTimetableModalOpen, setIsCreateTimetableModalOpen] = useState(false);

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

    const handleScheduleClick = (schedule: Lecture[]) => {
        setSelectedSchedule(schedule);
        setIsCreateTimetableModalOpen(true);
    };

    const totalLectureCount = LocalStorageManager.getTotalLectureCount();

    const handleRoute = () => {
        router.push("/timetable");
    };

    const getRandomSchedules = (schedules: Lecture[][], count: number) => {
        if (schedules.length <= count) return schedules;

        const shuffled = [...schedules].sort(() => 0.5 - Math.random());
        return shuffled.slice(0, count);
    };

    const recommendationDescriptions = {
        mondayOff: "📅 월요일이 좋아지는 월공강 시간표",
        fridayOff: "📅 금요일이 좋아지는 금공강 시간표",
        mondayAndFridayOff: "👨‍💻 수강신청 Pro 전용 시간표",
        morningOff: "🚇 통학러들을 위한 오후수업 위주 시간표",
        maxDaysOff: "🐖 최대 공강에 도전하는 욕심쟁이 시간표",
        noGaps: "💫 우주공강은 절대 안돼! 시간표",
    };

    return (
        <>
            <Header />
            <PageInfo title="테마별 시간표" description="나에게 맞는 추천 시간표를 찾아볼 수 있어요." />
            <div className="p-5">
                {totalLectureCount === 0 ? (
                    <Unavailable buttonText="개설과목 조회" routePath="/lecture">
                        <p className="text-gray-500 text-sm m-4 mb-8">테마별 시간표를 조회하려면, 먼저 강의를 장바구니에 추가하세요.</p>
                    </Unavailable>
                ) : (
                    <Accordion variant="splitted" selectionMode="multiple" showDivider>
                        {Object.entries(recommendedSchedules)
                            .filter(([, schedules]) => schedules.length > 0)
                            .map(([criteria, schedules]) => (
                                <AccordionItem
                                    key={criteria}
                                    title={recommendationDescriptions[criteria as keyof typeof recommendationDescriptions]}
                                    className="rounded-2xl my-1"
                                >
                                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                                        {schedules.map((schedule, idx) => (
                                            <Card
                                                key={idx}
                                                onPress={() => handleScheduleClick(schedule)}
                                                className="cursor-pointer border-none"
                                                shadow="none"
                                                isPressable
                                            >
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
            </div>
            <div className="flex justify-center">
                <p className="text-xs text-gray-500">장바구니에 과목을 조금 담으면 원하는 결과가 나오지 않을 수도 있어요.</p>
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
