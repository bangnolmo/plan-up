/* eslint-disable @typescript-eslint/no-explicit-any */

"use client";
import React from "react";
import { Table, TableHeader, TableBody, TableColumn, TableRow, TableCell } from "@nextui-org/react";
// import { Lecture } from "@/utils/localStorageManager";

interface ListViewProps {
    columns: { key: string; label: string }[];
    items: any[];
    children?: (item: any) => React.ReactNode;
}

const ListView: React.FC<ListViewProps> = ({ columns, items, children }) => {
    const dynamicColumns = children ? [...columns, { key: "action", label: "Action" }] : columns;

    return (
        <div className="overflow-x-auto">
            <Table aria-label="Dynamic Table" selectionMode="none" shadow="none">
                <TableHeader columns={dynamicColumns}>{(column) => <TableColumn key={column.key}>{column.label}</TableColumn>}</TableHeader>
                <TableBody items={items}>
                    {(item) => (
                        <TableRow key={item.sub_num}>
                            {dynamicColumns.map((column) =>
                                column.key === "action" && children ? (
                                    <TableCell key={String(column.key)}>{children(item)}</TableCell>
                                ) : (
                                    <TableCell key={String(column.key)}>{item[column.key] as React.ReactNode}</TableCell>
                                )
                            )}
                        </TableRow>
                    )}
                </TableBody>
            </Table>
            {items.length === 0 && <div className="text-sm text-gray-500 text-center py-4">아직 아무것도 추가하지 않았어요.</div>}
        </div>
    );
};

export default ListView;
