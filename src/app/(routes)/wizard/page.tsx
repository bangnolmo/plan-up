"use client";

import Header from "@/app/_components/Header";
import PageInfo from "@/app/_components/PageInfo";
import TableView from "@/app/_components/tableview/TableView";


const Wizard = () => { 

    return (
        <>
            <Header />
            <PageInfo title="시간표 만들기" description="시간표를 만들 수 있어요." />
            <TableView/>
        </>
    );
};

export default Wizard;
