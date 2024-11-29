export type LectureItem = {
    sub_num: string;
    name: string;
    grade: number;
    course_type: string;
    credits: number;
    professor: string;
    note: string;
    period: string;
    location: string;
    groupAttribute: number;
    classTime?: number[];
    [key: string]: string | number | number[] | undefined; // sub_num 외에도 다양한 필드를 가질 수 있는 타입
};

export type Groups = {
    [key: string]: LectureItem[];
};

export const dayMapping = {
    월: 0,
    화: 10,
    수: 20,
    목: 30,
    금: 40,
};

export const dayDeMapping = {
    0: '월',
    1: '화',
    2: '수',
    3: '목',
    4: '금',
};

export type timeTable = {
    totalGrade: number;
    totalTime: number[];
    classItem: LectureItem[];
}

export type timeTalbeList = {
    [key: string]: timeTable[];
};