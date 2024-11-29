import { LectureItem } from "@/app/_configs/commonInfo";
import { getLocalStorage, setLocalStorage } from "./localStorageManager";
import { timeTable, timeTalbeList } from "@/app/_configs/commonInfo";

const MAX_TIMETABLES = 10;

/**
 * 초기화 함수: 기본 시간표 초기화
 */
export const initializeTimeTable = () => {
    const initialTimeTableList: timeTalbeList = {};
    for (let i = 1; i <= MAX_TIMETABLES; i++) {
        initialTimeTableList[`timeTable${i}`] = [];
    }
    setLocalStorage("timeTableList", initialTimeTableList);
};

/**
 * 시간표 추가 함수
 * @param timeTableId - 시간표 ID
 * @param lecture - 추가할 과목
 */
export const addLectureToTimeTable = (timeTableId: string, lecture: LectureItem) => {
    const timeTableData = getLocalStorage("timeTableList") as timeTalbeList;

    if (!timeTableData || !timeTableData[timeTableId]) {
        console.error("해당 시간표가 존재하지 않습니다.");
        return;
    }

    const selectedTimeTable = timeTableData[timeTableId];
    const isConflict = selectedTimeTable.some((existingLecture) =>
        lecture.classTime &&
        lecture.classTime.some((time) =>
            existingLecture.totalTime.includes(time)
        )
    );

    if (isConflict) {
        console.error("시간표에 이미 겹치는 시간이 존재합니다.");
        return;
    }

    timeTableData[timeTableId] = timeTableData[timeTableId].map((table) => ({
        totalGrade: table.totalGrade + (lecture.grade as number || 0),
        totalTime: Array.isArray(lecture.classTime)
        ? [...table.totalTime, ...lecture.classTime] // 기존 시간 + 새로운 시간
        : table.totalTime,
        classItem: [...table.classItem, lecture],
    }));
    setLocalStorage("timeTableList", timeTableData);
};

/**
 * 시간표에서 과목 제거 함수
 * @param timeTableId - 시간표 ID
 * @param sub_num - 제거할 과목 번호
 */
export const removeLectureFromTimeTable = (timeTableId: string, sub_num: string) => {
    const timeTableData = getLocalStorage("timeTableList") as timeTalbeList;

    if (!timeTableData || !timeTableData[timeTableId]) {
        console.error("해당 시간표가 존재하지 않습니다.");
        return;
    }

    // 해당 시간표에서 sub_num이 일치하지 않는 항목만 필터링
    timeTableData[timeTableId] = timeTableData[timeTableId].filter(
        (lecture) => !lecture.classItem.some((item) => item.sub_num === sub_num)
    );

    // 로컬 스토리지에 업데이트된 시간표 저장
    setLocalStorage("timeTableList", timeTableData);
};

/**
 * 새로운 시간표 생성 함수
 * @param timeTableId - 시간표 ID
 */
export const createNewTimeTable = (timeTableId: string) => {
    const timeTableData = getLocalStorage("timeTableList") as timeTalbeList || {};

    if (Object.keys(timeTableData).length >= MAX_TIMETABLES) {
        console.error("더 이상 시간표를 추가할 수 없습니다. (최대 10개)");
        return;
    }

    timeTableData[timeTableId] = [];
    setLocalStorage("timeTableList", timeTableData);
};

/**
 * 특정 시간표 데이터를 가져오는 함수
 * @param timeTableId - 시간표 ID
 * @returns 해당 시간표 데이터
 */
export const getTimeTableData = (timeTableId: string): timeTable[] => {
    const timeTableData = getLocalStorage("timeTableList") as timeTalbeList;
    return timeTableData[timeTableId] || [];
};

/**
 * 모든 시간표 리스트를 가져오는 함수
 * @returns 전체 시간표 리스트
 */
export const getAllTimeTables = (): timeTalbeList => {
    const timeTableData = getLocalStorage("timeTableList") as timeTalbeList;
    if (!timeTableData) {
        initializeTimeTable();
        return {};
    }
    return timeTableData;
};

/**
 * 시간표 삭제 함수
 * @param timeTableId - 삭제할 시간표 ID
 */
export const deleteTimeTable = (timeTableId: string) => {
    const timeTableData = getLocalStorage("timeTableList") as timeTalbeList;

    if (!timeTableData || !timeTableData[timeTableId]) {
        console.error("해당 시간표가 존재하지 않습니다.");
        return;
    }

    delete timeTableData[timeTableId];
    setLocalStorage("timeTableList", timeTableData);
};

