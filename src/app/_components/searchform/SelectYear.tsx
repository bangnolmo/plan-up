"use client";

import React from "react";
import { Select, SelectItem } from "@nextui-org/react";

interface SelectYearProps {
  selectedYear: string;
  onSelectionChange: (year: string) => void;
}

export default function SelectYear({
  selectedYear,
  onSelectionChange,
}: SelectYearProps) {
  const currentYear = new Date().getFullYear();
  const years = Array.from(
    { length: currentYear - 2014 + 1 },
    (_, i) => 2014 + i
  );

  return (
    <Select
      isRequired
      label="개설년도"
      placeholder="년도를 선택하세요"
      value={selectedYear}
      onSelectionChange={(value) => onSelectionChange(value as string)}
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
