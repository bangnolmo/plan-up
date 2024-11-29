import React from "react";
import { Select, SelectItem } from "@nextui-org/react";

interface SelectYearProps {
    selectedYear: string;
    onSelectionChange: (year: string) => void;
}

export default function SelectYear({ selectedYear, onSelectionChange }: SelectYearProps) {
    const currentYear = new Date().getFullYear();
    const years = Array.from({ length: currentYear - 2024 + 1 }, (_, i) => 2024 + i);

    return (
        <Select
            isRequired
            label="개설년도"
            value={selectedYear}
            onSelectionChange={(value) => {
                const stringValue = value?.currentKey;
                if (stringValue) onSelectionChange(stringValue);
            }}
            className="max-w-xs"
        >
            {years.map((year) => (
                <SelectItem key={year} value={year.toString()}>
                    {year.toString()}
                </SelectItem>
            ))}
        </Select>
    );
}
