"use client";

import { useState, useEffect } from "react";
import ListView from "@/app/_components/listview/ListView";
import { mockLectures } from "@/app/_mocks/mockLectureData";
import Header from "@/app/_components/Header";
import PageInfo from "@/app/_components/PageInfo";
import SearchForm from "@/app/_components/searchform/SearchForm";
import { handleCartAddClick, handleFloatingCartClick } from "@/app/_buttonHandlers/cartButtonHandler";
import FloatingButton from "@/app/_components/buttons/floatingButton";
import { AddIcon } from "@/app/_components/Icon/AddIcon";

const columns = [
    { key: "sub_num", label: "과목번호" },
    { key: "name", label: "과목명" },
    { key: "grade", label: "학년" },
    { key: "course_type", label: "이수구분" },
    { key: "credits", label: "학점" },
    { key: "professor", label: "교수명" },
    { key: "note", label: "비고" },
    { key: "period", label: "교시" },
    { key: "location", label: "강의실" },
];

const DynamicLectureTable = () => {
    const [lectures, setLectures] = useState(mockLectures);

    useEffect(() => {
        console.log(setLectures);
        // 예시로 데이터를 API에서 가져오는 로직 추가
        // fetch('/api/lectures')
        //   .then((response) => response.json())
        //   .then((data) => setLectures(data));
    }, []);

    return (
        <>
            <Header />
            <PageInfo title="개설과목 조회" description="개설 과목을 조회할 수 있어요." />
            <SearchForm />
            <ListView columns={columns} items={lectures} actionType="add" onActionButtonClick={handleCartAddClick} />
            <FloatingButton color="success" ariaLabel="" hovermsg="" variant="faded" icon={<AddIcon size={30} />} onPress={handleFloatingCartClick} />
        </>
    );
};

export default DynamicLectureTable;
