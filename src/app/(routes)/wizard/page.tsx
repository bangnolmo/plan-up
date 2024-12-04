"use client";

import Header from "@/app/_components/Header";
import PageInfo from "@/app/_components/PageInfo";
import TableView from "@/app/_components/tableview/TableView";
import { CreateTimeTable } from "@/utils/createTimeTable";
import { Lecture, LocalStorageManager } from "@/utils/localStorageManager";
import { columns } from "@/app/_configs/timetableColumns";
import { useEffect, useState } from "react";
import {
    Select,
    SelectItem,
    Button,
    Modal,
    ModalFooter,
    ModalHeader,
    ModalBody,
    ModalContent,
    Input,
    Card,
    CardHeader,
    CardBody,
} from "@nextui-org/react";
import { Table2 } from "lucide-react";
import Unavailable from "@/app/_components/Unavailable";

const Wizard = () => {
    const [classifiedTimeTableData, setClassifiedTimeTableData] = useState<{
        [key: string]: Lecture[][];
    }>({});
    const [selectedDaysOff, setSelectedDaysOff] = useState<string[]>([]); // 공강일 선택을 위한 상태
    const [selectedSchedule, setSelectedSchedule] = useState<Lecture[] | null>(null); // 선택된 시간표를 위한 상태
    const [modalOpen, setModalOpen] = useState<boolean>(false); // 모달 on & off 시간표 선택 확인 시 모달
    const [scheduleName, setScheduleName] = useState<string>(""); // 저장할 시간표의 이름
    const [isDuplicate, setIsDuplicate] = useState<boolean>(false); // 중복 여부 확인
    const [isDuplicateChecked, setIsDuplicateChecked] = useState<boolean>(false); // 중복 확인 여부 확인

    useEffect(() => {
        const testData = LocalStorageManager.getAllGroups();
        const testResult = CreateTimeTable.getValidCombinations(testData, 23);
        setClassifiedTimeTableData(testResult);
        console.log(testResult);
    }, []);

    const handleDaysOffChange = (values: Set<string>) => {
        setSelectedDaysOff(Array.from(values));
    };

    const modalClose = () => {
        setModalOpen(false);
        setScheduleName("");
        setIsDuplicate(false);
        setIsDuplicateChecked(false);
    };

    const handleScheduleClick = (schedule: Lecture[]) => {
        setSelectedSchedule(schedule);
        setModalOpen(true);
    };

    const saveSchedule = () => {
        console.log("Selected Schedule:", selectedSchedule);
        console.log("Schedule Name:", scheduleName);
        if (selectedSchedule) {
            LocalStorageManager.addTimeTableCombi(scheduleName, selectedSchedule);
        }
        setModalOpen(false);
    };

    const checkDuplicateName = (name: string) => {
        if (name) {
            const duplicate = LocalStorageManager.isDupTimeTable(name);
            setIsDuplicate(duplicate);
            setIsDuplicateChecked(true);
        }
    };

    const filteredData = Object.entries(classifiedTimeTableData)
        .filter(([key]) => {
            return selectedDaysOff.every((day) => key.includes(day));
        })
        .flatMap(([, value]) => value);

    const totalLectureCount = LocalStorageManager.getTotalLectureCount();

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
                                    <p className="text-gray-500 text-sm mb-8 mx-4">공강 날짜를 변경하거나, 그룹이 비어 있는지 확인해보세요.</p>
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

            <Modal
                isOpen={modalOpen}
                onOpenChange={modalClose}
                isDismissable={false}
                isKeyboardDismissDisabled={false}
                closeButton
                aria-labelledby="modal-title"
                aria-describedby="modal-description"
            >
                <ModalContent>
                    <ModalHeader>나의 시간표에 추가</ModalHeader>
                    <ModalBody>
                        <div
                            style={{
                                display: "flex",
                                alignItems: "center",
                                gap: "0.5rem",
                                width: "100%",
                                marginTop: "1rem",
                            }}
                        >
                            <Input
                                label="시간표 이름 설정"
                                placeholder="시간표 이름을 입력하세요."
                                value={scheduleName}
                                onChange={(e) => {
                                    setScheduleName(e.target.value);
                                    setIsDuplicateChecked(false);
                                }}
                                fullWidth
                            />
                            <Button color="primary" onPress={() => checkDuplicateName(scheduleName)}>
                                중복 확인
                            </Button>
                        </div>
                        {isDuplicateChecked &&
                            (isDuplicate ? (
                                <p style={{ color: "red", marginTop: "10px" }}>이미 존재하는 이름입니다. 다른 이름을 입력하세요.</p>
                            ) : (
                                <p style={{ color: "green", marginTop: "10px" }}>사용 가능한 이름입니다.</p>
                            ))}
                        {!isDuplicateChecked && <p style={{ color: "gray", marginTop: "10px" }}>중복 확인을 해주세요.</p>}
                    </ModalBody>
                    <ModalFooter>
                        <Button onPress={modalClose}>취소</Button>
                        <Button onPress={saveSchedule} isDisabled={(scheduleName.trim() && isDuplicate) || !isDuplicateChecked} color="primary">
                            확인
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </>
    );
};

export default Wizard;
