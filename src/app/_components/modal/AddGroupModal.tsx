import React, { useState, useEffect } from "react";
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, Input } from "@nextui-org/react";
import { LocalStorageManager } from "@/utils/localStorageManager";

interface AddGroupModal {
    isOpen: boolean;
    onClose: () => void;
    onChange: () => void;
}

const AddGroupModal: React.FC<AddGroupModal> = ({ isOpen, onClose, onChange }) => {
    const [groups, setGroups] = useState<string[]>([]);
    const [newGroupName, setNewGroupName] = useState<string>("");

    useEffect(() => {
        LocalStorageManager.initialize();
        const allGroups = LocalStorageManager.getAllGroups().map((group) => group.name);
        setGroups(allGroups);
    }, [isOpen]);

    const addToGroupAndUpdateCart = () => {
        if (newGroupName.trim() && !groups.includes(newGroupName)) {
            LocalStorageManager.addGroup(newGroupName);
            setGroups((prevGroups) => [...prevGroups, newGroupName]);
            setNewGroupName("");
            onChange();
            onClose();
        }
    };

    return (
        <Modal isOpen={isOpen} onOpenChange={onClose}>
            <ModalContent>
                <ModalHeader className="flex flex-col gap-1">새 그룹 추가</ModalHeader>
                <ModalBody className="flex flex-col gap-4">
                    <div className="flex items-center gap-2 w-full mt-4">
                        <Input
                            label="새 그룹 추가"
                            placeholder="그룹 이름을 입력하세요."
                            value={newGroupName}
                            onChange={(e) => setNewGroupName(e.target.value)}
                        />
                    </div>
                </ModalBody>

                <ModalFooter>
                    <Button color="default" variant="light" onPress={onClose}>
                        취소
                    </Button>
                    <Button color="primary" onPress={addToGroupAndUpdateCart}>
                        확인
                    </Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
};

export default AddGroupModal;
