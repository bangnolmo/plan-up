import { CartStorage, LectureItem, Groups } from "@/app/_configs/cartInfo";
import { getLocalStorage, setLocalStorage } from "./localStorageManager";


const MIN_GROUPS = 2;
const MAX_GROUPS = 10;
const MAX_LECTURES_PER_GROUP = 10;

export const initializeCart = () => {
    const initialGroups: CartStorage = {
        groups: {} as Groups,
    };
    for (let i = 1; i <= MIN_GROUPS; i++) {
        initialGroups.groups[`group${i}`] = [];
    }
    setLocalStorage("cartGroups", initialGroups);
};

export const addLectureToGroup = (groupId: string, lecture: LectureItem) => {
    const cartData = getLocalStorage("cartGroups") as CartStorage;

    if (!cartData || !cartData.groups[groupId]) {
        console.error("해당 그룹이 존재하지 않습니다.");
        return;
    }

    if (cartData.groups[groupId].length >= MAX_LECTURES_PER_GROUP) {
        console.error("해당 그룹에 더 이상 과목을 추가할 수 없습니다. (최대 10개)");
        return;
    }

    cartData.groups[groupId].push(lecture);
    setLocalStorage("cartGroups", cartData);
};

export const removeLectureFromGroup = (groupId: string, sub_num: string) => {
    const cartData = getLocalStorage("cartGroups") as CartStorage;

    if (!cartData || !cartData.groups[groupId]) {
        console.error("해당 그룹이 존재하지 않습니다.");
        return;
    }

    cartData.groups[groupId] = cartData.groups[groupId].filter((lecture) => lecture.sub_num !== sub_num);
    setLocalStorage("cartGroups", cartData);
};

export const addGroup = () => {
    const cartData = getLocalStorage("cartGroups") as CartStorage;

    if (Object.keys(cartData.groups).length >= MAX_GROUPS) {
        console.error("더 이상 그룹을 추가할 수 없습니다. (최대 10개)");
        return;
    }

    const newGroupId = `group${Object.keys(cartData.groups).length + 1}`;
    cartData.groups[newGroupId] = [];
    setLocalStorage("cartGroups", cartData);
};

export const getCartGroups = (): CartStorage => {
    const cartData = getLocalStorage("cartGroups") as CartStorage;
    if (!cartData) {
        return { groups: {} as Groups };
    }

    // 최소 그룹 개수 보장
    for (let i = 1; i <= MIN_GROUPS; i++) {
        if (!cartData.groups[`group${i}`]) {
            cartData.groups[`group${i}`] = [];
        }
    }
    return cartData;
};

export const getGroupData = (groupId: string): LectureItem[] => {
    const cartData = getCartGroups();
    return cartData.groups[groupId] || [];
};
