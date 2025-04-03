"use client";
import {
  Dialog,
  DialogHeader,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import React, { ReactNode, useState } from "react";
import { AppointmentType } from "../page";
import { format } from "date-fns/format";
import { Calendar, MapPin, FileText, Loader } from "lucide-react"; // Icons for visual flair
import { Badge } from "@/components/ui/badge"; // For status or highlights
import { Button } from "@/components/ui/button";
import axios from "@/lib/axios";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

const AppointmentDetails = ({
  children,
  appointment,
}: {
  children: ReactNode;
  appointment: AppointmentType;
}) => {
  const [loading, setLoading] = useState(false);
  const queryClient = useQueryClient();
  const onCancel = async () => {
    try {
      console.log("clicked");
      setLoading(true);
      const res = await axios.put(`/appointments/${appointment.id}/cancel`);
      if (res.status === 200) {
        toast.success("Appointment canceled successfully!");
        queryClient.invalidateQueries({ queryKey: ["patient_appointments"] });
      }
      console.log(res);
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
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent>
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
                    appointment.status === "Confirmed"
                      ? "bg-green-100 text-green-800"
                      : appointment.status === "Pending"
                      ? "bg-yellow-100 text-yellow-800"
                      : "bg-red-100 text-red-800"
                  }`}
                >
                  {appointment.status}
                </Badge>
              </div>
            )}
          </DialogTitle>
        </DialogHeader>
        <div className="mt-4 space-y-6">
          {/* Card-like Section */}
          <div>
            <div className="space-y-4">
              {/* Cabinet Name */}
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                  <MapPin className="w-4 h-4 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">
                    Cabinet Name
                  </p>
                  <p className="text-lg font-semibold text-gray-900">
                    {appointment.cabinet.name}
                  </p>
                </div>
              </div>

              {/* Cabinet Location */}
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                  <MapPin className="w-4 h-4 text-green-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Location</p>
                  <p className="text-gray-900 font-semibold">
                    {appointment.cabinet.address}
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
                    {loading && (
                      <Loader className="w-4 h-4 mr-2 animate-spin" />
                    )}
                    {loading ? "Canceling..." : "Cancel appointment"}
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AppointmentDetails;
