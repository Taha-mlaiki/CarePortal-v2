import { Button } from "@/components/ui/button";
import { CalendarCheck, Plus } from "lucide-react";
import Link from "next/link";
import React from "react";
import { DataTable } from "../_components/data-table";
import { columns } from "./_components/columns";
import { DayOffCheckbox } from "./_components/DayOffCheckbox";

const page = async ({ params }: { params: { cabinetId: string } }) => {
  

 



  return (
    <div className="px-5 my-5">
      <div className="flex justify-between items-center">
        <h1 className="font-bold text-lg lg:text-xl flex items-center gap-x-2">
          <CalendarCheck className="w-6 h-6 lg:w-8 lg:h-8 font-bold" />
          Appointements
        </h1>
        <Link href={`/cabinets/${params.cabinetId}/appointments/new`}>
          <Button size="sm" variant="brand" className="gap-x-1">
            <Plus className="font-bold w-6 h-6" />
            New appointment
          </Button>
        </Link>
      </div>
      <div className="my-20">
        <DayOffCheckbox
          todayOff={cabinet?.todayOff!}
          cabinetId={params.cabinetId}
        />
        <DataTable columns={columns} data={appointments} />
      </div>
    </div>
  );
};

export default page;
