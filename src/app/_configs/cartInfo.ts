export type LectureItem = {
    sub_num: string;
    period: string;
    [key: string]: string | number | number[]; // sub_num 외에도 다양한 필드를 가질 수 있는 타입

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