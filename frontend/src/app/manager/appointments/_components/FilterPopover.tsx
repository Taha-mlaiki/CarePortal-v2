import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

import {
  Menubar,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarRadioGroup,
  MenubarRadioItem,
  MenubarSeparator,
  MenubarSub,
  MenubarSubContent,
  MenubarSubTrigger,
  MenubarTrigger,
} from "@/components/ui/menubar";
import { Appointment, AppointmentStatus } from "@prisma/client";
import { Filter } from "lucide-react";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

type filterProps = {
  allData: Appointment[];
  appointments: Appointment[];
  setAppointments: Dispatch<SetStateAction<any>>;
};

export const FilterPopover = ({
  appointments,
  setAppointments,
  allData,
}: filterProps) => {
  const searchParams = useSearchParams();
  const router = useRouter();

  useEffect(() => {
    const date = searchParams.get("date")
    const status = searchParams.get("status")
    const appointmentId = searchParams.get("appId")
    let filteredAppointment = [...allData]

    if(appointmentId){
      filteredAppointment = filteredAppointment.filter((app)=> app.id === appointmentId)
    }
    if(date){
      const filterDate = new Date(date);
      filteredAppointment = filteredAppointment.filter((appointment) => {
        const appointmentDate = new Date(appointment.Date);
        return (
          appointmentDate.getFullYear() === filterDate.getFullYear() &&
          appointmentDate.getMonth() === filterDate.getMonth() &&
          appointmentDate.getDate() === filterDate.getDate()
        );
      });
    }

    if(status && status !== "All"){
      filteredAppointment = filteredAppointment.filter((app)=> app.status === status)
    }

    setAppointments(filteredAppointment)
  }, [searchParams, allData,setAppointments]);

  // Update search parameters and apply filters
  const updateSearchParams = (date?: Date, status?: AppointmentStatus | "All") => {
    const params = new URLSearchParams(searchParams);
    if (date) {
      params.set("date", date.toISOString());
    }

    if (status) {
      params.set("status", status);
    }

    router.push(`?${params.toString()}`);
  };




  
  return (
    <Menubar>
      <MenubarMenu>
        <MenubarTrigger className="cursor-pointer">
          Filter <Filter className="ml-2 h-4 w-4" />
        </MenubarTrigger>
        <MenubarContent>
          <MenubarSub>
            <MenubarSubTrigger>Filter by Date</MenubarSubTrigger>
            <MenubarSubContent className="right-20 ">
              <Calendar
                selected={
                  searchParams.get("date")
                    ? new Date(searchParams.get("date")!)
                    : undefined
                }
                mode="single"
                onSelect={(e) => updateSearchParams(e)}
              />
            </MenubarSubContent>
          </MenubarSub>
          <MenubarSeparator />
          <MenubarSub>
            <MenubarSubTrigger>Filter by Status</MenubarSubTrigger>
            <MenubarSubContent>
              <div className="p-2">
                <RadioGroup
                  value={searchParams.get("status") ?? undefined}
                  onValueChange={(e) =>
                    updateSearchParams(undefined, e as AppointmentStatus | "All")
                  }
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="All" id="All" />
                    <Label htmlFor="All">All</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="Scheduled" id="Scheduled" />
                    <Label htmlFor="Scheduled">
                      <p className="text-green-500">Scheduled</p>
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="Pending" id="Pending" />
                    <Label htmlFor="Pending">
                      <p className="text-blue-500">Pending</p>
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="Cancelled" id="Cancelled" />
                    <Label htmlFor="Cancelled">
                      <p className="text-red-500">Cancelled</p>
                    </Label>
                  </div>
                </RadioGroup>
              </div>
            </MenubarSubContent>
          </MenubarSub>
          <MenubarSeparator />
        </MenubarContent>
      </MenubarMenu>
    </Menubar>
  );
};
