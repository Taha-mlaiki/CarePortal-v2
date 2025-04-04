import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ArchiveX, MoreHorizontal } from "lucide-react";
import React from "react";
import { Appointment } from "../../_components/data-table";
import { PatientDetails } from "./PatientDetails";
import axios from "@/lib/axios";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";

const AppointmentActions = ({ appointment }: { appointment: Appointment }) => {
  const queryClient = useQueryClient();
  const onArchived = async () => {
    try {
      const res = await axios.post(
        `/cabinets/appointments/${appointment.id}/archive`
      );
      if (res.status === 200) {
        toast.success(res.data.success);
        queryClient.invalidateQueries({ queryKey: ["cabinet_appointments"] });
      }
      //@ts-expect-error something went wrong
    } catch (error: AxiosError) {
      console.log(error);
      toast.error(error.response.data.error);
      console.error("Error deleting appointment:", error);
    }
  };

  const onSchedule = async () => {
    try {
      const res = await axios.post(
        `/cabinets/appointments/${appointment.id}/schedule`
      );
      if (res.status === 200) {
        toast.success(res.data.success);
        queryClient.invalidateQueries({ queryKey: ["cabinet_appointments"] });
      }
      //@ts-expect-error something went wrong
    } catch (error: AxiosError) {
      console.log(error);
      toast.error(error.response.data.error);
      console.error("Error deleting appointment:", error);
    }
  };

  const complete = async () => {
    try {
      const res = await axios.post(
        `/cabinets/appointments/${appointment.id}/complete`
      );
      if (res.status === 200) {
        toast.success(res.data.success);
        queryClient.invalidateQueries({ queryKey: ["cabinet_appointments"] });
      }
      //@ts-expect-error something went wrong
    } catch (error: AxiosError) {
      console.log(error);
      toast.error(error.response.data.error);
      console.error("Error deleting appointment:", error);
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-8 w-8 p-0">
          <span className="sr-only">Open menu</span>
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel className="text-center">Actions</DropdownMenuLabel>
        <PatientDetails appointment={appointment}>
          <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
            View Details
          </DropdownMenuItem>
        </PatientDetails>
        {appointment.status === "Scheduled" && (
          <DropdownMenuItem onClick={complete}>
            <span className="text-violet-700 font-semibold">Completed</span>
          </DropdownMenuItem>
        )}
        {appointment.status === "Pending" && (
          <DropdownMenuItem onClick={onSchedule}>
            <p className="text-green-500 font-semibold">Schedule</p>
          </DropdownMenuItem>
        )}
        {appointment.status === "Canceled" ||
        appointment.status === "Completed" ? (
          <DropdownMenuItem onClick={onArchived}>
            <div className="text-red-500 w-full flex items-center font-semibold justify-between">
              <p>Archive</p>
              <ArchiveX className="w-3 h-3" />
            </div>
          </DropdownMenuItem>
        ) : (
          ""
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default AppointmentActions;
