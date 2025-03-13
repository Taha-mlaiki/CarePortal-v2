"use client";
import { getAppointmentById } from "@/actions/appointment/getAppointmentById";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { usePatientDetails } from "@/hooks/use-patient-details";
import { Appointment } from "@prisma/client";
import { Check, Hourglass, X } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { format } from "date-fns";
import { Skeleton } from "@/components/ui/skeleton";
export const PatientDetails = () => {
  const [data, setData] = useState<Appointment | undefined>();
  const usePatient = usePatientDetails((state) => state);
  useEffect(() => {
    (async () => {
      if (usePatient.id) {
        const res = await getAppointmentById(usePatient.id);
        if (res.appointment) {
          setData(res.appointment);
        } else if (res.error) {
          toast.error(res.error);
          window.document.location.reload()
          usePatient.setClose();
        }
      } else {
        setData(undefined);
      }
    })();
  }, [usePatient]);

  const RenderStatus = ({ status }: { status: any }) => {
    switch (status) {
      case "Pending":
        return (
          <div className="flex w-fit px-2 py-0.5 text-sm me-2 items-center text-blue-500 bg-blue-500/40 gap-x-0.5 rounded-xl">
            <Hourglass className="w-4 h-4" />
            Pending
          </div>
        );
      case "Scheduled":
        return (
          <div className="flex w-fit px-2 py-0.5 text-sm me-2 items-center text-green-600 bg-green-600/40 gap-x-0.5 rounded-xl">
            <Check className="w-4 h-4 " />
            Scheduled
          </div>
        );
      case "Cancelled":
        return (
          <div className="flex w-fit px-2 py-0.5 text-sm me-2 items-center text-red-600 bg-red-600/40 gap-x-0.5 rounded-xl">
            <X className="w-4 h-4 " />
            Cancelled
          </div>
        );
    }
  };

  return (
    <Dialog open={usePatient.isOpen} onOpenChange={usePatient.setClose}>
      <DialogContent className="max-w-xl">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between pr-3">
            Patient information
            <RenderStatus status={data?.status} />
          </DialogTitle>
        </DialogHeader>
        {data ? (
          <div>
            <h1 className="font-bold">
              Name:
              <span className="text-neutral-500 ms-2">
                {data?.patient_name}
              </span>
            </h1>
            <h2 className="font-bold">
              CNIE:
              <span className="text-neutral-500 ms-2">
                {data?.patient_CNIE}
              </span>
            </h2>
            <h3 className="font-bold">
              Phone:
              <span className="text-neutral-500 ms-2">
                {data?.patient_phone}
              </span>
            </h3>
            <h3 className="font-bold">
              Appointment Date:
              <span className="text-neutral-500 ms-2">
                {format(data.Date, "MMM,dd,yyyy")}
              </span>
            </h3>
            <h3 className="font-bold">
              Ticket number:
              <span className="text-neutral-500 ms-2">{data.order === 0 ? "No ticket": data.order}</span>
            </h3>
            <div className="my-5">
              <p className="font-bold">Appointment Reason:</p>
              <div className="rounded-md mt-1 p-3 bg-gray-200">
                {data?.appointment_reason}
              </div>
            </div>
          </div>
        ) : (
          <div className="">
            <div className="flex flex-col gap-y-2">
              <Skeleton className="h-3 w-20 bg-neutral-300" />
              <Skeleton className="h-3 w-20 bg-neutral-300" />
              <Skeleton className="h-3 w-20 bg-neutral-300" />
              <Skeleton className="h-3 w-20 bg-neutral-300" />
              <Skeleton className="h-3 w-20 bg-neutral-300" />
            </div>
            <div className="mt-3">
              <Skeleton className="w-32 mb-2 h-4 bg-neutral-300" />
              <Skeleton className="w-full h-32 bg-neutral-300" />
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};
