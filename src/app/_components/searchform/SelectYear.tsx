import React from "react";
import { Select, SelectItem } from "@nextui-org/react";
import { getYear } from "@/utils/defaultSearchParams";

interface SelectYearProps {
    selectedYear: string;
    onSelectionChange: (year: string) => void;
}

export default function SelectYear({ selectedYear, onSelectionChange }: SelectYearProps) {
    const years = Array.from({ length: getYear() - 2024 + 1 }, (_, i) => (2024 + i).toString());

    return (
        <Select
            isRequired
            label="개설년도"
            value={selectedYear}
            defaultSelectedKeys={[getYear().toString()]}
            onSelectionChange={(value) => {
                const stringValue = value?.currentKey;
                if (stringValue) onSelectionChange(stringValue);
            }}
        >
            {years.map((year) => (
                <SelectItem key={year} value={year}>
                    {year}
                </SelectItem>
            ))}
        </Select>
    );
}
