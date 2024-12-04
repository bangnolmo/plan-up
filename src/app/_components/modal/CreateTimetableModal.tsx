/* eslint-disable prefer-const */
/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState, useEffect } from "react";
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, Input } from "@nextui-org/react";
import { Lecture } from "@/utils/localStorageManager";
import { createTimeTable, getTimeTablesByUserEmail, addLectureToTimeTable } from "@/utils/apis/timetable";

interface CreateTimetableModalProps {
    isOpen: boolean;
    onClose: () => void;
    onChange: () => void;
    selectedLectures: Lecture[];
}

const CreateTimetableModal: React.FC<CreateTimetableModalProps> = ({ isOpen, onClose, onChange, selectedLectures }) => {
    const [newGroupName, setNewGroupName] = useState<string>("");

    useEffect(() => {}, [isOpen]);

    const onPressConfirmButton = async () => {
        if (!newGroupName.trim()) {
            alert("시간표 이름을 입력해주세요.");
            return;
        }

        // 시간표 생성
        try {
            const createdTimetable = await createTimeTable(newGroupName);
            const userEmail = localStorage.getItem("user_email");
            if (!userEmail) throw new Error("User email is missing.");

            // 시간표 목록 조회
            const timetables = await getTimeTablesByUserEmail(userEmail);
            const timetable = timetables.find((timetable: { name: string }) => timetable.name === newGroupName);

            if (!timetable) {
                alert("시간표를 다시 시도해 주세요.");
                return;
            }

            const tableIdx = timetable.id; // 생성된 시간표의 ID

            // 강의 추가
            for (let lecture of selectedLectures) {
                const { sub_num, parent_idx } = lecture;

                if (!sub_num || !parent_idx) {
                    console.error("강의 정보가 부족합니다.", lecture);
                    continue;
                }

                // 시간표에 강의 추가
                await addLectureToTimeTable(tableIdx, parent_idx, sub_num);
            }

            // 모든 강의 추가 완료 후, 변경 사항 반영 및 모달 닫기
            onChange();
            onClose();
        } catch (error) {
            console.error("시간표 생성 또는 강의 추가 오류:", error);
            alert("시간표 생성 또는 강의 추가 중 오류가 발생했습니다. 다시 시도해 주세요.");
        }
    };

    return (
        <Modal isOpen={isOpen} onOpenChange={onClose}>
            <ModalContent>
                <ModalHeader className="flex flex-col gap-1">시간표 추가</ModalHeader>
                <ModalBody className="flex flex-col gap-4">
                    <div className="flex items-center gap-2 w-full mt-4">
                        <Input
                            label="시간표 추가"
                            placeholder="시간표 이름을 입력하세요."
                            value={newGroupName}
                            onChange={(e) => setNewGroupName(e.target.value)}
                        />
                    </div>
                </ModalBody>

                <ModalFooter>
                    <Button color="default" variant="light" onPress={onClose}>
                        취소
                    </Button>
                    <Button color="primary" onPress={onPressConfirmButton}>
                        확인
                    </Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
};

export default CreateTimetableModal;
