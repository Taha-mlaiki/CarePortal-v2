// "use client";
// import { CustomInput } from "@/components/CustomInput";
// import { SubmitButton } from "@/components/SubmitButton";
// import {
//   Dialog,
//   DialogContent,
//   DialogHeader,
//   DialogTitle,
// } from "@/components/ui/dialog";
// import {
//   Form,
// } from "@/components/ui/form";
// // import { Input } from "@/components/ui/input";
// // import { Textarea } from "@/components/ui/textarea";
// // import { useCancelAppoint } from "@/hooks/use-cancel-appoint";
// import { zodResolver } from "@hookform/resolvers/zod";
// // import { useRouter } from "next/navigation";
// import { useForm } from "react-hook-form";
// // import { toast } from "sonner";
// import { z } from "zod";

// const cancelSchema = z.object({
//   reason: z.string().min(2, "Reason is required"),
// });

// export const CancelAppointment = () => {
//   // const useCancelApp = useCancelAppoint((state) => state);
//   // const router = useRouter();
//   const form = useForm<z.infer<typeof cancelSchema>>({
//     resolver: zodResolver(cancelSchema),
//     defaultValues: {
//       reason: "",
//     },
//   });

//   const onSubmit = async (data: z.infer<typeof cancelSchema>) => {
//     // if (useCancelApp.id) {
//     //   const res = await cancelAppointment(useCancelApp.id);
//     //   if (res.success) {
//     //     toast.warning(res.success);
//     //     useCancelApp.setClose();
//     //   } else if (res.error) {
//     //     toast.error(res.error);
//     //     window.document.location.reload();
//     //   }
//     // }
//     console.log(data)
//   };

//   return (
//     <Dialog open={useCancelApp.isOpen} onOpenChange={useCancelApp.setClose}>
//       <DialogContent>
//         <DialogHeader>
//           <DialogTitle>Cancel Appointment</DialogTitle>
//         </DialogHeader>
//         <h3 className="text-neutral-600 mb-5">
//           Are you sure you want to cancel this appointment
//         </h3>
//         <Form {...form}>
//           <form onSubmit={form.handleSubmit(onSubmit)}>
//             <CustomInput
//               control={form.control}
//               label="Reason for cancellation"
//               name="reason"
//               type="textarea"
//               placeholder="ex:Urgent meeting came up"
//             />
//             <SubmitButton
//               className="w-full mt-2"
//               size="sm"
//               variant="destructive"
//             >
//               Cancel Appointment
//             </SubmitButton>
//           </form>
//         </Form>
//       </DialogContent>
//     </Dialog>
//   );
// };
