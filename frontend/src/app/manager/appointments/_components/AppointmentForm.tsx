"use client";
import { Form } from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { CustomInput } from "@/components/CustomInput";
import { Captions, User } from "lucide-react";
import { appointmentSchema } from "@/types";
import { z } from "zod";
import { SubmitButton } from "@/components/SubmitButton";
// import { useRouter } from "next/navigation";
// import { toast } from "sonner";
import { DatePickerForm } from "./DatePicker";
// import { useEffect, useState } from "react";


export const AppointmentForm = ({ cabinetId }: { cabinetId: string }) => {
  // const router = useRouter();
  // const [lastTicket, setLastTicket] = useState(0);

  const form = useForm<z.infer<typeof appointmentSchema>>({
    resolver: zodResolver(appointmentSchema),
    defaultValues: {
      cabinet_id: cabinetId,
      patient_name: "",
      patient_phone: "",
      patient_CNIE: "",
      appointment_reason: "",
      Date: undefined,
    },
  });

  form.watch("Date");
  // const date = form.getValues("Date")

  // useEffect(() => {
  //   const fetchLastTicketNumber = async () => {
  //     const dateValue = form.getValues("Date");

  //     try {
  //       const res = await getLastTicketNumber({
  //         cabinetId: cabinetId, // Ensure you have the correct cabinet ID
  //         date: dateValue,
  //       });

  //       if (res.appointment) {
  //         setLastTicket(res.appointment.order);
  //       } else {
  //         setLastTicket(0);
  //       }
  //     } catch (error) {
  //       console.error("Error fetching last ticket number:", error);
  //       setLastTicket(0);
  //     }
  //   };

  //   fetchLastTicketNumber();
  // }, [date,cabinetId,form]);


  const onSumbit = async (data: z.infer<typeof appointmentSchema>) => {
    // const res = await createAppointmentAdmin(data);
    // if (res?.data?.success) {
    //   toast.success(res.data.success);
    //   router.push(`/cabinets/${data.cabinet_id}/appointments`);
    // } else if (res?.validationErrors || res?.bindArgsValidationErrors) {
    //   toast.error("all fields required");
    // } else {
    //   return toast.error("Somthing went wrong");
    // }
    console.log(data);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSumbit)}>
        <div className="flex flex-col mt-10 gap-y-5">
          {/* <h1>
            Last Ticket number :{" "}
            <span className="text-yellow-500">{lastTicket}</span>
          </h1> */}
          <div className="flex fle-col lg:flex-row gap-5 justify-between">
            <div className="w-full">
              <CustomInput
                loading={form.formState.isSubmitting}
                type="text"
                placeholder="John doe"
                name="patient_name"
                label="Patient name"
                control={form.control}
                Icon={User}
              />
            </div>
            <div className="w-full">
              <CustomInput
                loading={form.formState.isSubmitting}
                type="tel"
                placeholder="(+212) 06 1233 4562"
                name="patient_phone"
                label="Phone number"
                control={form.control}
              />
            </div>
          </div>
          <div className="flex fle-col items-start lg:flex-row gap-5 justify-between">
            <div className="w-full">
              <CustomInput
                loading={form.formState.isSubmitting}
                type="text"
                placeholder="J123456"
                name="patient_CNIE"
                label="Patient CNIE"
                control={form.control}
                Icon={Captions}
              />
            </div>
            <div className="w-full">
              <DatePickerForm cabinetId={cabinetId} control={form.control} name="Date" />
            </div>
          </div>
          <CustomInput
            control={form.control}
            loading={form.formState.isSubmitting}
            type="textarea"
            name="appointment_reason"
            placeholder="ex: Annual montly check-up"
            label="Reason for appointment"
          />
        </div>
        <SubmitButton
          loading={form.formState.isSubmitting}
          className="mt-4 w-full"
        >
          Create
        </SubmitButton>
      </form>
    </Form>
  );
};
