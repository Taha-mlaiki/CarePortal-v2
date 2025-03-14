import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import Link from "next/link";
import React from "react";
import { DataTable } from "../_components/data-table";
import { columns } from "./_components/columns";
import { cn } from "@/lib/utils";
import Header from "../_components/Header";
import { DayOffCheckbox } from "./_components/DayOffCheckbox";
// import { DayOffCheckbox } from "./_components/DayOffCheckbox";

const page = async () => {
  const data = [
    {
      patient_name: "John Doe",
      patient_phone: "+1-555-123-4567",
      date: new Date("2025-03-15T10:30:00"),
      status: "Scheduled",
      ticket: 1,
    },
    {
      patient_name: "Jane Smith",
      patient_phone: "+1-555-987-6543",
      date: new Date("2025-03-16T14:00:00"),
      status: "Pending",
      ticket: 2,
    },
    {
      patient_name: "Alice Johnson",
      patient_phone: "+1-555-456-7890",
      date: new Date("2025-03-14T09:15:00"),
      status: "Cancelled",
      ticket: 0, // No ticket
    },
    {
      patient_name: "Bob Brown",
      patient_phone: "+1-555-321-6547",
      date: new Date("2025-03-17T16:45:00"),
      status: "Scheduled",
      ticket: 3,
    },
    {
      patient_name: "Emma Davis",
      patient_phone: "+1-555-654-3210",
      date: new Date("2025-03-18T11:00:00"),
      status: "Pending",
      ticket: 4,
    },
  ];

  return (
    <div
      className={cn(
        "transition-all duration-200 ease-in-out",
        "lg:ml-64 min-h-screen p-5 md:p-10"
      )}
    >
      <Header
        title="Manage Appointments"
        description="Manage your appointments with ease."
      />
      <div className="mt-10 mb-16">
        <div className="flex items-center justify-between">
          <DayOffCheckbox />
        <Link href={`/cabinets/appointments/new`}>
          <Button size="sm" variant="brand" className="gap-x-1">
            <Plus className="font-bold w-6 h-6" />
            New appointment
          </Button>
        </Link>
        </div>
        <DataTable columns={columns} data={data} />
      </div>
    </div>
  );
};

export default page;
