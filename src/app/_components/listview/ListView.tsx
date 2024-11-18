/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

// ListView.tsx
import {
  Table,
  TableHeader,
  TableBody,
  TableColumn,
  TableRow,
  TableCell,
} from "@nextui-org/react";
import { DeleteIcon } from "../Icon/DeleteIcon";
import { AddIcon } from "../Icon/AddIcon";
import IconButton from "../IconButton/IconButton";
import { getCookie, setCookie, updateCookie } from "@/app/_cookieManager/cookieManager";

interface ListViewProps {
  columns: { key: string; label: string }[];
  items: any[];
  actionType?: "none" | "delete" | "add";
}

const ListView: React.FC<ListViewProps> = ({ columns, items, actionType = "none" }) => {
  
  const handleButtonClick = (item: Record<string, string | number>) => {
  // 기존 쿠키에 저장된 데이터를 가져옴
  const existingData = getCookie('clickedItemData');
  let parsedData: Record<string, string | number>[] = [];

  if (!existingData) {
    // 쿠키가 없는 경우 새로 생성
    parsedData.push(item);
    setCookie('clickedItemData', parsedData, 7);
    console.log("쿠키가 생성되었습니다:", parsedData);
  } else if (Array.isArray(existingData)) {
    // 쿠키 데이터가 배열 형식이면 parsedData로 할당
    parsedData = existingData.filter((el): el is Record<string, string | number> => {
      return typeof el === 'object' && el !== null && !Array.isArray(el) &&
        Object.values(el).every(value => typeof value === 'string' || typeof value === 'number');
    });

    // 동일한 데이터가 있는지 확인
    const isItemExist = parsedData.some((data) => {
      return typeof data === 'object' && data.id === item.id;
    });

    if (!isItemExist) {
      // 데이터가 없으면 새로 추가
      parsedData.push(item);
      updateCookie('clickedItemData', parsedData, 7);
      console.log("쿠키가 업데이트되었습니다:", parsedData);
    } else {
      console.log("데이터가 이미 쿠키에 존재합니다:", item);
    }
  } else {
    console.error("쿠키 데이터가 예상하지 못한 형식입니다. 기본 빈 배열로 설정합니다.");
  }
};



  // "액션" 열을 조건부로 추가
  const dynamicColumns = actionType !== "none"
    ? [...columns, { key: "action", label: "Action" }]
    : columns;

  return (
    <div className="overflow-x-auto">
      <Table aria-label="Dynamic Table" selectionMode="none">
        <TableHeader columns={dynamicColumns}>
          {(column) => (
            <TableColumn key={column.key}>{column.label}</TableColumn>
          )}
        </TableHeader>
        <TableBody items={items}>
          {(item) => (
            <TableRow key={item.id}>
              {dynamicColumns.map((column) => (
                column.key === "action" ? (
                  <TableCell key={column.key}>
                    {actionType === "delete" && (
                      <IconButton
                        aria-label="Delete item"
                        onPress={() => console.log(item.id)}
                        icon={<DeleteIcon />}
                        color="danger"
                        ariaLabel="Delete"
                      />
                    )}
                    {actionType === "add" && (
                      <IconButton
                        aria-label="Add item"
                        onPress={() => handleButtonClick(item)}
                        icon={<AddIcon />}
                        color="primary"
                        ariaLabel="Add"
                      />
                    )}
                  </TableCell>
                ) : (
                  <TableCell key={column.key}>
                    {item[column.key as keyof typeof item]}
                  </TableCell>
                )
              ))}
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default ListView;
