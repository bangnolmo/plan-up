"use client";

import React, { useState } from "react";
import { Card, CardBody, Tabs, Tab } from "@nextui-org/react";
import SelectYear from "./SelectYear";
import SelectSemester from "./SelectSemester";
import SelectMajor from "./SelectMajor";
import SelectGeneral from "./SelectGeneral";

export default function SearchForm() {
    const currentYear = new Date().getFullYear();
    const [selectedYear, setSelectedYear] = useState(currentYear.toString());
    const [selectedSemester, setSelectedSemester] = useState("10");
    const [selectedMajor, setSelectedMajor] = useState<string>("");
    const [selectedGeneral, setSelectedGeneral] = useState<string>("");

    const handleYearSelectionChange = (newSelectedYear: React.SetStateAction<string>) => {
        setSelectedYear(newSelectedYear);
        console.log("Selected Year:", newSelectedYear); // 출력
    };

    const handleSemesterSelectionChange = (newSelectedSemester: React.SetStateAction<string>) => {
        setSelectedSemester(newSelectedSemester);
        console.log("Selected Semester:", newSelectedSemester); // 출력
    };

    const handleMajorSelectionChange = (newSelectedMajor: string) => {
        setSelectedMajor(newSelectedMajor);
        console.log("Selected Major:", newSelectedMajor); // 출력
    };

    const handleGeneralSelectionChange = (newSelectedGeneral: string) => {
        setSelectedGeneral(newSelectedGeneral);
        console.log("Selected Major:", newSelectedGeneral); // 출력
    };

    return (
        <div className="m-2 p-2 sm:m-2 sm:p-4">
            <Tabs aria-label="교양 / 전공 선택">
                <Tab key="general" title="교양">
                    <Card>
                        <CardBody>
                            <div className="flex flex-col sm:flex-row gap-4 items-center">
                                <SelectYear selectedYear={selectedYear} onSelectionChange={handleYearSelectionChange} />
                                <SelectSemester selectedSemester={selectedSemester} onSelectionChange={handleSemesterSelectionChange} />
                                <SelectGeneral selectedGeneral={selectedGeneral} onSelectionChange={handleGeneralSelectionChange} />
                            </div>
                        </CardBody>
                    </Card>
                </Tab>
                <Tab key="major" title="전공">
                    <Card>
                        <CardBody>
                            <div className="flex flex-col sm:flex-row gap-4 items-center">
                                <SelectYear selectedYear={selectedYear} onSelectionChange={handleYearSelectionChange} />
                                <SelectSemester selectedSemester={selectedSemester} onSelectionChange={handleSemesterSelectionChange} />
                                <SelectMajor selectedMajor={selectedMajor} onSelectionChange={handleMajorSelectionChange} />
                            </div>
                        </CardBody>
                    </Card>
                </Tab>
            </Tabs>
        </div>
    );
}
