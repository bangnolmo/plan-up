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
import IconButton from "../buttons/IconButton";

// import { getCookie, setCookie, updateCookie } from "@/app/_cookieManager/cookieManager";

interface ListViewProps {
  columns: { key: string; label: string }[];
  items: any[];
  actionType?: "none" | "delete" | "add";
  onActionButtonClick?: (item: Record<string, string | number>) => void; // 추가된 prop
}

const ListView: React.FC<ListViewProps> = ({ columns, items, actionType = "none", onActionButtonClick }) => {
  
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
                        onPress={() => {
                          if (onActionButtonClick){
                            onActionButtonClick(item);
                          }
                        }}
                        icon={<DeleteIcon />}
                        color="danger"
                        ariaLabel="Delete"
                        hovermsg="장바구니에서 삭제"
                        size='sm'
                      />
                    )}
                    {actionType === "add" && (
                      <IconButton
                        aria-label="Add item"
                        onPress={() => {
                          if (onActionButtonClick){
                            onActionButtonClick(item);
                          }
                        }}
                        icon={<AddIcon />}
                        color="primary"
                        ariaLabel="Add"
                        hovermsg="장바구니 추가"
                        size="sm"
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
