"use client";
import { useState, useEffect } from "react";
import ListView from "@/app/_components/listview/ListView";
import Header from "@/app/_components/Header";
import PageInfo from "@/app/_components/PageInfo";
import { handleCartDeleteClick } from "@/utils/cartButtonHandler";
import { getLocalStorage } from "@/utils/localStorageManager";
import { addLocalStorageListener } from "@/utils/eventListenerManager";
import { columns } from "@/app/_configs/lectureColumns";

const CartTable = () => {
    const [lectures, setLectures] = useState<Record<string, string | number>[]>([]);

    useEffect(() => {
        const fetchData = () => {
            const savedLectures = getLocalStorage("cartItem");
            if (Array.isArray(savedLectures)) {
                setLectures(
                    savedLectures.filter((el): el is Record<string, string | number> => {
                        return (
                            typeof el === "object" &&
                            el !== null &&
                            !Array.isArray(el) &&
                            Object.values(el).every((value) => typeof value === "string" || typeof value === "number")
                        );
                    })
                );
            } else {
                console.error("로컬 스토리지 데이터가 예상하지 못한 형식입니다.");
            }
        };

        fetchData();

        const unsubscribe = addLocalStorageListener<number>("cartItem", fetchData);

        return () => {
            unsubscribe();
        };
    }, []);

    return (
        <>
            <Header />
            <PageInfo title="장바구니" description="장바구니에 담긴 과목을 확인할 수 있어요" />
            <ListView columns={columns} items={lectures} actionType="delete" onActionButtonClick={handleCartDeleteClick} />
        </>
    );
};

export default CartTable;
