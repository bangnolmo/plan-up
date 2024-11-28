import { LectureItem, Groups } from "@/app/_configs/cartInfo";
import { getLocalStorage, setLocalStorage } from "./localStorageManager";


const MIN_GROUPS = 2;
const MAX_GROUPS = 10;
const MAX_LECTURES_PER_GROUP = 10;

export const initializeCart = () => {
    const initialGroups: Groups = {};
    for (let i = 1; i <= MIN_GROUPS; i++) {
        initialGroups[`group${i}`] = [];
    }
    setLocalStorage("cartGroups", initialGroups);
};

export const addLectureToGroup = (groupId: string, lecture: LectureItem) => {
    const cartData = getLocalStorage("cartGroups") as Groups;

    if (!cartData || !cartData[groupId]) {
        console.error("해당 그룹이 존재하지 않습니다.");
        return;
    }

    if (cartData[groupId].length >= MAX_LECTURES_PER_GROUP) {
        console.error("해당 그룹에 더 이상 과목을 추가할 수 없습니다. (최대 10개)");
        return;
    }

    cartData[groupId].push(lecture);
    setLocalStorage("cartGroups", cartData);
};

export const removeLectureFromGroup = (groupId: string, sub_num: string) => {
    const cartData = getLocalStorage("cartGroups") as Groups;

    if (!cartData || !cartData[groupId]) {
        console.error("해당 그룹이 존재하지 않습니다.");
        return;
    }

    cartData[groupId] = cartData[groupId].filter((lecture) => lecture.sub_num !== sub_num);
    setLocalStorage("cartGroups", cartData);
};

export const addGroup = () => {
    const cartData = getLocalStorage("cartGroups") as Groups ?? {};

    if (Object.keys(cartData).length >= MAX_GROUPS) {
        console.error("더 이상 그룹을 추가할 수 없습니다. (최대 10개)");
        return;
    }

    const newGroupId = `group${Object.keys(cartData).length + 1}`;
    cartData[newGroupId] = [];
    setLocalStorage("cartGroups", cartData);
};

export const getCartGroups = (): Groups => {
    const cartData = getLocalStorage("cartGroups") as Groups;
    if (!cartData) {
        return {};
    }

    // 최소 그룹 개수 보장
    for (let i = 1; i <= MIN_GROUPS; i++) {
        if (!cartData[`group${i}`]) {
            cartData[`group${i}`] = [];
        }
    }
    return cartData;
};

export const getGroupData = (groupId: string): LectureItem[] => {
    const cartData = getCartGroups();
    return cartData[groupId] || [];
};

// 추가된 removeGroup 함수
export const removeGroup = (groupId: string): Groups => {
    const cartGroups = getLocalStorage("cartGroups") as Groups;

    if (!cartGroups || !cartGroups[groupId]) {
        console.error("해당 그룹이 존재하지 않습니다.");
        return {};
    }

    // 그룹 삭제 및 이후 그룹들을 한 칸씩 앞으로 이동
    const reorderedGroups: Groups = {};
    let i = 0;

    // 그룹을 삭제하고 남은 그룹들을 한 칸씩 앞으로 이동
    Object.keys(cartGroups).forEach((key) => {
        if (key !== groupId) {
            const newGroupId = `group${i + 1}`;
            reorderedGroups[newGroupId] = cartGroups[key];
            i += 1;
        }
    });

    // 로컬스토리지에 재정렬된 데이터 저장
    setLocalStorage("cartGroups", reorderedGroups);

    return reorderedGroups;
};