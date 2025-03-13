"use client";
import { Button } from "@/components/ui/button";
import { ColumnDef } from "@tanstack/react-table";
import { ArchiveX, Calendar, Check, Hourglass, Phone, Trash2, X } from "lucide-react";
import { ArrowUpDown, MoreHorizontal } from "lucide-react";
import { format } from "date-fns";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { usePatientDetails } from "@/hooks/use-patient-details";
import { useCancelAppoint } from "@/hooks/use-cancel-appoint";
import { archiveAppointment } from "@/actions/appointment/archiveApp";
import { toast } from "sonner";
import { scheduleApp } from "@/actions/appointment/schedule";
import { onComplete } from "@/actions/appointment/completeApp";
export const columns: ColumnDef<Appointment>[] = [
  {
    accessorKey: "patient_name",
    header: ({ column }) => {
      return (
        <div className="flex justify-center">
          <Button
            variant="ghost"
            className="mx-auto"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Name
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        </div>
      );
    },
    cell: ({ row }) => {
      const data = row.original;
      return (
        <div className="flex justify-center">
          <h1>{data.patient_name}</h1>
        </div>
      );
    },
  },
  {
    accessorKey: "patient_phone",
    header: ({ column }) => {
      return (
        <div className="flex items-center justify-center ">
          <Phone className="mr-2 h-4 w-4" />
          Phone
        </div>
      );
    },
    cell: ({ row }) => {
      const data = row.original;
      return (
        <div className="flex justify-center">
          <h1>{data.patient_phone}</h1>
        </div>
      );
    },
  },
  {
    accessorKey: "Date",
    header: () => (
      <div className="flex items-center justify-center">
        <Calendar className="mr-2 w-4 h-4" />
         Date
      </div>
    ),
    cell: ({ row }) => {
      const data = row.original;
      return (
        <div className="flex items-center justify-center gap-x-3">
          {format(data.Date, "MMMM/dd/yyyy")}
        </div>
      );
    },
  },
  {
    accessorKey: "status",
    header: ({ column }) => <div className="text-center">Status</div>,
    cell: ({ row }) => {
      const data = row.original;
      switch (data.status) {
        case "Pending":
          return (
            <div className="flex w-fit px-2 py-0.5 mx-auto items-center text-blue-500 bg-blue-500/40 gap-x-0.5 rounded-xl">
              <Hourglass className="w-4 h-4" />
              Pending
            </div>
          );
        case "Scheduled":
          return (
            <div className="flex w-fit px-2 py-0.5 mx-auto items-center text-green-600 bg-green-600/40 gap-x-0.5 rounded-xl">
              <Check className="w-4 h-4 " />
              Scheduled
            </div>
          );
        case "Cancelled":
          return (
            <div className="flex w-fit px-2 py-0.5 mx-auto items-center text-red-600 bg-red-600/40 gap-x-0.5 rounded-xl">
              <X className="w-4 h-4 " />
              Cancelled
            </div>
          );
      }
    },
  },
  {
    accessorKey: "ticket",
    header: ({ column }) => <div className="text-center">Ticket order</div>,
    cell: ({ row }) => {
      const data = row.original;
      if(data.order === 0 ){
        return (
          <p className="text-neutral-600 text-center">No ticket</p> 
        )
      }else {
        return <div className="font-bold text-xl text-center">
            {data.order}
        </div>
      }
    }
  },
  {
    header: "Actions",
    cell: ({ row }) => {

      const RenderCell = ()=>{
        const data = row.original;
        const usePatient = usePatientDetails((state) => state);
        const useCancelApp = useCancelAppoint((state)=> state)
  
        const onArchived = async ()=>{
          const res = await archiveAppointment(data.id)
           if(res.success){
            toast.success(res.success)
           }else if(res.error){
            window.document.location.reload()
            toast.error(res.error)
           }
        }
  
        const onSchedule = async ()=>{
            const res = await scheduleApp(data.id)
            if(res.success){
              toast.success(res.success)
            } else if(res.error){
              toast.error(res.error)
            }
        }
  
        const complete = async ()=>{
          const res = await onComplete(data.id)
          if(res.success){
            toast.success(res.success)
          }else if(res.error){
            toast.error(res.error)
          }
        }

        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel className="text-center">
                Actions
              </DropdownMenuLabel>
              <DropdownMenuItem onClick={() => usePatient.setOpen(data.id)}>
                View details
              </DropdownMenuItem>
              {data.status === "Scheduled" && (
                <DropdownMenuItem onClick={() => complete()}>
                 <span className="text-green-600">Completed</span>
               </DropdownMenuItem>
              )}
              {data.status === "Pending"  && (
                <DropdownMenuItem onClick={()=> onSchedule()}>
                    <p className="text-green-500">Schedule</p>
                </DropdownMenuItem>
              )}
              {data.status === "Cancelled" ? 
                    (
                    <DropdownMenuItem onClick={()=> onArchived()}>
                          <div className="text-red-500 w-full flex items-center justify-between">
                            <p>Archived</p>
                            <ArchiveX className="w-4 h-4" />
                          </div>
                      </DropdownMenuItem>
                    )
                    :
                    (
                      <DropdownMenuItem onClick={()=> useCancelApp.setOpen(data.id)}>
                          <p className="text-red-500">Cancel</p>
                      </DropdownMenuItem>
                    )
              }
            </DropdownMenuContent>
          </DropdownMenu>
        );

      }

      return <RenderCell />
      
    },
  },
];
