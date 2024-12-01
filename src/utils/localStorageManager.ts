/* eslint-disable @typescript-eslint/no-unused-vars */

export interface Lecture {
    sub_num: string;
    name: string;
    grade: number;
    course_type: string;
    credits: number;
    professor: string;
    note: string;
    period: string;
    location: string;
    parent_idx: number;
    classTime: number[];
}

export interface LectureGroup {
    name: string;
    lectures: Lecture[];
}

// 정수형 배열을 생성하기 맵핑 테이블
export const dayMappingEn = {
    월: 0,
    화: 10,
    수: 20,
    목: 30,
    금: 40,
};

export const dayMappingDe = {
    0: '월',
    1: '화',
    2: '수',
    3: '목',
    4: '금',
};

export class LocalStorageManager {
    private static storageKey = "lectureGroups";
    private static storageKeyCart = "cart";

    static initialize(): void {
        if (typeof window === "undefined") return;

        try {
            const testKey = "__test__";
            localStorage.setItem(testKey, testKey);
            localStorage.removeItem(testKey);
        } catch (error) {
            console.warn("localStorage를 사용할 수 없는 환경입니다.");
            return;
        }

        if (!localStorage.getItem(this.storageKey)) {
            const initialData: LectureGroup[] = [{ name: "Group 1", lectures: [] }];
            localStorage.setItem(this.storageKey, JSON.stringify(initialData));
        }
    }

    static getAllGroups(): LectureGroup[] {
        if (typeof window === "undefined") return [];
        const data = localStorage.getItem(this.storageKey);
        return data ? JSON.parse(data) : [];
    }

    static addGroup(groupName: string): void {
        if (typeof window === "undefined") return;
        const groups = this.getAllGroups();
        if (groups.length > 9){
            throw new Error(`그룹은 최대 10개까지 생성 가능합니다.`);
        }
        groups.push({ name: groupName, lectures: [] });
        localStorage.setItem(this.storageKey, JSON.stringify(groups));
    }

    static renameGroup(oldName: string, newName: string): void {
        if (typeof window === "undefined") return;
        const groups = this.getAllGroups();
        const group = groups.find((group) => group.name === oldName);

        if (!group) {
            throw new Error(`"${oldName}" 그룹을 찾을 수 없습니다.`);
        }

        const nameExists = groups.some((group) => group.name === newName);
        if (nameExists) {
            throw new Error(`"${newName}" 이름을 가진 그룹이 이미 존재합니다.`);
        }

        group.name = newName;
        localStorage.setItem(this.storageKey, JSON.stringify(groups));
    }

    static removeGroup(groupName: string): void {
        if (typeof window === "undefined") return;
        let groups = this.getAllGroups();
        groups = groups.filter((group) => group.name !== groupName);
        localStorage.setItem(this.storageKey, JSON.stringify(groups));
    }

    static addLectureToGroup(groupName: string, lecture: Lecture): void {
        if (typeof window === "undefined") return;
        const groups = this.getAllGroups();
        const groupsAllLecture = this.getAllLectures();
        const group = groups.find((group) => group.name === groupName);

        if (!group) {
            throw new Error(`"${groupName}" 그룹을 찾을 수 없습니다.`);
        }

        //중복체크 전체 그룹 내 과목으로 체크하도록 로직 수정
        const exists = groupsAllLecture.some((l:Lecture) => l.sub_num === lecture.sub_num);
        if (exists) {
            throw new Error(`"${lecture.sub_num}"은 이미 그룹에 저장되어 있습니다.`);
        }

        // 정수배열을 위해 수정
        const extendedLecture = {
            ...lecture,
            classTime: enClassTime(lecture.period),
        };
        // 수정된 값을 저장
        group.lectures.push(extendedLecture);
        localStorage.setItem(this.storageKey, JSON.stringify(groups));
    }

    static removeLectureFromGroup(groupName: string, sub_num: string): void {
        if (typeof window === "undefined") return;
        const groups = this.getAllGroups();
        const group = groups.find((group) => group.name === groupName);

        if (!group) {
            throw new Error(`"${groupName}" 그룹을 찾을 수 없습니다.`);
        }

        group.lectures = group.lectures.filter((l) => l.sub_num !== sub_num);
        localStorage.setItem(this.storageKey, JSON.stringify(groups));
    }

    static getLectureCountByGroup(groupName: string): number {
        if (typeof window === "undefined") return 0;
        const groups = this.getAllGroups();
        const group = groups.find((group) => group.name === groupName);
        if (!group) {
            throw new Error(`"${groupName}" 그룹을 찾을 수 없습니다.`);
        }
        return group.lectures.length;
    }

    static getTotalLectureCount(): number {
        if (typeof window === "undefined") return 0;
        const groups = this.getAllGroups();
        return groups.reduce((total, group) => total + group.lectures.length, 0);
    }

    static getAllGroupsWithLectures(): { groupName: string; lectures: Lecture[] }[] {
        if (typeof window === "undefined") return [];
        const data = localStorage.getItem(this.storageKey);
        const groups: LectureGroup[] = data ? JSON.parse(data) : [];
        return groups.map((group) => ({ groupName: group.name, lectures: group.lectures }));
    }

    static getAllLectures(): Lecture[] {
        if (typeof window === "undefined") return [];
        const groups = this.getAllGroups();
        const allLectures: Lecture[] = [];
        groups.forEach((group) => {
            group.lectures.forEach((lecture) => {
                const exists = allLectures.some((l) => l.sub_num === lecture.sub_num);
                if (!exists) {
                    allLectures.push(lecture);
                }
            });
        });
        return allLectures;
    }
}

// "월 1 2 3" 처럼 되어있는 문자열 데이터를 정수형 데이터로 인코딩
export const enClassTime = (classTimeInfo: string): number[] => {
    const dayInfo = classTimeInfo.split(" ");
    if (dayInfo.length <= 1){
        const exception = [-1]
        return exception;
    }else{
        const day = dayMappingEn[dayInfo[0] as keyof typeof dayMappingEn];
        const encodingTimeInfo = dayInfo.slice(1).map((value) => day + parseInt(value));
        return encodingTimeInfo;
    }
    
};

