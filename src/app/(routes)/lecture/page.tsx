// DynamicLectureTable.tsx
"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Popover, PopoverTrigger, PopoverContent, Button } from "@nextui-org/react";
import FloatingButton from "@/app/_components/FloatingButton";
import { ShoppingBasket } from "lucide-react";
import { columns } from "@/app/_configs/lectureColumns";
import Header from "@/app/_components/Header";
import PageInfo from "@/app/_components/PageInfo";
import SearchForm from "@/app/_components/searchform/SearchForm";
import ListView from "@/app/_components/listview/ListView";
import { Lecture, LocalStorageManager } from "@/utils/localStorageManager";
import { getSemester, getYear } from "@/utils/defaultSearchParams";
import AddToCartModal from "@/app/_components/listview/AddToCartModal";

const DynamicLectureTable = () => {
    const router = useRouter();
    const [lectures, setLectures] = useState<Lecture[] | null>(null);
    const [cartItemCount, setCartItemCount] = useState(LocalStorageManager.getTotalLectureCount());
    const [selectedLecture, setSelectedLecture] = useState<Lecture | null>(null);
    const [isModalOpen, setModalOpen] = useState(false);
    const [filters, setFilters] = useState({
        year: getYear().toString(),
        semester: getSemester(),
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

    const handleRouteToCart = () => {
        router.push("/cart");
    };

    const openModal = (item: Lecture) => {
        setSelectedLecture(item);
        setModalOpen(true);
    };

    const closeModal = () => {
        setModalOpen(false);
    };

    const updateCartItemCount = (count: number) => {
        setCartItemCount(count);
    };

    const isDetailEmpty = !filters.detail;

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
                {isDetailEmpty && (
                    <Popover placement="top" backdrop="opaque">
                        <PopoverTrigger>
                            <Button onClick={handleSearchClick} color={isDetailEmpty ? "secondary" : "primary"} disabled={isDetailEmpty}>
                                검색
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent>
                            <div className="px-1 py-2">
                                <div className="text-small font-bold">모든 항목을 채워주세요.</div>
                                <div className="text-tiny">아직 입력되지 않은 값이 존재합니다.</div>
                            </div>
                        </PopoverContent>
                    </Popover>
                )}
                {!isDetailEmpty && (
                    <Button onClick={handleSearchClick} color="primary">
                        검색
                    </Button>
                )}
            </div>

            {isDetailEmpty && (
                <div className="text-gray-500 text-center text-sm my-16 mx-4">
                    개설년도 및 학기를 선택 후,
                    <br />
                    검색 버튼을 눌러 과목을 조회하세요.
                </div>
            )}

            {lectures && lectures.length > 0 && (
                <ListView columns={columns} items={lectures}>
                    {(item) => (
                        <Button aria-label="Add to Cart" onPress={() => openModal(item)} color="primary" size="sm">
                            장바구니 추가
                        </Button>
                    )}
                </ListView>
            )}

            {!isDetailEmpty && !lectures && <div className="text-center text-sm text-gray-500 my-16">검색 결과가 없습니다.</div>}

            <FloatingButton
                color="danger"
                icon={<ShoppingBasket size={30} className="m-2 lg:m-4 text-primary" />}
                count={cartItemCount}
                onPress={handleRouteToCart}
            />

            <AddToCartModal isOpen={isModalOpen} onClose={closeModal} selectedLecture={selectedLecture} onCartUpdate={updateCartItemCount} />
        </>
    );
};

export default DynamicLectureTable;
