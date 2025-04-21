"use client";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { FileText, Loader, MailCheck, PhoneCall, Ticket, User } from "lucide-react";
import { format } from "date-fns";
import { Appointment } from "../../_components/data-table";
import { ReactNode, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useQueryClient } from "@tanstack/react-query";
import axios from "@/lib/axios";
import { toast } from "sonner";

export const PatientDetails = ({
  appointment,
  children,
}: {
  appointment: Appointment;
  children: ReactNode;
}) => {
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const queryClient = useQueryClient();
  const onCancel = async () => {
    try {
      setLoading(true);
      const res = await axios.post(
        `/cabinets/appointments/${appointment.id}/cancel`
      );
      if (res.status === 200) {
        toast.success("Appointment canceled successfully!");
        queryClient.invalidateQueries({ queryKey: ["cabinet_appointments"] });
        setOpen(false);
      }
      //@ts-expect-error something went wrong
    } catch (error: AxiosError) {
      console.log(error);
      toast.error(error.response.data.error);
      console.error("Error deleting appointment:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-xl pe-4 justify-between font-semibold text-gray-900 flex items-center gap-2">
            <div className="flex items-center gap-2">
              <Calendar className="w-6 h-6 text-blue-600" />
              Appointment Details
            </div>
            {appointment.status && (
              <div className="flex justify-end">
                <Badge
                  variant="outline"
                  className={`${
                    appointment.status === "Scheduled"
                      ? "bg-green-100 text-green-800"
                      : appointment.status === "Pending"
                      ? "bg-yellow-100 text-yellow-800"
                      : appointment.status === "Completed"
                      ? "bg-violet-100 text-violet-700"
                      : "bg-red-100 text-red-800"
                  }`}
                >
                  {appointment.status}
                </Badge>
              </div>
            )}
          </DialogTitle>
        </DialogHeader>
        <div>
          <div className="space-y-5 mt-4 ">
            {/* patient username */}
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                <User className="w-4 h-4 text-blue-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Username</p>
                <p className="text-lg font-semibold text-gray-900">
                  {appointment.patient.username}
                </p>
              </div>
            </div>
            {/* patient email */}
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                <MailCheck className="w-4 h-4 text-green-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Email</p>
                <p className="text-lg font-semibold text-gray-900">
                  {appointment.patient.email}
                </p>
              </div>
            </div>

            {/* patient phone */}
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                <PhoneCall className="w-4 h-4 text-green-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Phone</p>
                <p className="text-gray-900 font-semibold">
                  {appointment.patient.phone}
                </p>
              </div>
            </div>

            {/* Appointment Date */}
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center">
                <Calendar className="w-4 h-4 text-yellow-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Date</p>
                <p className="text-gray-900 font-semibold">
                  {format(
                    new Date(appointment.appointment_date),
                    "dd MMMM yyyy"
                  )}
                </p>
              </div>
            </div>
            {/* Appointment Ticket */}
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center">
                <Ticket className="w-4 h-4 text-yellow-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">
                  Ticket number
                </p>
                <p className="text-gray-900 font-semibold">
                  {appointment.ticket == null
                    ? "No ticket"
                    : appointment.ticket}
                </p>
              </div>
            </div>

            {/* Appointment Reason */}
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                <FileText className="w-4 h-4 text-purple-600" />
              </div>
              <div className="w-full">
                <p className="text-sm font-medium text-gray-500">Reason</p>
                <p className="p-3 mt-1 bg-neutral-100 font-medium text-gray-900 rounded-md">
                  {appointment.reason}
                </p>
              </div>
            </div>
            {appointment.status === "Pending" && (
              <div className="flex items-center justify-end">
                <Button
                  disabled={loading}
                  onClick={() => onCancel()}
                  variant="destructive"
                >
                  {loading && <Loader className="w-4 h-4 mr-2 animate-spin" />}
                  {loading ? "Canceling..." : "Cancel appointment"}
                </Button>
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
