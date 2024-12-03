import React, { useState } from "react";
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, Input } from "@nextui-org/react";
import { LocalStorageManager } from "@/utils/localStorageManager";

interface RenameGroupModalProps {
    isOpen: boolean;
    onClose: () => void;
    groupName: string;
    onRename: (oldName: string, newName: string) => void;
}

const RenameGroupModal: React.FC<RenameGroupModalProps> = ({ isOpen, onClose, groupName, onRename }) => {
    const [newGroupName, setNewGroupName] = useState<string>(groupName);

    const handleRenameGroup = () => {
        if (newGroupName.trim() && newGroupName !== groupName) {
            try {
                LocalStorageManager.renameGroup(groupName, newGroupName);
                onRename(groupName, newGroupName); // 상위 컴포넌트에서 그룹 이름을 업데이트
                onClose(); // 모달 닫기
            } catch (error) {
                console.error("그룹 이름 수정 오류:", error);
            }
        }
    };

    return (
        <Modal isOpen={isOpen} onOpenChange={onClose}>
            <ModalContent>
                <ModalHeader>그룹명 수정</ModalHeader>
                <ModalBody>
                    <Input label="새 그룹 이름" value={newGroupName} defaultValue={groupName} onChange={(e) => setNewGroupName(e.target.value)} fullWidth />
                </ModalBody>
                <ModalFooter>
                    <Button color="default" variant="light" onPress={onClose}>
                        취소
                    </Button>
                    <Button color="primary" onPress={handleRenameGroup} disabled={newGroupName.trim() === ""}>
                        수정
                    </Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
};

export default RenameGroupModal;
