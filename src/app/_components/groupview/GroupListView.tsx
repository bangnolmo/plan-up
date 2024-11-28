// GroupList 컴포넌트
import React from "react";
import GroupView from "./GroupView";
import { Groups, LectureItem } from "@/app/_configs/cartInfo";

interface GroupListViewProps {
    groups: Groups;
    onRemoveGroup: (groupId: string) => void;
    onActionButtonClick: (groupId: string, item: LectureItem) => void;
    onGroupClick: (groupId: string) => void;
}

const GroupListView: React.FC<GroupListViewProps> = ({ groups, onRemoveGroup, onActionButtonClick, onGroupClick }) => {
    return (
        <div>
            {Object.keys(groups).map((groupId: string) => (
                
                <GroupView
                    key={groupId}
                    groupName={groupId}
                    items={groups[groupId]}
                    onRemove={() => onRemoveGroup(groupId)}
                    onActionButtonClick={(item) => onActionButtonClick(groupId, item)}
                    onGroupClick={() => onGroupClick(groupId)}
                />
            ))}
        </div>
    );
};

export default GroupListView;