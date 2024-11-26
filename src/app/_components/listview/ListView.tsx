/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { Table, TableHeader, TableBody, TableColumn, TableRow, TableCell } from "@nextui-org/react";
import { Delete, CopyPlus } from "lucide-react";
import IconButton from "../IconButton";
import { LectureItem } from "@/app/_configs/cartInfo";

interface ListViewProps {
    columns: { key: string; label: string }[];
    items: any[];
    actionType?: "none" | "delete" | "add";
    onActionButtonClick?: (item: LectureItem) => void;
}

const ListView: React.FC<ListViewProps> = ({ columns, items, actionType = "none", onActionButtonClick }) => {
    const dynamicColumns = actionType !== "none" ? [...columns, { key: "action", label: "Action" }] : columns;

    return (
        <div className="overflow-x-auto">
            <Table aria-label="Dynamic Table" selectionMode="none">
                <TableHeader columns={dynamicColumns}>{(column) => <TableColumn key={column.key}>{column.label}</TableColumn>}</TableHeader>
                <TableBody items={items}>
                    {(item) => (
                        <TableRow key={item.sub_num}>
                            {dynamicColumns.map((column) =>
                                column.key === "action" ? (
                                    <TableCell key={column.key}>
                                        {actionType === "delete" && (
                                            <IconButton
                                                aria-label="Delete item"
                                                onPress={() => {
                                                    if (onActionButtonClick) {
                                                        onActionButtonClick(item);
                                                    }
                                                }}
                                                icon={<Delete size="16" strokeWidth={2.75} />}
                                                color="danger"
                                                ariaLabel="Delete"
                                                hovermsg="장바구니에서 삭제"
                                                size="sm"
                                            />
                                        )}
                                        {actionType === "add" && (
                                            <IconButton
                                                aria-label="Add item"
                                                onPress={() => {
                                                    if (onActionButtonClick) {
                                                        onActionButtonClick(item);
                                                    }
                                                }}
                                                icon={<CopyPlus size="16" strokeWidth={2.75} />}
                                                color="primary"
                                                ariaLabel="Add"
                                                hovermsg="장바구니 추가"
                                                size="sm"
                                            />
                                        )}
                                    </TableCell>
                                ) : (
                                    <TableCell key={column.key}>{item[column.key as keyof typeof item]}</TableCell>
                                )
                            )}
                        </TableRow>
                    )}
                </TableBody>
            </Table>
        </div>
    );
};

export default ListView;
