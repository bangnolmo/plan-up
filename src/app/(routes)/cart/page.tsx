"use client";
import { useState, useEffect } from "react";
import ListView from "@/app/_components/listview/ListView";
import Header from "@/app/_components/Header";
import PageInfo from "@/app/_components/PageInfo";
import { handleCartDeleteClick } from "@/utils/cartButtonHandler";
import { getLocalStorage, setLocalStorage } from "@/utils/localStorageManager";
import { addLocalStorageListener } from "@/utils/eventListenerManager";
import { columns } from "@/app/_configs/lectureColumns";
import { LectureItem } from "@/app/_configs/cartInfo";
import GroupListView from "@/app/_components/groupview/GroupListView";
import { Button, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, useDisclosure } from "@nextui-org/react";

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

    const [groups, setGroups] = useState<{ id: string; name: string; }[]>(() => {
        const cartGroups = getLocalStorage("cartGroups") as { groups: Record<string, unknown[]> } | null;
        if (cartGroups && typeof cartGroups === "object" && 'groups' in cartGroups) {
            return Object.keys(cartGroups.groups).map((key) => ({ id: key, name: key }));
        }
        return [];
    });

    const addGroup = () => {
        setGroups((prevGroups) => {
            const newGroup = { id: `group${prevGroups.length + 1}`, name: `group${prevGroups.length + 1}` };
            const updatedGroups = [...prevGroups, newGroup];
            const cartGroups = (getLocalStorage("cartGroups") as { groups: Record<string, unknown[]> } | null) || { groups: {} };
            cartGroups.groups[newGroup.id] = [];
            setLocalStorage("cartGroups", cartGroups);
            return updatedGroups;
        });
    };

    const removeGroup = (groupId: string) => {
        setGroups((prevGroups) => {
            const cartGroups = (getLocalStorage("cartGroups") as { groups: Record<string, LectureItem[]> } | null) || { groups: {} };
            const updatedGroups = prevGroups
                .filter((group) => !(group.id === groupId)) // 그룹 삭제
                .map((group, index) => {
                    const newGroupId = `group${index + 1}`;
                    return {
                        ...group,
                        id: newGroupId,
                        name: `group${index + 1}`
                    };
                });

            // 삭제된 이후의 그룹을 재정렬하여 로컬스토리지에 저장
            const reorderedGroups: Record<string, LectureItem[]> = {};
            updatedGroups.forEach((group, index) => {
                const oldGroupId = prevGroups[index + (index >= Number(groupId.replace('group', '')) ? 1 : 0)].id;
                reorderedGroups[group.id] = cartGroups.groups[oldGroupId] || [];
            });

            setLocalStorage("cartGroups", { groups: reorderedGroups });

            return updatedGroups;
        });
    };


    const handleActionButtonClick = (groupId: string, item: LectureItem) => {
        const cartGroups = (getLocalStorage("cartGroups") as { groups: Record<string, LectureItem[]> }) || { groups: {} };
        if (cartGroups && typeof cartGroups === 'object' && 'groups' in cartGroups && cartGroups.groups[groupId]) {
            cartGroups.groups[groupId] = (cartGroups.groups[groupId] as LectureItem[]).filter((lecture) => lecture.sub_num !== item.sub_num);
            setLocalStorage("cartGroups", cartGroups);
        }
        setGroups((prevGroups) => prevGroups.map((group) => {
            if (group.id === groupId) {
                return {
                    ...group,
                    items: (cartGroups.groups && cartGroups.groups[groupId]) ? cartGroups.groups[groupId] : []
                };
            }
            return group;
        }));
    };

    const goToGroupDetail = (groupId: string) => {
        setSelectedGroupId(groupId);
        onOpen();
        
    };

    const handleAddToGroup = (item: LectureItem) => {
        if (selectedGroupId) {
            const cartGroups = (getLocalStorage("cartGroups") as { groups: Record<string, LectureItem[]> }) || { groups: {} };
            if (cartGroups.groups[selectedGroupId]) {
                cartGroups.groups[selectedGroupId].push(item);
                setLocalStorage("cartGroups", cartGroups);
            }
            setGroups((prevGroups) => prevGroups.map((group) => {
                if (group.id === selectedGroupId) {
                    return {
                        ...group,
                        items: cartGroups.groups[selectedGroupId]
                    };
                }
                return group;
            }));
        }
    };

    return (
        <>
            <Header />
            <PageInfo title="장바구니" description="장바구니에 담긴 과목을 확인할 수 있어요" />
            <ListView columns={columns} items={lectures} actionType="delete" onActionButtonClick={handleCartDeleteClick} />
            <GroupListView
                groups={groups}
                onRemoveGroup={removeGroup}
                onActionButtonClick={handleActionButtonClick}
                onGroupClick={goToGroupDetail}
            />
            <div className="mt-4 flex justify-center">
                <Button onClick={addGroup}>그룹 추가</Button>
            </div>

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
