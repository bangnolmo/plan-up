"use client";

import Header from "@/app/_components/Header";
import PageInfo from "@/app/_components/PageInfo";
import { useState, useEffect } from "react";
import ListView from "@/app/_components/listview/ListView";
// import SearchForm from "@/app/_components/searchform/SearchForm";
import { getCookie } from "@/app/_cookieManager/cookieManager";

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

const Wizard = () => {

    const [lectures, setLectures] = useState<Record<string, string | number>[]>([]);

    useEffect(() => {
        // 쿠키에서 데이터를 가져옴
        const savedLectures = getCookie('clickedItemData');
        
        if (Array.isArray(savedLectures)) {
            // 쿠키 데이터가 배열 형식인 경우 상태로 설정
            setLectures(savedLectures.filter((el): el is Record<string, string | number> => {
                return typeof el === 'object' && el !== null && !Array.isArray(el) &&
                    Object.values(el).every(value => typeof value === 'string' || typeof value === 'number');
            }));
        } else {
            console.error("쿠키 데이터가 예상하지 못한 형식입니다.");
        }
    }, []);

    return (
        <>
            <Header />
            <PageInfo title="시간표 만들기" description="시간표를 만들 수 있어요." />
             <ListView columns={columns} items={lectures} actionType="delete" />
        </>
    );
};

export default Wizard;
