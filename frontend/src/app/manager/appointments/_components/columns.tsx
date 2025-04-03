"use client";
import { Button } from "@/components/ui/button";
import { ColumnDef } from "@tanstack/react-table";
import {
  ArchiveX,
  Calendar,
  Check,
  Hourglass,
  MoreHorizontal,
  Phone,
  X,
} from "lucide-react";
import { ArrowUpDown } from "lucide-react";
import { format } from "date-fns/format";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
// import {
//   DropdownMenu,
//   DropdownMenuContent,
//   DropdownMenuItem,
//   DropdownMenuLabel,
//   DropdownMenuTrigger,
// } from "@/components/ui/dropdown-menu";
// import { usePatientDetails } from "@/hooks/use-patient-details";
// import { useCancelAppoint } from "@/hooks/use-cancel-appoint";
// import { toast } from "sonner";

type Appointment = {
  id: number;
  patient: {
    username: string;
    email: string;
    phone: string;
  };
  appointment_date: string;
  status: string;
  ticket: number | null;
};
export const columns: ColumnDef<Appointment>[] = [
  {
    accessorKey: "patient_name",
    accessorFn: (row) => row.patient.username,
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
      return (
        <div className="flex justify-center">
          <h1>{row.getValue("patient_name")}</h1>
        </div>
      );
    },
  },
  {
    accessorKey: "patient_phone",
    accessorFn: (row) => row.patient.phone,
    header: () => {
      return (
        <div className="flex items-center justify-center ">
          <Phone className="mr-2 h-4 w-4" />
          Phone
        </div>
      );
    },
    cell: ({ row }) => {
      return (
        <div className="flex justify-center">
          <h1>{row.getValue("patient_phone")}</h1>
        </div>
      );
    },
  },
  {
    accessorKey: "date",
    accessorFn: (row) => row.appointment_date,
    header: () => (
      <div className="flex items-center justify-center">
        <Calendar className="mr-2 w-3 h-3" />
        Date
      </div>
    ),
    cell: ({ row }) => {
      return (
        <div className="flex items-center justify-center gap-x-3">
          {format(row.getValue("date"), "MMMM/dd/yyyy")}
        </div>
      );
    },
  },
  {
    accessorKey: "status",
    header: () => <div className="text-center">Status</div>,
    cell: ({ row }) => {
      const data = row.original;
      const status = () => {
        switch (data.status) {
          case "Pending":
            return (
              <Badge
                variant="outline"
                className="bg-yellow-100 gap-x-1  text-yellow-800"
              >
                <Hourglass className="w-3 h-3" />
                Pending
              </Badge>
            );
          case "Scheduled":
            return (
              <Badge
                variant="outline"
                className="bg-green-100 gap-x-1 text-green-800"
              >
                <Check className="w-3 h-3 " />
                Scheduled
              </Badge>
            );
          case "Canceled":
            return (
              <Badge
                variant="outline"
                className="bg-red-100 gap-x-1 text-red-800"
              >
                <X className="w-3 h-3 " />
                Canceled
              </Badge>
            );
        }
      };
      return <div className="flex justify-center">{status()}</div>;
    },
  },
  {
    accessorKey: "ticket",
    header: () => <div className="text-center">Ticket order</div>,
    cell: ({ row }) => {
      const data = row.original;
      if (data.ticket === 0 || data.ticket === null) {
        return <p className="text-neutral-600 text-center">No ticket</p>;
      } else {
        return (
          <div className="font-bold text-xl text-center">{data.ticket}</div>
        );
      }
    },
  },
  {
    header: "Actions",
    cell: ({ row }) => {
      const RenderCell = () => {
        const data = row.original;

        const onArchived = async () => {
          console.log("isArchived", data.patient.username);
        };

        const onSchedule = async () => {
          console.log("isScheduled", data.patient.username);
        };

        const complete = async () => {
          console.log("isComplete", data.patient.username);
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
              <DropdownMenuLabel className="text-center">
                Actions
              </DropdownMenuLabel>
              <DropdownMenuItem
                onClick={() => console.log("View", data.patient.username)}
              >
                View details
              </DropdownMenuItem>
              {data.status === "Scheduled" && (
                <DropdownMenuItem onClick={complete}>
                  <span className="text-green-600">Completed</span>
                </DropdownMenuItem>
              )}
              {data.status === "Pending" && (
                <DropdownMenuItem onClick={onSchedule}>
                  <p className="text-green-500">Schedule</p>
                </DropdownMenuItem>
              )}
              {data.status === "Cancelled" ? (
                <DropdownMenuItem onClick={onArchived}>
                  <div className="text-red-500 w-full flex items-center justify-between">
                    <p>Archived</p>
                    <ArchiveX className="w-3 h-3" />
                  </div>
                </DropdownMenuItem>
              ) : (
                <DropdownMenuItem onClick={() => console.log("Cancel")}>
                  <p className="text-red-500">Cancel</p>
                </DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        );
      };
      return RenderCell();
    },
  },
];
