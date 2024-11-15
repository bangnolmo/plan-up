"use client";

import React, { useState } from "react";
import { Card, CardBody, Button } from "@nextui-org/react";
import SelectYear from "./SelectYear";
import SelectSemester from "./SelectSemester";
import SelectMajor from "./SelectMajor";

export default function SearchForm() {
  const currentYear = new Date().getFullYear();
  const [selectedYear, setSelectedYear] = useState(currentYear.toString());
  const [selectedSemester, setSelectedSemester] = useState("10");
  const [selectedMajor, setSelectedMajor] = useState<string>("");

  const handleYearSelectionChange = (
    newSelectedYear: React.SetStateAction<string>
  ) => {
    setSelectedYear(newSelectedYear);
  };

  const handleSemesterSelectionChange = (
    newSelectedSemester: React.SetStateAction<string>
  ) => {
    setSelectedSemester(newSelectedSemester);
  };

  const handleMajorSelectionChange = (newSelectedMajor: string) => {
    setSelectedMajor(newSelectedMajor);
  };

  return (
    <div className="m-2 p-2 sm:m-2 sm:p-4">
      <Card>
        <CardBody>
          <div className="flex flex-col sm:flex-row gap-4 items-center">
            <SelectYear
              selectedYear={selectedYear}
              onSelectionChange={handleYearSelectionChange}
            />
            <SelectSemester
              selectedSemester={selectedSemester}
              onSelectionChange={handleSemesterSelectionChange}
            />
            <SelectMajor
              selectedMajor={selectedMajor}
              onSelectionChange={handleMajorSelectionChange}
            />
          </div>

          {/* <p className="text-small text-default-500 mt-4">
            Selected Year: {selectedYear}
          </p>
          <p className="text-small text-default-500 mt-4">
            Selected Semester: {selectedSemester}
          </p>
          <p className="text-small text-default-500 mt-4">
            Selected Major: {selectedMajor}
          </p> */}
        </CardBody>
      </Card>
    </div>
  );
}
