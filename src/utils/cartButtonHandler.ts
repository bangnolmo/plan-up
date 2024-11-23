import {
    deleteLocalStorageValue,
    getLocalStorage,
    setLocalStorage,
    updateLocalStorageValue,
} from "@/utils/localStorageManager";

export type LectureItem = Record<string, string | number>;

/**
 * 로컬 스토리지에 아이템을 추가하는 핸들러 함수
 * @param item 추가할 아이템
 */
export const handleCartAddClick = (item: LectureItem) => {
    // 기존 로컬 스토리지에 저장된 데이터를 가져옴
    const existingData = getLocalStorage("cartItem");
    let parsedData: LectureItem[] = [];

    const extendedItem = {
        ...item,
        groupAttribute: 0, // Group 속성추가 (임시)
    };

    if (!existingData) {
        // 로컬 스토리지가 비어있는 경우 새로 생성
        parsedData.push(extendedItem);
        setLocalStorage("cartItem", parsedData);
        console.log("로컬 스토리지가 생성되었습니다:", parsedData);
        window.alert("장바구니에 과목이 추가되었습니다.");
    } else if (Array.isArray(existingData)) {
        // 로컬 스토리지 데이터가 배열 형식이면 parsedData로 할당
        parsedData = existingData.filter((el): el is LectureItem => {
            return (
                typeof el === "object" &&
                el !== null &&
                !Array.isArray(el) &&
                Object.values(el).every((value) => typeof value === "string" || typeof value === "number")
            );
        });

        // 동일한 데이터가 있는지 확인
        const isItemExist = parsedData.some((data) => {
            console.log(data.period);
            return typeof data === "object" && data.sub_num === item.sub_num;
        });

        const isElearning = () => {
            return item.period === "이러닝"
        }

        if (isElearning()) {
            console.log("이러닝 과목 감지");
            window.alert("이러닝 강좌는 장바구니에 추가할 수 없습니다.");
        } else if (!isItemExist) {
            // 데이터가 없으면 새로 추가
            parsedData.push(extendedItem);
            updateLocalStorageValue("cartItem", parsedData);
            console.log("로컬 스토리지가 업데이트되었습니다:", parsedData);
            window.alert("장바구니에 과목이 추가되었습니다.");
        } else {
            console.log("데이터가 이미 로컬 스토리지에 존재합니다:", item);
            window.alert("이미 장바구니에 추가된 과목입니다.");
        }
    } else {
        console.error("로컬 스토리지 데이터가 예상하지 못한 형식입니다. 기본 빈 배열로 설정합니다.");
    }
};

/**
 * 장바구니에서 항목을 삭제하는 핸들러 함수
 * @param item 삭제할 아이템
 */
export function handleCartDeleteClick(item: LectureItem): void {
    // 기존 로컬 스토리지에서 데이터를 가져옴
    const existingData = getLocalStorage("cartItem");

    if (!existingData || (Array.isArray(existingData) && existingData.length === 0)) {
        // 로컬 스토리지가 없거나 데이터가 빈 배열인 경우 알림
        alert("로컬 스토리지에 저장된 데이터가 없습니다.");
    } else {
        // 로컬 스토리지가 비어있지 않은 경우 삭제 수행
        deleteLocalStorageValue("cartItem", item.sub_num);
        alert("장바구니에서 과목이 삭제되었습니다.");
    }
}

/**
 * 플로팅 카트를 클릭할 때 동작하는 핸들러 함수
 */
export function handleFloatingCartClick() {
    console.log("장바구니로 이동합니다.");
    window.location.href = "/cart"; // 장바구니 페이지로 이동
}