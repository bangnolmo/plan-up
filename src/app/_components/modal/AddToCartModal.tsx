import React, { useState, useEffect } from "react";
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, Input, Select, SelectItem, Tabs, Tab } from "@nextui-org/react";
import { Lecture, LocalStorageManager } from "@/utils/localStorageManager";

interface AddToCartModalProps {
    isOpen: boolean;
    onClose: () => void;
    selectedLecture: Lecture | null;
    onCartUpdate: (count: number) => void;
}

const AddToCartModal: React.FC<AddToCartModalProps> = ({ isOpen, onClose, selectedLecture, onCartUpdate }) => {
    const [groups, setGroups] = useState<string[]>([]);
    const [selectedGroup, setSelectedGroup] = useState<Set<string>>(new Set());
    const [newGroupName, setNewGroupName] = useState<string>("");
    const [selectedTab, setSelectedTab] = useState<string>("select-group");

    useEffect(() => {
        LocalStorageManager.initialize();
        const allGroups = LocalStorageManager.getAllGroups().map((group) => group.name);
        setGroups(allGroups);
        if (allGroups.length > 0) {
            setSelectedGroup(new Set([allGroups[0]]));
        }
    }, [isOpen]);

    const handleCreateGroup = () => {
        if (newGroupName.trim() && !groups.includes(newGroupName)) {
            LocalStorageManager.addGroup(newGroupName);
            setGroups((prevGroups) => [...prevGroups, newGroupName]);
            setNewGroupName("");
            setSelectedTab("select-group");
        }
    };

    const addToGroupAndUpdateCart = () => {
        const selectedGroupName = Array.from(selectedGroup)[0];
        if (selectedLecture && selectedGroupName) {
            LocalStorageManager.addLectureToGroup(selectedGroupName, selectedLecture);
            const count = LocalStorageManager.getTotalLectureCount();
            onCartUpdate(count);
            onClose();
        }
    };

    return (
        <Modal isOpen={isOpen} onOpenChange={onClose}>
            <ModalContent>
                <ModalHeader className="flex flex-col gap-1">장바구니에 추가</ModalHeader>
                <ModalBody className="flex flex-col gap-4">
                    <Tabs
                        aria-label="Group Management"
                        selectedKey={selectedTab}
                        onSelectionChange={(key) => setSelectedTab(key as string)}
                        className="flex-grow"
                        fullWidth
                    >
                        <Tab key="select-group" title="그룹 선택">
                            <div className="flex flex-col gap-4 w-full">
                                <p>
                                    그룹에 <strong>{selectedLecture?.name}</strong> 과목을 추가합니다.
                                </p>
                                <Select
                                    label="그룹 선택"
                                    className="max-w-full"
                                    selectedKeys={selectedGroup}
                                    onSelectionChange={(keys) => setSelectedGroup(new Set(keys as unknown as string[]))}
                                >
                                    {groups.map((groupName) => (
                                        <SelectItem key={groupName}>{groupName}</SelectItem>
                                    ))}
                                </Select>
                            </div>
                        </Tab>

                        <Tab key="add-group" title="그룹 추가">
                            <div className="flex items-center gap-2 w-full mt-4">
                                <Input
                                    label="새 그룹 추가"
                                    placeholder="그룹 이름을 입력하세요."
                                    value={newGroupName}
                                    onChange={(e) => setNewGroupName(e.target.value)}
                                />
                                <Button color="primary" onPress={handleCreateGroup}>
                                    그룹 추가
                                </Button>
                            </div>
                        </Tab>
                    </Tabs>
                </ModalBody>

                <ModalFooter>
                    <Button color="default" variant="light" onPress={onClose}>
                        취소
                    </Button>
                    <Button color="primary" onPress={addToGroupAndUpdateCart} disabled={selectedGroup.size === 0}>
                        확인
                    </Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
};

export default AddToCartModal;
