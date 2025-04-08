import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { Dispatch, SetStateAction } from "react";
import { Badge } from "@/components/ui/badge";
import {
  Calendar,
  Check,
  FolderCheck,
  Hourglass,
  Phone,
  User,
  X,
} from "lucide-react";
import { FilterPopover } from "../appointments/_components/FilterPopover";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { ParamsType } from "../appointments/page";
import AppointmentActions from "../appointments/_components/AppointmentActions";
import { format } from "date-fns/format";

export type Appointment = {
  id: number;
  patient: {
    username: string;
    email: string;
    phone: string;
  };
  appointment_date: string;
  status: string;
  ticket: number | null;
  reason: string; // Added missing property
  created_at: Date;
};

type TableProps = {
  data: Appointment[];
  isLoading: boolean;
  params: ParamsType;
  setParams: Dispatch<SetStateAction<ParamsType>>;
};

const status = (data: Appointment) => {
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
        <Badge variant="outline" className="bg-red-100 gap-x-1 text-red-800">
          <X className="w-3 h-3 " />
          Canceled
        </Badge>
      );
    case "Completed":
      return (
        <Badge
          variant="outline"
          className="bg-violet-100 gap-x-1 text-violet-700"
        >
          <FolderCheck className="w-3 h-3 " />
          Completed
        </Badge>
      );
  }
};

export const DataTable = ({
  data,
  isLoading,
  params,
  setParams,
}: TableProps) => {
  return (
    <div>
      <div className="flex items-center  gap-x-3 justify-between py-4">
        <Input
          placeholder={`Search by patient name...`}
          value={params.searchTerm}
          onChange={(e) =>
            setParams((prev: ParamsType) => ({
              ...prev,
              searchTerm: e.target.value,
            }))
          }
          className="max-w-sm"
        />
        <div className="flex gap-x-2 item-center">
          <Button
            onClick={() =>
              setParams({ status: "", date: null, searchTerm: "" })
            }
            size="icon"
            variant="destructive"
          >
            <X />
          </Button>
          <FilterPopover params={params} setParams={setParams} />
        </div>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>
              <div className="flex items-center justify-start ">
                <User className="mr-2 h-4 w-4" />
                Username
              </div>
            </TableHead>
            <TableHead>
              <div className="flex items-center justify-start ">
                <Phone className="mr-2 h-4 w-4" />
                Phone
              </div>
            </TableHead>
            <TableHead>
              <div className="flex items-center justify-start">
                <Calendar className="mr-2 w-4 h-4" />
                Appointment Date
              </div>
            </TableHead>
            <TableHead>
              <div className="flex items-center justify-start">
                <Calendar className="mr-2 w-4 h-4" />
                Created At
              </div>
            </TableHead>
            <TableHead>Status</TableHead>
            <TableHead>ticket</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {isLoading ? (
            Array.from({ length: 5 }).map((_, index) => (
              <TableRow key={index}>
                <TableCell>
                  <Skeleton className="h-6 w-24" />
                </TableCell>
                <TableCell>
                  <Skeleton className="h-6 w-32" />
                </TableCell>
                <TableCell>
                  <Skeleton className="h-6 w-32" />
                </TableCell>
                <TableCell className="text-right">
                  <Skeleton className="h-6 w-20" />
                </TableCell>
                <TableCell className="text-right">
                  <Skeleton className="h-6 w-16" />
                </TableCell>
                <TableCell className="text-right">
                  <Skeleton className="h-6 w-16" />
                </TableCell>
                <TableCell className="text-right">
                  <Skeleton className="h-6 w-16" />
                </TableCell>
              </TableRow>
            ))
          ) : data.length === 0 ? (
            <TableRow>
              <TableCell colSpan={7} className="text-center">
                No appointment booked yet
              </TableCell>
            </TableRow>
          ) : (
            data.map((appointment) => (
              <TableRow key={appointment.id}>
                <TableCell className="font-medium">
                  {appointment.patient.username}
                </TableCell>
                <TableCell>{appointment.patient.phone}</TableCell>
                <TableCell>
                  {format(
                    new Date(appointment.appointment_date),
                    " MMM d, yyyy"
                  )}
                </TableCell>
                <TableCell>
                  {format(
                    new Date(appointment.created_at),
                    " MMM d, yyyy | h:mm a"
                  )}
                </TableCell>
                <TableCell>{status(appointment)}</TableCell>
                <TableCell>{appointment.ticket || "No ticket"}</TableCell>
                <TableCell>
                  <AppointmentActions appointment={appointment} />
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
};
