"use client";

import { useState, useEffect } from "react";
import ListView from "@/app/_components/listview/ListView";
import { mockLectures } from "@/app/_mocks/mockLectureData";
import Header from "@/app/_components/Header";
import PageInfo from "@/app/_components/PageInfo";
import SearchForm from "@/app/_components/searchform/SearchForm";

const columns = [
    { key: "lecture_name", label: "강의명" },
    { key: "hakgwa_cd", label: "학과 코드" },
    { key: "grade", label: "학년" },
    { key: "term", label: "학기" },
    { key: "course_type", label: "이수 구분" },
    { key: "credit", label: "학점" },
    { key: "professor_name", label: "교수명" },
    { key: "enrollment_status", label: "수강 상태" },
    { key: "time", label: "강의 시간" },
    { key: "location", label: "강의실 위치" },
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
            <ListView columns={columns} items={lectures} actionType="none" />
        </>
    );
};

export default DynamicLectureTable;
