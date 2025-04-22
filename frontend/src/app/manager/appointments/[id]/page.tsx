"use client";

import { AppointmentType } from "@/app/patient/dashboard/page";
import axios from "@/lib/axios";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { FileText, MailCheck, PhoneCall, Ticket, User } from "lucide-react";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useQueryClient } from "@tanstack/react-query";
import { cn } from "@/lib/utils";

const Page = () => {
  const params = useParams();
  const [appointment, setAppointment] = useState<AppointmentType>();
  const router = useRouter();
  const id = params.id;
  useEffect(() => {
    const fetchAppointment = async () => {
      if (id) {
        try {
          const res = await axios.get(`/cabinets/appointments/${id}`);
          if (res.data.appointment) {
            setAppointment(res.data.appointment);
          }
        } catch (error) {
          //@ts-expect-error something went wrong
          toast.error(error.response.data.error);
          router.push("/manager/appointments");
        }
      }
    };
    fetchAppointment();
  }, [id, router]);

  const [loading, setLoading] = useState(false);
  const queryClient = useQueryClient();

  if (appointment) {
    const onCancel = async () => {
      try {
        setLoading(true);
        if (appointment) {
          const res = await axios.post(
            `/cabinets/appointments/${appointment.id}/cancel`
          );
          if (res.status === 200) {
            toast.success("Appointment canceled successfully!");
            queryClient.invalidateQueries({
              queryKey: ["cabinet_appointments"],
            });
            router.push("/manager/appointments");
          }
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
    const onArchived = async () => {
      try {
        setLoading(true);
        const res = await axios.post(
          `/cabinets/appointments/${appointment.id}/archive`
        );
        if (res.status === 200) {
          toast.success(res.data.success);
          queryClient.invalidateQueries({ queryKey: ["cabinet_appointments"] });
          router.push("/manager/appointments");
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

    const onSchedule = async () => {
      try {
        setLoading(true);
        const res = await axios.post(
          `/cabinets/appointments/${appointment.id}/schedule`
        );
        if (res.status === 200) {
          toast.success(res.data.success);
          queryClient.invalidateQueries({ queryKey: ["cabinet_appointments"] });
          router.push("/manager/appointments");
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

    const complete = async () => {
      try {
        setLoading(true);
        const res = await axios.post(
          `/cabinets/appointments/${appointment.id}/complete`
        );
        if (res.status === 200) {
          toast.success(res.data.success);
          queryClient.invalidateQueries({ queryKey: ["cabinet_appointments"] });
          router.push("/manager/appointments");
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
      <div
        className={cn(
          "transition-all duration-200 ease-in-out min-h-screen flex items-center justify-center",
          "lg:ml-64 min-h-screen p-5 md:px-10"
        )}
      >
        <div className="bg-white max-w-3xl  shadow-lg w-full p-5 mx-auto rounded-xl">
          <div>
            <div className="text-xl pe-4 justify-between font-semibold text-gray-900 flex items-center gap-2">
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
            </div>
          </div>
          <div>
            <div className="space-y-5 mt-4 ">
              {/* Cabinet Name */}
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

              {/* Cabinet Location */}
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
              <div className="flex items-center justify-end gap-5">
                {appointment.status === "Pending" && (
                  <>
                    <Button
                      disabled={loading}
                      onClick={() => onCancel()}
                      variant="destructive"
                    >
                      {loading ? "Canceling..." : "Cancel appointment"}
                    </Button>
                    <Button
                      disabled={loading}
                      onClick={() => onSchedule()}
                      className="bg-green-600 text-white hover:bg-green-600/90"
                    >
                      {loading ? "Scheduling..." : "Schedule appointment"}
                    </Button>
                  </>
                )}
                {appointment.status === "Scheduled" && (
                  <Button
                    disabled={loading}
                    onClick={() => complete()}
                    className="bg-green-600 text-white hover:bg-green-600/90"
                  >
                    Complete appointment
                  </Button>
                )}
                {(appointment.status === "Canceled" ||
                  appointment.status === "Completed") && (
                  <Button
                    disabled={loading}
                    onClick={() => onArchived()}
                    className="bg-violet-600 text-white hover:bg-violet-600/90"
                  >
                    Archive appointment
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  } else {
    <div>NO appointment found</div>;
  }
};

export default Page;
