// cookieHandlers.ts
import { deleteCookieValueById, getCookie, setCookie, updateCookie } from "@/app/_cookieManager/cookieManager";

export type LectureItem = Record<string, string | number>;

/**
 * 쿠키에 아이템을 추가하는 핸들러 함수
 * @param item 추가할 아이템
 */
export const handleCartAddClick = (item: LectureItem) => {
    // 기존 쿠키에 저장된 데이터를 가져옴
    const existingData = getCookie("clickedItemData");
    let parsedData: LectureItem[] = [];

    const extendedItem = {
        ...item,
        groupAttribute: 0 // Group 속성추가 (임시)
    };

    if (!existingData) {
        // 쿠키가 없는 경우 새로 생성
        parsedData.push(extendedItem);
        setCookie("clickedItemData", parsedData, 7);
        console.log("쿠키가 생성되었습니다:", parsedData);
    } else if (Array.isArray(existingData)) {
        // 쿠키 데이터가 배열 형식이면 parsedData로 할당
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
            return typeof data === "object" && data.id === item.id;
        });

        if (!isItemExist) {
            // 데이터가 없으면 새로 추가
            parsedData.push(extendedItem);
            updateCookie("clickedItemData", parsedData, 7);
            console.log("쿠키가 업데이트되었습니다:", parsedData);
        } else {
            console.log("데이터가 이미 쿠키에 존재합니다:", item);
        }
    } else {
        console.error("쿠키 데이터가 예상하지 못한 형식입니다. 기본 빈 배열로 설정합니다.");
    }
};


/**
 * 카트에서 항목을 삭제하는 핸들러 함수
 * @param item
 */
export function handleCartDeleteClick(item: LectureItem): void {
    // 기존 쿠키에서 데이터를 가져옴
    const existingData = getCookie("clickedItemData");

    if (!existingData || (Array.isArray(existingData) && existingData.length === 0)) {
        // 쿠키가 없거나, 쿠키 데이터가 빈 배열일 경우 알림
        alert("쿠키에 저장된 데이터가 없습니다.");
    } else {
        // 쿠키가 비어있지 않은 경우 삭제 수행
        deleteCookieValueById("clickedItemData", item.id, 7);
    }
}
