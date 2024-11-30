"use client";

import { useState, useEffect } from "react";
import ListView from "@/app/_components/listview/ListView";
import Header from "@/app/_components/Header";
import PageInfo from "@/app/_components/PageInfo";
import { LocalStorageManager } from "@/utils/localStorageManager";
import { columns } from "@/app/_configs/lectureColumns";
import { Button } from "@nextui-org/react";

interface GroupWithLectures {
    groupName: string;
    lectures: Record<string, string | number>[];
}

const CartTable = () => {
    const [groupedLectures, setGroupedLectures] = useState<GroupWithLectures[]>([]);

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

    return (
        <>
            <Header />
            <PageInfo title="장바구니" description="장바구니에 담긴 과목을 그룹별로 확인할 수 있어요" />
            <div className="space-y-8">
                {groupedLectures.map(({ groupName, lectures }) => (
                    <div key={groupName}>
                        <h2 className="text-xl font-bold mb-4">{groupName}</h2>
                        <ListView columns={columns} items={lectures}>
                            {(item) => (
                                <Button
                                    aria-label="Remove from Cart"
                                    onClick={() => handleRemoveLecture(groupName, item.sub_num)}
                                    color="danger"
                                    size="sm"
                                >
                                    삭제
                                </Button>
                            )}
                        </ListView>
                    </div>
                ))}
            </div>
        </>
    );
};

export default CartTable;
