"use client";

import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { CalendarIcon, CheckCircle } from "lucide-react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns/format";
import axios from "@/lib/axios";
import { toast } from "sonner";
import { SubmitButton } from "@/components/SubmitButton";

const formSchema = z.object({
  bookingDate: z.date().refine((val) => val.getDate() >= new Date().getDate(), {
    message: "Booking date must be in the future",
  }),
  reason: z
    .string()
    .max(150, {
      message: "Reason must be at most 150 characters",
    })
    .min(20, {
      message: "Reason must be at leat 20 characters",
    }),
});

const BookModal = ({
  cabinetName,
  id,
}: {
  cabinetName: string;
  id: string;
}) => {
  const [bookingSuccess, setBookingSuccess] = useState(false);
  const [open, setOpen] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  // Initialize the form with react-hook-form and zod
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      bookingDate: new Date(),
      reason: "",
    },
  });

  const { isSubmitting } = form.formState;
  // Handle form submission
  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    const res = await axios.post("/appointments", {
      cabinet_id: id,
      appointment_date: data.bookingDate,
      reason: data.reason,
    });
    if (res.status === 201) {
      form.reset();
      setBookingSuccess(true);
      setTimeout(() => {
        setOpenDialog(false);
        setBookingSuccess(false);
      }, 3000);
    } else {
      toast.error(res.data.error);
    }
  };

  return (
    <Dialog open={openDialog} onOpenChange={setOpenDialog}>
      <DialogTrigger asChild>
        <Button size="lg" className="bg-[#3b82f6] hover:bg-[#3b82f6]/90">
          Book Appointment
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px] overflow-visible">
        <DialogHeader>
          <DialogTitle>Book an Appointment</DialogTitle>
          <DialogDescription>
            Fill out the form below to schedule an appointment at {cabinetName}.
          </DialogDescription>
        </DialogHeader>

        {bookingSuccess ? (
          <div className="flex flex-col items-center justify-center py-6 text-center">
            <CheckCircle className="h-16 w-16 text-green-500" />
            <h3 className="mt-4 text-xl font-semibold text-gray-900">
              Booking Successful!
            </h3>
            <p className="mt-2 text-gray-600">
              Your appointment has been Sent to cabinet manager. You will recive
              an email confirmation or cancelation from the manager
            </p>
          </div>
        ) : (
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="grid gap-4 py-4"
            >
              <FormField
                control={form.control}
                name="bookingDate"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Appointment Date</FormLabel>
                    <Popover open={open} onOpenChange={setOpen}>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={"outline"}
                            className={cn(
                              "pl-3 w-full text-left font-normal",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            {field.value ? (
                              format(field.value, "PPP")
                            ) : (
                              <span>Pick a date</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent
                        className="w-auto p-0 z-[1000]"
                        align="start"
                      >
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={(date) => {
                            setOpen(false);
                            field.onChange(date);
                          }}
                          disabled={(date) => date < new Date()}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="reason"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Reason</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Please share any specific concerns or requirements"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <DialogFooter>
                <SubmitButton variant="brand" loading={isSubmitting}>
                  Confirm Booking
                </SubmitButton>
              </DialogFooter>
            </form>
          </Form>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default BookModal;
