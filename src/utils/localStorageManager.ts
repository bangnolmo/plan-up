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
}

export interface LectureGroup {
    name: string;
    lectures: Lecture[];
}

export class LocalStorageManager {
    private static storageKey = "lectureGroups";

    static initialize(): void {
        if (!localStorage.getItem(this.storageKey)) {
            const initialData: LectureGroup[] = [{ name: "Group 1", lectures: [] }];
            localStorage.setItem(this.storageKey, JSON.stringify(initialData));
        }
    }

    static getAllGroups(): LectureGroup[] {
        const data = localStorage.getItem(this.storageKey);
        return data ? JSON.parse(data) : [];
    }

    static addGroup(groupName: string): void {
        const groups = this.getAllGroups();
        groups.push({ name: groupName, lectures: [] });
        localStorage.setItem(this.storageKey, JSON.stringify(groups));
    }

    static renameGroup(oldName: string, newName: string): void {
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
        let groups = this.getAllGroups();
        groups = groups.filter((group) => group.name !== groupName);
        localStorage.setItem(this.storageKey, JSON.stringify(groups));
    }

    static addLectureToGroup(groupName: string, lecture: Lecture): void {
        const groups = this.getAllGroups();
        const group = groups.find((group) => group.name === groupName);

        if (!group) {
            throw new Error(`"${groupName}" 그룹을 찾을 수 없습니다.`);
        }

        const exists = group.lectures.some((l) => l.sub_num === lecture.sub_num);
        if (exists) {
            throw new Error(`"${lecture.sub_num}"은 이미 그룹에 저장되어 있습니다.`);
        }

        group.lectures.push(lecture);
        localStorage.setItem(this.storageKey, JSON.stringify(groups));
    }

    static removeLectureFromGroup(groupName: string, sub_num: string): void {
        const groups = this.getAllGroups();
        const group = groups.find((group) => group.name === groupName);

        if (!group) {
            throw new Error(`"${groupName}" 그룹을 찾을 수 없습니다.`);
        }

        group.lectures = group.lectures.filter((l) => l.sub_num !== sub_num);
        localStorage.setItem(this.storageKey, JSON.stringify(groups));
    }

    static getLectureCountByGroup(groupName: string): number {
        const groups = this.getAllGroups();
        const group = groups.find((group) => group.name === groupName);
        if (!group) {
            throw new Error(`"${groupName}" 그룹을 찾을 수 없습니다.`);
        }
        return group.lectures.length;
    }

    static getTotalLectureCount(): number {
        const groups = this.getAllGroups();
        return groups.reduce((total, group) => total + group.lectures.length, 0);
    }

    static getAllGroupsWithLectures(): { groupName: string; lectures: Lecture[] }[] {
        const data = localStorage.getItem(this.storageKey);
        const groups: LectureGroup[] = data ? JSON.parse(data) : [];
        return groups.map((group) => ({ groupName: group.name, lectures: group.lectures }));
    }

    // 시간표 테스트용 메서드
    static getAllLectures(): Lecture[] {
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
