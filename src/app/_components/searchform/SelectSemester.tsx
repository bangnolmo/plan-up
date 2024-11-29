import React, { useEffect } from "react";
import { Select, SelectItem } from "@nextui-org/react";

interface SelectSemesterProps {
    selectedSemester: string;
    onSelectionChange: (semester: string) => void;
}

export default function SelectSemester({ selectedSemester, onSelectionChange }: SelectSemesterProps) {
    const semesters = [
        { label: "1학기", value: "10" },
        { label: "2학기", value: "20" },
    ];

    useEffect(() => {
        const currentMonth = new Date().getMonth() + 1;
        const defaultSemester = currentMonth <= 6 ? "10" : "20";
        if (selectedSemester === "") {
            onSelectionChange(defaultSemester);
        }
    }, [selectedSemester, onSelectionChange]);

    return (
        <Select
            isRequired
            label="학기 선택"
            value={selectedSemester}
            onSelectionChange={(value) => {
                const stringValue = value?.currentKey;
                if (stringValue) onSelectionChange(stringValue);
            }}
            className="max-w-xs"
        >
            {semesters.map((semester) => (
                <SelectItem key={semester.value} value={semester.value}>
                    {semester.label}
                </SelectItem>
            ))}
        </Select>
    );
}
