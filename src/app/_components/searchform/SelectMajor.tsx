import { Autocomplete, AutocompleteItem, AutocompleteSection } from "@nextui-org/react";
import { humanitiesMajors, engineeringMajors } from "@/app/_mocks/mockMajorData"; // mockMajorData에서 전공 데이터 불러오기

interface SelectMajorProps {
    selectedMajor: string;
    onSelectionChange: (major: string) => void;
}

export default function SelectMajor({ selectedMajor, onSelectionChange }: SelectMajorProps) {
    const headingClasses = "flex w-full sticky top-1 z-20 py-1.5 px-2 bg-default-100 shadow-small rounded-small";

    return (
        <Autocomplete
            label="전공 선택"
            variant="bordered"
            placeholder="전공을 입력하세요"
            value={selectedMajor}
            onSelectionChange={(value) => onSelectionChange(value as string)}
            className="max-w-xs"
            scrollShadowProps={{
                isEnabled: false,
            }}
        >
            {/* 인문대학 섹션 */}
            <AutocompleteSection
                title="인문대학"
                classNames={{
                    heading: headingClasses,
                }}
            >
                {humanitiesMajors.map((major) => (
                    <AutocompleteItem key={major.value} value={major.value}>
                        {major.label}
                    </AutocompleteItem>
                ))}
            </AutocompleteSection>

            {/* 공과대학 섹션 */}
            <AutocompleteSection
                title="공과대학"
                classNames={{
                    heading: headingClasses,
                }}
            >
                {engineeringMajors.map((major) => (
                    <AutocompleteItem key={major.value} value={major.value}>
                        {major.label}
                    </AutocompleteItem>
                ))}
            </AutocompleteSection>
        </Autocomplete>
    );
}
