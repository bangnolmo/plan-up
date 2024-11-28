// GroupView 컴포넌트
import React from "react";
import { Delete, CopyPlus } from "lucide-react";
import IconButton from "../IconButton";
import ListView from "../listview/ListView";

import { columns } from "@/app/_configs/lectureColumns";
import { LectureItem } from "@/app/_configs/cartInfo";

interface GroupViewProps {
    groupName: string;
    items: LectureItem[];
    onRemove: () => void;
    onActionButtonClick?: (item: LectureItem) => void;
    onGroupClick: () => void;
}

const GroupView: React.FC<GroupViewProps> = ({ groupName, items, onRemove, onActionButtonClick, onGroupClick }) => {

    return (
        <div className="group-view" style={{ cursor: "pointer" }}>
            <div className="flex items-center justify-between p-4 border-b border-gray-300 p">
                <h3 className="text-lg font-semibold">{groupName}</h3>
                <div className="flex space-x-2">
                    <IconButton
                    aria-label="Add item"
                    onPress={onGroupClick}
                    icon={<CopyPlus size="16" strokeWidth={2.75} />}
                    color="primary"
                    ariaLabel="Add"
                    hovermsg="장바구니 추가"
                    size="sm"
                    />
                    <IconButton
                        aria-label="Delete group"
                        onPress={onRemove}
                        icon={<Delete size="16" strokeWidth={2.75} />}
                        color="danger"
                        ariaLabel="Delete"
                        hovermsg="그룹 삭제"
                        size="sm"
                    />
                </div>
            </div>
            <ListView
                columns={columns}
                items={items}
                actionType="delete"
                onActionButtonClick={onActionButtonClick}
            />
            </div>
    );
};

export default GroupView;
