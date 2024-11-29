"use client";

import { useState } from "react";
import { handleCartAddClick, handleFloatingCartClick } from "@/utils/cartButtonHandler";
import FloatingButton from "@/app/_components/FloatingButton";
import { ShoppingBasket } from "lucide-react";
import { columns } from "@/app/_configs/lectureColumns";
import Header from "@/app/_components/Header";
import PageInfo from "@/app/_components/PageInfo";
import SearchForm from "@/app/_components/searchform/SearchForm";
import ListView from "@/app/_components/listview/ListView";
import { Button } from "@nextui-org/react";

const DynamicLectureTable = () => {
    const [lectures, setLectures] = useState([]);
    const [filters, setFilters] = useState({
        year: "",
        semester: "",
        category: "",
        detail: "",
    });

    const handleYearChange = (year: string) => {
        setFilters((prev) => ({ ...prev, year }));
    };

    const handleSemesterChange = (semester: string) => {
        setFilters((prev) => ({ ...prev, semester }));
    };

    const handleCategoryChange = (category: string) => {
        setFilters((prev) => ({ ...prev, category }));
    };

    const handleDetailChange = (detail: string) => {
        setFilters((prev) => ({ ...prev, detail }));
    };

    const handleSearchClick = async () => {
        const { year, semester, category, detail } = filters;
        const apiUrl = `${process.env.NEXT_PUBLIC_API_URL}lectures?idx=${detail}`;

        try {
            const response = await fetch(apiUrl);
            if (!response.ok) {
                throw new Error("Failed to fetch lectures");
            }
            const data = await response.json();
            setLectures(data);
        } catch (error) {
            console.error("Error fetching lectures:", error, year, semester, category, detail);
        }
    };

    // Check if both year and semester are selected
    const isSearchDisabled = !filters.year || !filters.semester;

    return (
        <>
            <Header />
            <PageInfo title="개설과목 조회" description="개설 과목을 조회할 수 있어요." />
            <SearchForm
                onYearChange={handleYearChange}
                onSemesterChange={handleSemesterChange}
                onCategoryChange={handleCategoryChange}
                onDetailChange={handleDetailChange}
            />

            <div className="m-2 flex justify-center">
                <Button onClick={handleSearchClick} color="primary" disabled={isSearchDisabled}>
                    검색
                </Button>
            </div>

            {isSearchDisabled && (
                <div className="text-gray-500 text-center text-sm my-16 mx-4">
                    개설년도 및 학기를 선택 후,
                    <br />
                    검색 버튼을 눌러 과목을 조회하세요.
                </div>
            )}
            {lectures.length > 0 && <ListView columns={columns} items={lectures} actionType="add" onActionButtonClick={handleCartAddClick} />}

            <FloatingButton
                color="danger"
                icon={<ShoppingBasket size={30} className="m-2 lg:m-4 text-primary" />}
                onPress={handleFloatingCartClick}
            />
        </>
    );
};

export default DynamicLectureTable;
