"use client"

import {
  ColumnDef,
  flexRender,
  SortingState,
  getCoreRowModel,
  ColumnFiltersState,
  getPaginationRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table"

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ArrowLeft, ArrowRight, X } from "lucide-react"
import { useState } from "react"
import { FilterPopover } from "../appointments/_components/FilterPopover"
import { useRouter } from "next/navigation"

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[]
  data: TData[]
}

type Appointment = {
  patient_name: string;
  patient_phone: string;
  date: Date; // Note: In your columns, you used "Date" (capital D), but it should match "date" here
  status: string;
  ticket: number; // Note: In your columns, you used "order" in the cell, but it should be "ticket"
};

export function DataTable<TData, TValue>({
  columns,
  data,
}: DataTableProps<TData, TValue>) {
  const router = useRouter()
  const [sorting, setSorting] = useState<SortingState>([])
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>(
    []
  )

  const [filteredData,setFilteredData] = useState(data)


  const table = useReactTable({
    data:filteredData,
    columns,
    getPaginationRowModel: getPaginationRowModel(),
    getCoreRowModel: getCoreRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    state: {
      sorting,
      columnFilters,
    },
  })

   // Clear all filters
   const clearFilter = () => {
    router.push(window.location.pathname); // Navigate to the base URL to clear all search params
  };
  return (
    <div>
      <div className="flex items-center  gap-x-3 justify-between py-4">
        <Input
          placeholder={`Search by patient name...`}
          value={(table.getColumn("patient_name")?.getFilterValue() as string) ?? ""}
          onChange={(event) =>
            table.getColumn("patient_name")?.setFilterValue(event.target.value)
          }
          className="max-w-sm"
        />
        <div className="flex gap-x-2 item-center">
          <Button 
          onClick={()=> clearFilter()}
          size="icon" variant="destructive">
              <X />
          </Button>
          <FilterPopover allData={data as Appointment[]} appointments={filteredData as Appointment[]} setAppointments={setFilteredData} />
        </div>
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  )
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex justify-between mt-2 px-3">
            <Button 
            variant="outline" 
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
            >
              <ArrowLeft className="text-brand"/>
            </Button>
            <Button variant="outline" size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
            >
            <ArrowRight className="text-brand" />
            </Button>
      </div>
    </div>
    
  )
}
