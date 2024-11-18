// cookieManager.ts
import Cookies from "js-cookie";

// 쿠키에 저장되는 데이터 타입 정의
export type CookieValue = string | number | Record<string, unknown> | Array<unknown>;

/**
 * 쿠키 설정 함수
 * @param key 쿠키의 이름
 * @param value 저장할 값 (string, number, 객체, 배열 등)
 * @param expiresDays 쿠키의 유효 기간(일 단위, 기본값: 7일)
 */
export const setCookie = (key: string, value: CookieValue, expiresDays: number = 7) => {
  try {
    // JSON 문자열로 변환 후 URL 인코딩하여 쿠키에 저장
    const serializedValue = JSON.stringify(value);
    const encodedValue = encodeURIComponent(serializedValue);
    Cookies.set(key, encodedValue, { expires: expiresDays });
  } catch (error) {
    console.error("쿠키 설정 중 오류가 발생했습니다:", error);
  }
};

/**
 * 쿠키 조회 함수
 * @param key 쿠키의 이름
 * @returns 쿠키의 값 (JSON 파싱된 값 또는 null)
 */
export const getCookie = (key: string): CookieValue | null => {
  const cookieValue = Cookies.get(key);
  if (cookieValue) {
    try {
      // URL 디코딩 후 JSON 파싱
      const decodedValue = decodeURIComponent(cookieValue);
      return JSON.parse(decodedValue);
    } catch (error) {
      console.error("쿠키 데이터 파싱에 실패했습니다. 쿠키 값:", cookieValue, "오류:", error);
      return null;
    }
  }
  return null;
};

/**
 * 쿠키 삭제 함수
 * @param key 삭제할 쿠키의 이름
 */
export const removeCookie = (key: string): void => {
    try {
        Cookies.remove(key);
        console.log(`쿠키 "${key}"가 성공적으로 삭제되었습니다.`);
    } catch (error) {
        console.error("쿠키 삭제 중 오류가 발생했습니다:", error);
    }
};

/**
 * 쿠키 업데이트 함수
 * @param key 쿠키의 이름
 * @param updatedValue 업데이트할 값
 * @param expiresDays 쿠키의 유효 기간(일 단위, 기본값: 7일)
 */
export const updateCookie = (key: string, updatedValue: CookieValue, expiresDays: number = 7): void => {
    try {
        const existingValue = getCookie(key);

        // 기존 데이터가 객체일 때만 업데이트 수행
        if (existingValue && typeof existingValue === "object" && !Array.isArray(existingValue)) {
            if (typeof updatedValue === "object" && !Array.isArray(updatedValue)) {
                // 기존 객체와 업데이트 값을 병합하여 새 값을 생성
                const newValue = {
                    ...existingValue,
                    ...updatedValue,
                };
                setCookie(key, newValue, expiresDays);
                console.log(`쿠키 "${key}"가 성공적으로 업데이트되었습니다.`);
            } else {
                console.error("업데이트할 값이 객체가 아닙니다. 업데이트가 수행되지 않았습니다.");
            }
        } else {
            // 기존 값이 없거나 객체가 아닌 경우 새로운 쿠키를 설정
            setCookie(key, updatedValue, expiresDays);
            console.log(`쿠키 "${key}"가 새롭게 생성되었습니다.`);
        }
    } catch (error) {
        console.error("쿠키 업데이트 중 오류가 발생했습니다:", error);
    }
};
