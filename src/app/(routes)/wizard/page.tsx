"use client";

import Header from "@/app/_components/Header";
import PageInfo from "@/app/_components/PageInfo";
import TableView from "@/app/_components/tableview/TableView";
import { CreateTimeTable } from "@/utils/createTimeTable";
import { Lecture, LocalStorageManager } from "@/utils/localStorageManager";
import { useEffect, useState } from "react";
import { Select, SelectItem, Button, Modal, ModalFooter, ModalHeader, ModalBody, ModalContent, Input } from "@nextui-org/react";

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
    }

    const handleScheduleClick = (schedule: Lecture[]) => {
        setSelectedSchedule(schedule);
        setModalOpen(true);
    };

    const saveSchedule = () => {
        // 시간표 저장 로직 구현
        console.log("Selected Schedule:", selectedSchedule);
        console.log("Schedule Name:", scheduleName);
        if (selectedSchedule) {
            LocalStorageManager.addTimeTableCombi(scheduleName, selectedSchedule);
        }
        setModalOpen(false);
    };

    const checkDuplicateName = (name: string) => {
        if(name){
            const duplicate = LocalStorageManager.isDupTimeTable(name);
            setIsDuplicate(duplicate);
            setIsDuplicateChecked(true);
        }
    };

    // 필터링된 데이터 가져오기
    const filteredData = Object.entries(classifiedTimeTableData).filter(([key]) => {
        // 선택된 요일이 하나라도 포함된 시간표를 필터링
        return selectedDaysOff.every(day => key.includes(day));
    }).flatMap(([, value]) => value);

    return (
        <>
            <Header />
            <PageInfo title="시간표 만들기" description="시간표를 만들 수 있어요." />
            <div style={{ padding: "20px" }}>
                <div style={{ display: "flex", justifyContent: "flex-end", alignItems: "center", marginBottom: "20px" }}>
                    <div style={{ width: "250px" }}>
                        <Select
                            label="요일 선택"
                            placeholder="요일을 선택하세요"
                            selectionMode="multiple"
                            value={selectedDaysOff}
                            onSelectionChange={(values) => handleDaysOffChange(values as Set<string>)}
                        >
                            <SelectItem key="월" value="월">월요일</SelectItem>
                            <SelectItem key="화" value="화">화요일</SelectItem>
                            <SelectItem key="수" value="수">수요일</SelectItem>
                            <SelectItem key="목" value="목">목요일</SelectItem>
                            <SelectItem key="금" value="금">금요일</SelectItem>
                            <SelectItem key="공강 없음" value="공강없음">공강 없음</SelectItem>
                        </Select>
                    </div>
                </div>
                <div style={{ marginTop: "20px" }}>
                    <h2 style={{ fontSize: "24px", fontWeight: "bold" }}>총 {filteredData.length}개의 시간표 조합이 생성되었습니다.</h2>
                    {filteredData.map((schedule, index) => (
                        <div
                            key={index}
                            style={{ marginBottom: "20px", cursor: "pointer" }}
                            onClick={() => handleScheduleClick(schedule)}
                        >
                            <h4 style={{ fontWeight: "bold", fontSize: "18px" }}>시간표 {index + 1}</h4>
                            <TableView items={schedule} />
                        </div>
                    ))}
                </div>
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
                    <ModalHeader>
                        나의 시간표에 추가
                    </ModalHeader>
                    <ModalBody>
                        <div style={{ 
                            display: "flex",
                            alignItems: "center",
                            gap: "0.5rem",
                            width: "100%",
                            marginTop: "1rem", }}
                        >
                            <Input
                                label="시간표 이름 설정"
                                placeholder="시간표 이름을 입력하세요."
                                value={scheduleName}
                                onChange={(e) => {
                                    setScheduleName(e.target.value);
                                    setIsDuplicateChecked(false); // 이름이 변경되면 중복 확인 상태 초기화
                                }}
                                fullWidth
                            />
                            <Button color="primary" onPress={() => checkDuplicateName(scheduleName)}>
                                중복 확인
                            </Button>
                        </div>
                        {isDuplicateChecked && (
                            isDuplicate ? (
                                <p style={{ color: "red", marginTop: "10px" }}>
                                    이미 존재하는 이름입니다. 다른 이름을 입력하세요.
                                </p>
                            ) : (
                                <p style={{ color: "green", marginTop: "10px" }}>
                                    사용 가능한 이름입니다.
                                </p>
                            )
                        )}
                        {!isDuplicateChecked && (
                            <p style={{ color: "gray", marginTop: "10px" }}>
                                중복 확인을 해주세요.
                            </p>
                        )}
                    </ModalBody>
                    <ModalFooter>
                        <Button onPress={modalClose}>
                            취소
                        </Button>
                        <Button
                            onPress={saveSchedule}
                            isDisabled={scheduleName.trim() && isDuplicate || !isDuplicateChecked}
                            color="primary"
                        >
                            확인
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </>
    );
};

export default Wizard;
