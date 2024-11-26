export type LectureItem = {
    sub_num: string;
    [key: string]: string | number; // sub_num 외에도 다양한 필드를 가질 수 있는 타입
};

export type Groups = {
    [key: string]: LectureItem[];
};

export interface CartStorage extends Record<string, unknown> {
    groups: {
        [groupId: string]: LectureItem[]; // 그룹별 과목 리스트
    };
}
