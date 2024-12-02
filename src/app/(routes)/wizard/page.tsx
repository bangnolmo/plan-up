"use client";

import Header from "@/app/_components/Header";
import PageInfo from "@/app/_components/PageInfo";
import TableView from "@/app/_components/tableview/TableView";
import { CreateTimeTable } from "@/utils/createTimeTable";
import { Lecture, LocalStorageManager } from "@/utils/localStorageManager";
import { useEffect, useState } from "react";
import { Tabs, Checkbox, Button, Tab, CheckboxGroup, Modal, ModalFooter, ModalHeader, ModalBody, ModalContent } from "@nextui-org/react";

const Wizard = () => {
    const [classifiedTimeTableData, setClassifiedTimeTableData] = useState<{
        [key: string]: Lecture[][];
    }>({});
    const [selectedTab, setSelectedTab] = useState<string>("공강 설정"); //탭 변경을 위한 상태
    const [selectedDaysOff, setSelectedDaysOff] = useState<string[]>([]); //공강일 선택을 위한 상태
    const [selectedSchedule, setSelectedSchedule] = useState<Lecture[] | null>(null); //선택된 시간표(Tap3에서 사용될)를 위한 상태
    const [modalOpen, setModalOpen] = useState<boolean>(false); // 모달 on & off 시간표 선택 확인 시 모달
    const [scheduleToConfirm, setScheduleToConfirm] = useState<Lecture[] | null>(null); //선택된 시간표(모달에서 선택 확인을 할 때 사용되는)를 위한 상태
    const [scheduleIndexToConfirm, setScheduleIndexToConfirm] = useState<number | null>(null); //선택된 시간표(모달)가 몇번째 시간표인지를 표시하기 위한 상태

    useEffect(() => {
        if (selectedTab === "결과 보기") {
            const testData = LocalStorageManager.getAllGroups();
            const generatedKey = generateKeyFromSelectedDays(selectedDaysOff);
            const testResult = CreateTimeTable.getValidCombinations(testData, 23);
            console.log(generatedKey);
            console.log(testResult);
            if (testResult[generatedKey] && testResult[generatedKey].length > 0) {
                setClassifiedTimeTableData({ [generatedKey]: testResult[generatedKey] });
            } else {
                alert("생성될 수 있는 시간표 조합이 없습니다.");
                setSelectedTab("공강 설정");
            }
        }
    }, [selectedTab, selectedDaysOff]);
    
    const handleTabChange = (key: string | number) => {
        setSelectedTab(String(key));
    };

    const handleDaysOffChange = (day: string[]) => {
        setSelectedDaysOff(day);
    };

    const generateCombinations = () => {
        setSelectedTab("결과 보기");
    };

    const handleScheduleClick = (schedule: Lecture[], index: number) => {
        setScheduleToConfirm(schedule);
        setScheduleIndexToConfirm(index + 1);
        setModalOpen(true);
    };

    const confirmSchedule = () => {
        if (scheduleToConfirm) {
            setSelectedSchedule(scheduleToConfirm);
        }
        setModalOpen(false);
        setSelectedTab("시간표 편집");
    };

    const saveSchedule = () => {
        // 시간표 저장 로직 구현
        console.log("Selected Schedule:", selectedSchedule);
    };

    const generateKeyFromSelectedDays = (days: string[]): string => {
        return days.sort().reverse().join("");  // 선택된 요일들을 정렬하고 문자열로 연결하여 키 생성
    };

    const generatedKey = generateKeyFromSelectedDays(selectedDaysOff);
    const totalCombinations = classifiedTimeTableData[generatedKey]?.length || 0;

    return (
        <>
            <Header />
            <PageInfo title="시간표 만들기" description="시간표를 만들 수 있어요." />
            <Tabs 
                selectedKey={selectedTab} 
                onSelectionChange={handleTabChange}
                variant="underlined"
                size="lg"
                color="primary"
                className="m-2 mt-0 font-semibold"
            >
                <Tab key="공강 설정" title="공강 설정">
                    <div style={{ padding: "20px" }}>
                        <h3>공강을 원하는 요일을 선택하세요:</h3>
                        <CheckboxGroup
                            label="요일 선택"
                            value={selectedDaysOff}
                            onChange={handleDaysOffChange}
                            orientation="horizontal"
                        >
                            <Checkbox value="월">월요일</Checkbox>
                            <Checkbox value="화">화요일</Checkbox>
                            <Checkbox value="수">수요일</Checkbox>
                            <Checkbox value="목">목요일</Checkbox>
                            <Checkbox value="금">금요일</Checkbox>
                            <Checkbox value="공강 없음">공강 없음</Checkbox>
                        </CheckboxGroup>
                        <div style={{ display: "flex", justifyContent: "center", marginTop: "20px" }}>
                            <Button onClick={generateCombinations}>
                                조합 생성
                            </Button>
                        </div>
                    </div>        
                </Tab>
                <Tab key="결과 보기" title="결과 보기">
                    <div style={{ padding: "20px" }}>
                        <h2 style={{ fontSize: "24px", fontWeight: "bold" }}>총 {totalCombinations}개의 시간표 조합이 생성되었습니다.</h2>
                        {classifiedTimeTableData[generatedKey]?.map((schedule, index) => (
                            <div
                                key={index}
                                style={{ marginBottom: "20px", cursor: "pointer" }}
                                onClick={() => handleScheduleClick(schedule, index)}
                            >
                                <h4 style={{ fontWeight: "bold", fontSize: "18px" }}>시간표 {index + 1}</h4>
                                <TableView items={schedule} />
                            </div>
                        ))}
                    </div>
                </Tab>
                <Tab key="시간표 편집" title="시간표 편집">
                    <div style={{ padding: "20px" }}>
                        <h3>선택한 시간표 편집 및 저장하기</h3>
                        {selectedSchedule ? (
                            <div style={{ marginBottom: "20px" }}>
                                <TableView items={selectedSchedule} />
                            </div>
                        ) : (
                            <p>선택된 시간표가 없습니다. 이전 단계에서 시간표를 선택해주세요.</p>
                        )}
                        <Button onClick={saveSchedule} style={{ marginTop: "20px" }}>
                            내 시간표에 저장
                        </Button>
                    </div>
                </Tab>  
            </Tabs>

            <Modal
                isOpen={modalOpen}
                onOpenChange={() => setModalOpen(false)}
                closeButton
                aria-labelledby="modal-title"
                aria-describedby="modal-description"
            >
                <ModalContent>
                    <ModalHeader>
                    시간표 선택
                    </ModalHeader>
                    <ModalBody>
                        <strong>시간표 {scheduleIndexToConfirm}</strong>해당 시간표를 선택하시겠습니까?
                    </ModalBody>
                    <ModalFooter>
                        <Button onPress={() => setModalOpen(false)}>
                            취소
                        </Button>
                        <Button onPress={confirmSchedule}>
                            선택
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </>
    );
};

export default Wizard;