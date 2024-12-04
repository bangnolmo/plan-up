import React, { useState, useEffect } from "react";
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, Input } from "@nextui-org/react";
import { Lecture } from "@/utils/localStorageManager";

interface CreateTimetableModalProps {
    isOpen: boolean;
    onClose: () => void;
    onChange: () => void;
    selectedLectures: Lecture[];
}

// export interface Lecture {
//     sub_num: string;
//     name: string;
//     grade: number;
//     course_type: string;
//     credits: number;
//     professor: string;
//     note: string;
//     period: string;
//     location: string;
//     parent_idx: number;
//     classTime: number[];
// }

const CreateTimetableModal: React.FC<CreateTimetableModalProps> = ({ isOpen, onClose, onChange, selectedLectures }) => {
    const [newGroupName, setNewGroupName] = useState<string>("");

    useEffect(() => {}, [isOpen]);

    const onPressConfirmButton = () => {
        // if ( ) {
        //     // 이 부분 작성
        //     onChange();
        //     onClose();
        // }
        console.log(onChange());
        console.log(selectedLectures);
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
