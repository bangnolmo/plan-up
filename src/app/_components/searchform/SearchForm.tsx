import React, { useState } from "react";
import { Card, CardBody, Tabs, Tab } from "@nextui-org/react";
import SelectYear from "./SelectYear";
import SelectSemester from "./SelectSemester";
import SelectMajor from "./SelectMajor";
import SelectGeneral from "./SelectGeneral";

interface SearchFormProps {
    onYearChange: (year: string) => void;
    onSemesterChange: (semester: string) => void;
    onCategoryChange: (category: string) => void;
    onDetailChange: (detail: string) => void;
}

export default function SearchForm({ onYearChange, onSemesterChange, onCategoryChange, onDetailChange }: SearchFormProps) {
    const currentYear = new Date().getFullYear();
    const currentMonth = new Date().getMonth() + 1;
    const [selectedYear, setSelectedYear] = useState<string>(currentYear.toString());
    const [selectedSemester, setSelectedSemester] = useState<string>(currentMonth <= 6 ? "10" : "20");
    const [category, setCategory] = useState<string>("general");
    const [detail, setDetail] = useState<string>("");

    const handleYearSelectionChange = (newSelectedYear: string) => {
        setSelectedYear(newSelectedYear);
        onYearChange(newSelectedYear);
    };

    const handleSemesterSelectionChange = (newSelectedSemester: string) => {
        setSelectedSemester(newSelectedSemester);
        onSemesterChange(newSelectedSemester);
    };

    const handleCategoryChange = (newCategory: string) => {
        setCategory(newCategory);
        onCategoryChange(newCategory);
    };

    const handleDetailChange = (newDetail: string) => {
        setDetail(newDetail);
        onDetailChange(newDetail);
    };

    return (
        <div className="m-2 p-2 sm:m-2 sm:p-4">
            <Tabs aria-label="교양 / 전공 선택" selectedKey={category} onSelectionChange={(key) => handleCategoryChange(key.toString())}>
                <Tab key="general" title="교양">
                    <Card>
                        <CardBody>
                            <div className="flex flex-col sm:flex-row gap-4 items-center">
                                <SelectYear selectedYear={selectedYear} onSelectionChange={handleYearSelectionChange} />
                                <SelectSemester selectedSemester={selectedSemester} onSelectionChange={handleSemesterSelectionChange} />
                                <SelectGeneral
                                    selectedGeneral={detail}
                                    onSelectionChange={handleDetailChange}
                                    year={selectedYear}
                                    hakgi={selectedSemester}
                                />
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
                                <SelectMajor
                                    selectedMajor={detail}
                                    onSelectionChange={handleDetailChange}
                                    year={selectedYear}
                                    hakgi={selectedSemester}
                                />
                            </div>
                        </CardBody>
                    </Card>
                </Tab>
            </Tabs>
        </div>
    );
}
