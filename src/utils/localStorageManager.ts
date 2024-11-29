// localStorageManager.ts

import { LectureItem } from "@/app/_configs/commonInfo";

// 로컬 스토리지에 저장되는 데이터 타입 정의
export type LocalStorageValue = string | number | Record<string, unknown> | Array<unknown>;


/**
 * 로컬 스토리지 설정 함수
 * @param key 로컬 스토리지의 이름
 * @param value 저장할 값 (string, number, 객체, 배열 등)
 */
export const setLocalStorage = (key: string, value: LocalStorageValue) => {
    try {
        // JSON 문자열로 변환하여 로컬 스토리지에 저장
        const serializedValue = JSON.stringify(value);
        localStorage.setItem(key, serializedValue);

        // 커스텀 이벤트 디스패치
        const event = new CustomEvent("localStorageChange", {
            detail: { key, value },
        });
        
        window.dispatchEvent(event);
    } catch (error) {
        console.error("로컬 스토리지 설정 중 오류가 발생했습니다:", error);
    }
};

/**
 * 로컬 스토리지 조회 함수
 * @param key 로컬 스토리지의 이름
 * @returns 로컬 스토리지의 값 (JSON 파싱된 값 또는 null)
 */
export const getLocalStorage = (key: string): LocalStorageValue | null => {
    if (typeof window === "undefined") {
        // 서버 사이드에서는 localStorage를 사용할 수 없으므로 null 반환
        return null;
    }
    
    const storageValue = localStorage.getItem(key);
    if (storageValue) {
        try {
            // JSON 파싱
            return JSON.parse(storageValue);
        } catch (error) {
            console.error("로컬 스토리지 데이터 파싱에 실패했습니다. 로컬 스토리지 값:", storageValue, "오류:", error);
            return null;
        }
    }
    return null;
};

/**
 * 로컬 스토리지 삭제 함수
 * @param key 삭제할 로컬 스토리지의 이름
 */
export const removeLocalStorage = (key: string): void => {
    try {
        localStorage.removeItem(key);
        console.log(`로컬 스토리지 "${key}"가 성공적으로 삭제되었습니다.`);
    } catch (error) {
        console.error("로컬 스토리지 삭제 중 오류가 발생했습니다:", error);
    }
};

/**
 * 로컬 스토리지 업데이트 함수
 * @param key 로컬 스토리지의 이름
 * @param updatedValue 업데이트할 값
 */
export const updateLocalStorageValue = (key: string, updatedValue: LocalStorageValue): void => {
    try {
        const existingValue = getLocalStorage(key);

        // 기존 데이터가 객체일 때만 업데이트 수행
        if (existingValue && typeof existingValue === "object" && !Array.isArray(existingValue)) {
            if (typeof updatedValue === "object" && !Array.isArray(updatedValue)) {
                // 기존 객체와 업데이트 값을 병합하여 새 값을 생성
                const newValue = {
                    ...existingValue,
                    ...updatedValue,
                };
                setLocalStorage(key, newValue);
                console.log(`로컬 스토리지 "${key}"가 성공적으로 업데이트되었습니다.`);
            } else {
                console.error("업데이트할 값이 객체가 아닙니다. 업데이트가 수행되지 않았습니다.");
            }
        } else {
            // 기존 값이 없거나 객체가 아닌 경우 새로운 값을 설정
            setLocalStorage(key, updatedValue);
            console.log(`로컬 스토리지 "${key}"가 새롭게 생성되었습니다.`);
        }
    } catch (error) {
        console.error("로컬 스토리지 업데이트 중 오류가 발생했습니다:", error);
    }
};

/**
 * 로컬 스토리지에서 특정 항목 삭제 함수
 * @param key 로컬 스토리지의 이름
 * @param sub_num 삭제할 항목의 sub_num
 */
export const deleteLocalStorageValue = (key: string, sub_num: string | number): void => {
    try {
        const existingData = getLocalStorage(key);
        const parsedData = existingData as LectureItem[];

        // 기존 데이터가 배열일 때만 삭제 작업 수행
        if (existingData && Array.isArray(existingData)) {
            // 삭제할 sub_num와 일치하지 않는 요소만 유지하여 새로운 배열 생성
            const updatedData = parsedData.filter((item: LectureItem) => item.sub_num !== sub_num);

            if (updatedData.length !== existingData.length) {
                // 기존 배열과 길이가 다르면 업데이트 (즉, 삭제가 이루어진 경우)
                setLocalStorage(key, updatedData);
                console.log(`로컬 스토리지 "${key}"에서 sub_num가 "${sub_num}"인 항목이 성공적으로 삭제되었습니다.`);
            } else {
                console.log(`로컬 스토리지 "${key}"에 sub_num가 "${sub_num}"인 항목이 존재하지 않습니다.`);
            }
        } else {
            console.error("로컬 스토리지 데이터가 배열 형식이 아니거나 존재하지 않습니다. 삭제가 수행되지 않았습니다.");
        }
    } catch (error) {
        console.error("로컬 스토리지에서 값을 삭제하는 중 오류가 발생했습니다:", error);
    }
};

/**
 * 로컬 스토리지 내 데이터 개수를 구하는 함수
 * @param key 로컬 스토리지의 이름
 * @returns 로컬 스토리지에 저장된 값의 개수 (배열, 객체, 문자열의 길이 등)
 */
export const getLocalStorageItemCount = (key: string): number => {
    const existingData = getLocalStorage(key);

    if (!existingData) {
        return 0;
    }

    try {
        if (Array.isArray(existingData)) {
            // 데이터가 배열일 경우, 배열의 길이를 반환
            return existingData.length;
        } else if (typeof existingData === "object") {
            // 데이터가 객체일 경우, 객체의 키 개수를 반환
            return Object.keys(existingData).length;
        } else if (typeof existingData === "string") {
            // 데이터가 문자열일 경우, 문자열의 길이를 반환
            return existingData.length;
        }
        return 0;
    } catch (error) {
        console.error("로컬 스토리지 데이터 개수를 구하는 중 오류가 발생했습니다:", error);
        return 0;
    }
};

