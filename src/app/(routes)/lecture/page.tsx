"use client";

import { useState } from "react";
import ListView from "@/app/_components/listview/ListView";
import { mockLectures } from "@/app/_mocks/mockLectureData";
import Header from "@/app/_components/Header";
import PageInfo from "@/app/_components/PageInfo";
import SearchForm from "@/app/_components/searchform/SearchForm";
import { handleCartAddClick, handleFloatingCartClick } from "@/app/_buttonHandlers/cartButtonHandler";
import FloatingButton from "@/app/_components/FloatingButton";
import { ShoppingBasket } from "lucide-react";
import { columns } from "@/app/_configs/lectureColumns";

const DynamicLectureTable = () => {
    const [lectures, setLectures] = useState(mockLectures);

    const [filters, setFilters] = useState({
        year: "",
        semester: "",
        category: "",
        detail: "",
    });

    if (false) {
        // 린트 해제
        console.log(setLectures, filters);
    }

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
            <ListView columns={columns} items={lectures} actionType="add" onActionButtonClick={handleCartAddClick} />
            <FloatingButton
                color="danger"
                icon={<ShoppingBasket size={30} className="m-2 lg:m-4 text-primary" />}
                onPress={handleFloatingCartClick}
            />
        </>
    );
};

export default DynamicLectureTable;
