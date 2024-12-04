"use client";

import { useState, useEffect } from "react";
import ListView from "@/app/_components/listview/ListView";
import Header from "@/app/_components/Header";
import PageInfo from "@/app/_components/PageInfo";
import { Lecture, LocalStorageManager } from "@/utils/localStorageManager";
import { useRouter } from "next/navigation";
import { columns } from "@/app/_configs/lectureColumns";
import { Button } from "@nextui-org/react";
import { Trash2, Edit, X, ShoppingBasket, FolderPlus, Search } from "lucide-react";
import RenameGroupModal from "@/app/_components/modal/RenameGroupModal";
import ManualItemModal from "@/app/_components/modal/ManualItemModal";
import CreateGroupModal from "@/app/_components/modal/CreateGroupModal";

interface GroupWithLectures {
    groupName: string;
    lectures: Lecture[];
}

const CartTable = () => {
    const router = useRouter();
    const [groupedLectures, setGroupedLectures] = useState<GroupWithLectures[]>([]);
    const [isRenameModalOpen, setIsRenameModalOpen] = useState(false);
    const [editingGroupName, setEditingGroupName] = useState<string>("");
    const [isManualModalOpen, setIsManualModalOpen] = useState(false);
    const [isCreateGroupModalOpen, setIsCreateGroupModalOpen] = useState(false);

    useEffect(() => {
        LocalStorageManager.initialize();

        const fetchData = () => {
            const groups = LocalStorageManager.getAllGroupsWithLectures();
            const formattedGroups = groups.map((group) => ({
                groupName: group.groupName,
                lectures: group.lectures.map((lecture) => ({
                    ...lecture,
                })),
            }));
            setGroupedLectures(formattedGroups);
        };

        fetchData();
    }, []);

    const handleRemoveLecture = (groupName: string, sub_num: string) => {
        try {
            LocalStorageManager.removeLectureFromGroup(groupName, sub_num);

            const updatedGroups = LocalStorageManager.getAllGroupsWithLectures();
            const formattedGroups = updatedGroups.map((group) => ({
                groupName: group.groupName,
                lectures: group.lectures.map((lecture) => ({
                    ...lecture,
                })),
            }));

            setGroupedLectures(formattedGroups);
        } catch (error) {
            console.error("아이템 삭제 오류:", error);
        }
    };

    const handleRemoveGroup = (groupName: string) => {
        const isConfirmed = window.confirm(`"${groupName}" 그룹을 삭제할까요? 이 작업은 되돌릴 수 없습니다.`);

        if (!isConfirmed) {
            return;
        }

        try {
            LocalStorageManager.removeGroup(groupName);

            const updatedGroups = LocalStorageManager.getAllGroupsWithLectures();
            const formattedGroups = updatedGroups.map((group) => ({
                groupName: group.groupName,
                lectures: group.lectures.map((lecture) => ({
                    ...lecture,
                })),
            }));

            setGroupedLectures(formattedGroups);
        } catch (error) {
            console.error("그룹 삭제 오류:", error);
        }
    };

    const openRenameModal = (groupName: string) => {
        setEditingGroupName(groupName);
        setIsRenameModalOpen(true);
    };

    const handleRenameGroup = (oldName: string, newName: string) => {
        const updatedGroups = groupedLectures.map((group) => (group.groupName === oldName ? { ...group, groupName: newName } : group));
        setGroupedLectures(updatedGroups); // 상태 업데이트
    };

    const handleUpdateLectures = () => {
        const updatedGroups = LocalStorageManager.getAllGroupsWithLectures();
        const formattedGroups = updatedGroups.map((group) => ({
            groupName: group.groupName,
            lectures: group.lectures.map((lecture) => ({
                ...lecture,
            })),
        }));
        setGroupedLectures(formattedGroups);
    };

    return (
        <>
            <Header />
            <PageInfo title="장바구니" description="장바구니에 담긴 과목을 그룹별로 확인할 수 있어요" />
            <div className="space-y-8">
                {groupedLectures.map(({ groupName, lectures }) => (
                    <div key={groupName} className="mx-2 sm:mx-4">
                        <div className="flex justify-between items-center mx-4">
                            <h2 className="text-xl font-bold flex items-center gap-2">
                                <ShoppingBasket size={20} strokeWidth={2.5} />
                                <span>{groupName}</span>
                            </h2>

                            <div className="flex gap-2">
                                <Button
                                    aria-label="Rename Group"
                                    onClick={() => openRenameModal(groupName)}
                                    size="sm"
                                    variant="light"
                                    startContent={<Edit size={16} />}
                                >
                                    수정
                                </Button>
                                <Button
                                    aria-label="Remove Group"
                                    onClick={() => handleRemoveGroup(groupName)}
                                    color="danger"
                                    size="sm"
                                    variant="light"
                                    startContent={<Trash2 size={16} strokeWidth={1.5} />}
                                >
                                    그룹 삭제
                                </Button>
                            </div>
                        </div>
                        <ListView columns={columns} items={lectures}>
                            {(item) => (
                                <Button
                                    aria-label="Remove from Cart"
                                    onClick={() => handleRemoveLecture(groupName, item.sub_num)}
                                    color="danger"
                                    size="sm"
                                    variant="solid"
                                    isIconOnly
                                >
                                    <X size={16} strokeWidth={2} />
                                </Button>
                            )}
                        </ListView>
                    </div>
                ))}
            </div>
            <div className="flex justify-center m-8 gap-2">
                <Button aria-label="manual add" onClick={() => router.push("/lecture")} size="md" variant="flat" startContent={<Search size={20} />}>
                    개설과목 조회
                </Button>
                <Button
                    aria-label="Add Group"
                    onClick={() => setIsCreateGroupModalOpen(true)}
                    size="md"
                    color="primary"
                    variant="flat"
                    startContent={<FolderPlus size={20} />}
                    className="text-green-800 dark:text-green-400"
                >
                    그룹 추가
                </Button>
            </div>

            <CreateGroupModal isOpen={isCreateGroupModalOpen} onClose={() => setIsCreateGroupModalOpen(false)} onChange={handleUpdateLectures} />
            <ManualItemModal isOpen={isManualModalOpen} onClose={() => setIsManualModalOpen(false)} onItemAdd={handleUpdateLectures} />
            <RenameGroupModal
                isOpen={isRenameModalOpen}
                onClose={() => setIsRenameModalOpen(false)}
                groupName={editingGroupName}
                onRename={handleRenameGroup}
            />
        </>
    );
};

export default CartTable;
