import React, { useState, useEffect } from "react";
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, Input, Select, SelectItem } from "@nextui-org/react";
import { Lecture, LocalStorageManager } from "@/utils/localStorageManager";

interface ManualItemModalProps {
    isOpen: boolean;
    onClose: () => void;
    onItemAdd: () => void;
}

const ManualItemModal: React.FC<ManualItemModalProps> = ({ isOpen, onClose, onItemAdd }) => {
    const [groups, setGroups] = useState<string[]>([]);
    const [selectedGroup, setSelectedGroup] = useState<Set<string>>(new Set());
    const [lecture, setLecture] = useState<Lecture>({
        sub_num: "",
        name: "",
        grade: 0,
        course_type: "",
        credits: 0,
        note: "",
        professor: "",
        period: "",
        location: "",
        parent_idx: -1, // 기본값 -1
    });

    useEffect(() => {
        LocalStorageManager.initialize();
        const allGroups = LocalStorageManager.getAllGroups().map((group) => group.name);
        setGroups(allGroups);
        if (allGroups.length > 0) {
            setSelectedGroup(new Set([allGroups[0]]));
        }
    }, [isOpen]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setLecture((prevLecture) => ({
            ...prevLecture,
            [name]: value,
        }));
    };

    const handleAddLecture = () => {
        const selectedGroupName = Array.from(selectedGroup)[0];
        console.log(lecture);
        console.log(selectedGroupName);
        if (selectedGroup && lecture.name.trim() !== "") {
            LocalStorageManager.addLectureToGroup(selectedGroupName, lecture);
            onItemAdd();
            onClose();
        }
    };

    return (
        <Modal isOpen={isOpen} onOpenChange={onClose}>
            <ModalContent>
                <ModalHeader>과목 정보 입력</ModalHeader>
                <ModalBody>
                    <div className="space-y-4">
                        <Input label="과목 코드" name="sub_num" value={lecture.sub_num} onChange={handleInputChange} fullWidth />
                        <Input label="과목 이름" name="name" value={lecture.name} onChange={handleInputChange} fullWidth />
                        <Input label="학점" name="credits" type="number" value={lecture.credits.toString()} onChange={handleInputChange} fullWidth />
                        <Input label="교수명" name="professor" value={lecture.professor} onChange={handleInputChange} fullWidth />
                        <Input label="수업 시간" name="period" value={lecture.period} onChange={handleInputChange} fullWidth />
                        <Input label="수업 장소" name="location" value={lecture.location} onChange={handleInputChange} fullWidth />
                        <Select
                            label="그룹 선택"
                            selectedKeys={selectedGroup}
                            onSelectionChange={(keys) => setSelectedGroup(new Set(keys as unknown as string[]))}
                            fullWidth
                        >
                            {groups.map((group) => (
                                <SelectItem key={group}>{group}</SelectItem>
                            ))}
                        </Select>
                    </div>
                </ModalBody>
                <ModalFooter>
                    <Button color="default" variant="light" onPress={onClose}>
                        취소
                    </Button>
                    <Button color="primary" onPress={handleAddLecture} disabled={lecture.name.trim() === ""}>
                        추가
                    </Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
};

export default ManualItemModal;
