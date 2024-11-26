// GroupList 컴포넌트
import React from "react";
import GroupView from "./GroupView";
import { LectureItem } from "@/app/_configs/cartInfo";

const GroupListView = ({ groups, onRemoveGroup, onActionButtonClick, onGroupClick }: {
    groups: { id: string; name: string;}[];
    onRemoveGroup: (groupId: string) => void;
    onActionButtonClick: (groupId: string, item: LectureItem) => void;
    onGroupClick: (groupId: string) => void;
}) => {
    return (
        <div>
            {groups.map((group) => (
                <GroupView
                    key={group.id}
                    groupName={group.name}
                    onRemove={() => onRemoveGroup(group.id)}
                    onActionButtonClick={(item) => onActionButtonClick(group.id, item)}
                    onGroupClick={() => onGroupClick(group.id)}
                />
            ))}
        </div>
    );
};

export default GroupListView;