export type LectureItem = {
    sub_num: string;
    [key: string]: string | number; // sub_num 외에도 다양한 필드를 가질 수 있는 타입
};

export type Groups = {
    [key: string]: LectureItem[];
};
