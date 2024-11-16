import { Autocomplete, AutocompleteItem } from "@nextui-org/react";
import { mockGeneral } from "@/app/_mocks/mockGeneralData";

interface SelectGeneralProps {
    selectedGeneral: string;
    onSelectionChange: (major: string) => void;
}

export default function SelectGeneral({ selectedGeneral, onSelectionChange }: SelectGeneralProps) {
    return (
        <Autocomplete
            label="시간대 구분"
            placeholder="구분을 입력하세요"
            variant="bordered"
            value={selectedGeneral}
            onChange={(e) => onSelectionChange(e.target.value)}
            className="max-w-xs"
        >
            {mockGeneral.map((general) => (
                <AutocompleteItem key={general.value} value={general.value}>
                    {general.label}
                </AutocompleteItem>
            ))}
        </Autocomplete>
    );
}
