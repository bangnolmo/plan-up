import { Select, SelectItem, SelectSection } from "@nextui-org/react";

interface SelectMajorProps {
  selectedMajor: string;
  onSelectionChange: (major: string) => void;
}

export default function SelectMajor({
  selectedMajor,
  onSelectionChange,
}: SelectMajorProps) {
  const headingClasses =
    "flex w-full sticky top-1 z-20 py-1.5 px-2 bg-default-100 shadow-small rounded-small";

  const humanitiesMajors = [
    { label: "국어국문학과", value: "korean" },
    { label: "영어영문학과", value: "english" },
    { label: "철학과", value: "philosophy" },
    { label: "사학과", value: "history" },
    { label: "심리학과", value: "psychology" },
    { label: "사회학과", value: "sociology" },
    { label: "미디어학과", value: "media" },
    { label: "경제학과", value: "economics" },
  ];

  const engineeringMajors = [
    { label: "컴퓨터공학과", value: "cs" },
    { label: "기계공학과", value: "mech" },
    { label: "전자공학과", value: "ee" },
    { label: "화학공학과", value: "chem" },
    { label: "토목공학과", value: "civil" },
    { label: "산업공학과", value: "industrial" },
    { label: "건축공학과", value: "architecture" },
    { label: "환경공학과", value: "environmental" },
  ];

  return (
    <Select
      label="전공 선택"
      placeholder="전공을 선택하세요"
      className="max-w-xs"
      value={selectedMajor}
      onSelectionChange={(value) => onSelectionChange(value as string)}
      scrollShadowProps={{
        isEnabled: false,
      }}
    >
      <SelectSection
        title="인문대학"
        classNames={{
          heading: headingClasses,
        }}
      >
        {humanitiesMajors.map((major) => (
          <SelectItem key={major.value} value={major.value}>
            {major.label}
          </SelectItem>
        ))}
      </SelectSection>

      <SelectSection
        title="공과대학"
        classNames={{
          heading: headingClasses,
        }}
      >
        {engineeringMajors.map((major) => (
          <SelectItem key={major.value} value={major.value}>
            {major.label}
          </SelectItem>
        ))}
      </SelectSection>
    </Select>
  );
}
