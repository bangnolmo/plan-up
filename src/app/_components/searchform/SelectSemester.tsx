import React, { useEffect } from "react";
import { Select, SelectItem } from "@nextui-org/react";
import { getSemester } from "@/utils/defaultSearchParams";

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
        if (selectedSemester === "") {
            onSelectionChange(getSemester());
        }
    }, [selectedSemester, onSelectionChange]);

    return (
        <Select
            isRequired
            label="학기 선택"
            value={selectedSemester || getSemester()}
            defaultSelectedKeys={[getSemester()]}
            onSelectionChange={(value) => {
                const stringValue = value?.currentKey;
                if (stringValue) onSelectionChange(stringValue);
            }}
        >
            {semesters.map((semester) => (
                <SelectItem key={semester.value} value={semester.value}>
                    {semester.label}
                </SelectItem>
            ))}
        </Select>
    );
}
