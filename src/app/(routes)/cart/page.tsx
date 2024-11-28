"use client";
import { useState, useEffect } from "react";
import ListView from "@/app/_components/listview/ListView";
import Header from "@/app/_components/Header";
import PageInfo from "@/app/_components/PageInfo";
import { handleCartDeleteClick } from "@/utils/cartButtonHandler";
import { getLocalStorage, setLocalStorage } from "@/utils/localStorageManager";
import { addLocalStorageListener } from "@/utils/eventListenerManager";
import { columns } from "@/app/_configs/lectureColumns";
import { Groups, LectureItem } from "@/app/_configs/cartInfo";
import GroupListView from "@/app/_components/groupview/GroupListView";
import { Button, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, useDisclosure, Tabs, Tab, } from "@nextui-org/react";
import { addGroup, removeGroup, removeLectureFromGroup } from "@/utils/groupManager";

const CartTable = () => {
    const [lectures, setLectures] = useState<LectureItem[]>([]);
    const {isOpen, onOpen, onClose} = useDisclosure();
    const [selectedGroupId, setSelectedGroupId] = useState<string | null>(null);

    useEffect(() => {
        const fetchData = () => {
            const savedLectures = getLocalStorage("cartItem");
            if (Array.isArray(savedLectures)) {
                setLectures(
                    savedLectures.filter((el): el is LectureItem => {
                        return (
                            typeof el === "object" &&
                            el !== null &&
                            !Array.isArray(el) &&
                            "sub_num" in el && // LectureItem의 필드가 모두 있는지 확인
                            typeof el.sub_num === "string" &&
                            Object.values(el).every((value) => typeof value === "string" || typeof value === "number")
                        );
                    })
                );
            } else {
                console.error("로컬 스토리지 데이터가 예상하지 못한 형식입니다.");
            }
        };

        fetchData();

        const unsubscribe = addLocalStorageListener<number>("cartItem", fetchData);

        return () => {
            unsubscribe();
        };
    }, []);

    const [groups, setGroups] = useState<Groups>(() => {
        const cartGroups = getLocalStorage("cartGroups") as Groups | null;
        return cartGroups || {};
    });

    const callAddGroup = () => {
        addGroup();
        const updatedGroups = getLocalStorage("cartGroups") as Groups;
        setGroups(updatedGroups);
    };

    const callRemoveGroup = (groupId: string) => {
        const newGroups = removeGroup(groupId);
        setGroups(newGroups);
    };

    const callRemoveLectureFromGroup = (groupId: string, item: LectureItem) => {
        console.log(groupId);
        removeLectureFromGroup(groupId, item.sub_num);
        const updatedGroups = getLocalStorage("cartGroups") as Groups;
        setGroups(updatedGroups);

    };

    const addLectureToGroup = (groupId: string) => {
        setSelectedGroupId(groupId);
        onOpen();
        
    };

    const handleAddToGroup = (item: LectureItem) => {
        if (selectedGroupId) {
            setGroups((prevGroups) => {
                const updatedGroups = {
                    ...prevGroups,
                    [selectedGroupId]: [...prevGroups[selectedGroupId], item],
                };
                setLocalStorage("cartGroups", updatedGroups);
                return updatedGroups;
            });
        }
    };

    return (
        <>
            <Header />
            <PageInfo title="장바구니" description="장바구니에 담긴 과목을 확인할 수 있어요" />
            <Tabs>
                <Tab key="장바구니 목록" title="장바구니 목록">
                    <ListView columns={columns} items={lectures} actionType="delete" onActionButtonClick={handleCartDeleteClick} />
                </Tab>
                <Tab key="그룹 설정" title="그룹 설정">
                    <GroupListView
                        groups={groups}
                        onRemoveGroup={callRemoveGroup}
                        onActionButtonClick={callRemoveLectureFromGroup}
                        onGroupClick={addLectureToGroup}
                    />
                    <div className="mt-4 flex justify-center">
                        <Button onClick={callAddGroup}>그룹 추가</Button>
                    </div>
                </Tab>
            </Tabs>
           

            <Modal
                size="5xl"
                isOpen={isOpen}
                onClose={onClose}
                aria-labelledby="modal-title"
                aria-describedby="modal-description"
            >
                <ModalContent>
                <ModalHeader>
                    <h3 id="modal-title">{selectedGroupId ? `${selectedGroupId}에 과목 추가` : '과목 추가'}</h3>
                </ModalHeader>
                <ModalBody>
                    <ListView
                        columns={columns}
                        items={lectures}
                        actionType="add"
                        onActionButtonClick={handleAddToGroup}
                    />
                </ModalBody>
                <ModalFooter>
                    <Button color="warning" onPress={onClose}>
                        닫기
                    </Button>
                </ModalFooter>

                </ModalContent>
            </Modal>
        </>
    );
};

export default CartTable;
