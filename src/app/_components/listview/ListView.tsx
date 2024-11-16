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

interface ListViewProps {
  columns: { key: string; label: string }[];
  items: any[];
}

const ListView: React.FC<ListViewProps> = ({ columns, items }) => {
  return (
    <div className="overflow-x-auto">
      <Table aria-label="Dynamic Table" selectionMode="none">
        <TableHeader columns={columns}>
          {(column) => (
            <TableColumn key={column.key}>{column.label}</TableColumn>
          )}
        </TableHeader>
        <TableBody items={items}>
          {(item) => (
            <TableRow key={item.id}>
              {columns.map((column) => (
                <TableCell key={column.key}>
                  {item[column.key as keyof typeof item]}
                </TableCell>
              ))}
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default ListView;
