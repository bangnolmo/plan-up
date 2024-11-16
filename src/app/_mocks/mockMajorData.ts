// mockMajorData.ts

export const humanitiesMajors = [
    { label: "국어국문학과", value: "korean" },
    { label: "영어영문학과", value: "english" },
    { label: "철학과", value: "philosophy" },
    { label: "사학과", value: "history" },
    { label: "심리학과", value: "psychology" },
    { label: "사회학과", value: "sociology" },
    { label: "미디어학과", value: "media" },
    { label: "경제학과", value: "economics" },
  ];
  
  export const engineeringMajors = [
    { label: "컴퓨터공학과", value: "cs" },
    { label: "기계공학과", value: "mech" },
    { label: "전자공학과", value: "ee" },
    { label: "화학공학과", value: "chem" },
    { label: "토목공학과", value: "civil" },
    { label: "산업공학과", value: "industrial" },
    { label: "건축공학과", value: "architecture" },
    { label: "환경공학과", value: "environmental" },
  ];
  
  export const allMajors = [...humanitiesMajors, ...engineeringMajors];
  