// "use client";

// import Header from "@/app/_components/Header";
// import PageInfo from "@/app/_components/PageInfo";
// import TableView from "@/app/_components/tableview/TableView";
// import { timeTable } from "@/app/_configs/commonInfo";
// import { useEffect, useState } from "react";

// const Wizard = () => {

//     const [timeTableData, setTimeTableData] = useState<timeTable[]>([]);

//     // 시간표 데이터를 로드
//     useEffect(() => {
//         const loadTimeTableData = () => {
//             const allTimeTables = getAllTimeTables();
//             const firstTimeTableKey = Object.keys(allTimeTables)[0]; // 첫 번째 시간표를 사용
//             const firstTimeTable = allTimeTables[firstTimeTableKey] || [];
//             setTimeTableData(firstTimeTable);
//         };

//         loadTimeTableData();
//     }, []);

//     return (
//         <>
//             <Header />
//             <PageInfo title="시간표 만들기" description="시간표를 만들 수 있어요." />
//             <TableView timeTableData={timeTableData}/>
//         </>
//     );
// };

// export default Wizard;
// // "use client";

// // import Header from "@/app/_components/Header";
// // import PageInfo from "@/app/_components/PageInfo";
// // import TableView from "@/app/_components/tableview/TableView";
// // import ListView from "@/app/_components/listview/ListView"; // ListView 컴포넌트 추가
// // import { useEffect, useState } from "react";
// // import { getAllTimeTables, createNewTimeTable, addLectureToTimeTable } from "@/utils/timeTableManager"; // 필요한 함수들 가져오기
// // import { timeTable, LectureItem } from "@/app/_configs/commonInfo";
// // import { getLocalStorage } from "@/utils/localStorageManager"; // 장바구니 데이터 가져오기

// // const Wizard = () => {
// //     const [timeTables, setTimeTables] = useState<Record<string, timeTable[]>>({});
// //     const [selectedTable, setSelectedTable] = useState<string | null>(null);
// //     const [tableData, setTableData] = useState<LectureItem[]>([]); // `LectureItem[]`로 수정
// //     const [cartItems, setCartItems] = useState<LectureItem[]>([]); // 장바구니 데이터

// //     // 로컬 스토리지에서 시간표 및 장바구니 데이터 로드
// //     useEffect(() => {
// //         const loadTimeTables = () => {
// //             const allTables = getAllTimeTables();
// //             setTimeTables(allTables);

// //             // 첫 번째 시간표를 선택
// //             const firstKey = Object.keys(allTables)[0];
// //             if (firstKey) {
// //                 setSelectedTable(firstKey);
// //                 const firstTableClassItems = allTables[firstKey]?.flatMap((table) => table.classItem) || [];
// //                 setTableData(firstTableClassItems);
// //             }
// //         };

// //         const loadCartItems = () => {
// //             const storedCart = getLocalStorage("cartItem") as LectureItem[] | null;
// //             setCartItems(storedCart || []);
// //         };

// //         loadTimeTables();
// //         loadCartItems();
// //     }, []);

// //     // 새로운 시간표 생성
// //     const handleCreateNewTable = () => {
// //         const newTableKey = `timeTable${Object.keys(timeTables).length + 1}`;
// //         createNewTimeTable(newTableKey); // 새로운 시간표 로컬 스토리지에 추가
// //         const updatedTables = getAllTimeTables(); // 로컬 스토리지에서 최신 데이터 가져오기
// //         setTimeTables(updatedTables);
// //         setSelectedTable(newTableKey);
// //         setTableData([]); // 새로 생성된 시간표는 빈 데이터
// //     };

// //     // 시간표 선택 시 데이터 업데이트
// //     const handleSelectTable = (tableKey: string) => {
// //         setSelectedTable(tableKey);
// //         const selectedTableClassItems = timeTables[tableKey]?.flatMap((table) => table.classItem) || [];
// //         setTableData(selectedTableClassItems); // 선택된 시간표의 classItem 데이터만 설정
// //     };

// //     // ListView의 Add 버튼 클릭 시 선택된 시간표에 과목 추가
// //     const handleAddLectureToTable = (lecture: LectureItem) => {
// //         if (!selectedTable) {
// //             alert("시간표를 먼저 선택하세요.");
// //             return;
// //         }

// //         addLectureToTimeTable(selectedTable, lecture); // 로컬 스토리지에 과목 추가
// //         const updatedTables = getAllTimeTables(); // 업데이트된 데이터 가져오기
// //         setTimeTables(updatedTables);
// //         const updatedClassItems = updatedTables[selectedTable]?.flatMap((table) => table.classItem) || [];
// //         setTableData(updatedClassItems); // 추가된 과목 포함하여 업데이트
// //     };

// //     return (
// //         <>
// //             <Header />
// //             <PageInfo title="시간표 만들기" description="시간표를 만들 수 있어요." />
// //             <div className="flex">
// //                 {/* 좌측 시간표 리스트 */}
// //                 <div className="w-1/4 p-4 border-r border-gray-300">
// //                     <h3 className="text-lg font-semibold mb-4">시간표 리스트</h3>
// //                     <ul>
// //                         {Object.keys(timeTables).map((tableKey) => (
// //                             <li
// //                                 key={tableKey}
// //                                 className={`p-2 mb-2 cursor-pointer ${
// //                                     selectedTable === tableKey ? "bg-blue-500 text-white" : "bg-gray-100"
// //                                 }`}
// //                                 onClick={() => handleSelectTable(tableKey)}
// //                             >
// //                                 {tableKey}
// //                             </li>
// //                         ))}
// //                     </ul>
// //                     <button
// //                         className="mt-4 w-full p-2 bg-green-500 text-white rounded hover:bg-green-600"
// //                         onClick={handleCreateNewTable}
// //                     >
// //                         새 시간표 만들기
// //                     </button>
// //                 </div>

// //                 {/* 우측 시간표 View */}
// //                 <div className="w-3/4 p-4">
// //                     <TableView timeTableData={tableData} />
// //                     <div className="mt-8">
// //                         <h3 className="text-lg font-semibold mb-4">장바구니</h3>
// //                         <ListView
// //                             columns={[
// //                                 { key: "sub_num", label: "과목 번호" },
// //                                 { key: "name", label: "과목 이름" },
// //                                 { key: "professor", label: "교수" },
// //                             ]}
// //                             items={cartItems}
// //                             actionType="add"
// //                             onActionButtonClick={handleAddLectureToTable} // Add 버튼 클릭 이벤트
// //                         />
// //                     </div>
// //                 </div>
// //             </div>
// //         </>
// //     );
// // };

// // export default Wizard;
