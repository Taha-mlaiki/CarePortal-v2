"use client";

import React, { useEffect, useState } from "react";
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
import { CalendarIcon, CheckCircle, Loader } from "lucide-react";
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
  bookingDate: z.date({
    required_error: "Please select a booking date",
  }).refine((val) => val >= new Date(new Date().setHours(0, 0, 0, 0)), {
    message: "Booking date must be today or in the future",
  }),
  reason: z
    .string()
    .max(150, { message: "Reason must be at most 150 characters" })
    .min(20, { message: "Reason must be at least 20 characters" }),
});

type UnavailableDates = {
  closed_days: Date[];
  day_of_week: number[];
  is_today_closed: Date | null;
};

const BookModal = ({
  cabinetName,
  id,
}: {
  cabinetName: string;
  id: number;
}) => {
  const [bookingSuccess, setBookingSuccess] = useState(false);
  const [open, setOpen] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [loading, setLoading] = useState(false);
  const [unavailableDates, setUnavailableDates] = useState<UnavailableDates>({
    closed_days: [],
    day_of_week: [],
    is_today_closed: null,
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      bookingDate: null as any, // Type hack for initial null (Zod will enforce date on submit)
      reason: "",
    },
  });

  useEffect(() => {
    const fetchClosedDates = async () => {
      try {
        setLoading(true);
        const res = await axios.get(`/cabinets/${id}/dates`);
        const { closed_days, day_of_week, is_today_closed } =
          res.data.unavailable_dates;
        setUnavailableDates({
          closed_days: closed_days
            ? closed_days.map((d: string) => new Date(d))
            : [],
          day_of_week: day_of_week || [],
          is_today_closed: is_today_closed ? new Date(is_today_closed) : null,
        });
      } catch (error) {
        console.error("Failed to fetch unavailable dates:", error);
        toast.error("Could not load unavailable dates");
      } finally {
        setLoading(false);
      }
    };
    fetchClosedDates();
  }, [id, open]);

  const { isSubmitting } = form.formState;

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    try {
      const res = await axios.post("/appointments", {
        cabinet_id: id,
        appointment_date: data.bookingDate.toISOString(), // Safe: bookingDate is guaranteed Date
        reason: data.reason,
      });
      if (res.status === 201) {
        form.reset();
        setBookingSuccess(true);
        setTimeout(() => {
          setOpenDialog(false);
          setBookingSuccess(false);
        }, 3000);
      }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      toast.error(error.response?.data?.error || "Failed to book appointment");
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
              Your appointment has been sent to the cabinet manager. You will
              receive an email confirmation or cancellation from the manager.
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
                            variant="outline"
                            className={cn(
                              "pl-3 w-full text-left font-normal",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            {field.value
                              ? format(field.value, "PPP")
                              : "Pick a date"}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent
                        className="w-auto p-0 z-[1000]"
                        align="start"
                      >
                        {loading ? (
                          <div className="flex max-w-md items-center justify-center h-[100px] w-full">
                            <Loader className="mx-auto animate-spin w-10 h-10" />
                          </div>
                        ) : (
                          <Calendar
                            mode="single"
                            selected={field.value}
                            onSelect={(date) => {
                              setOpen(false);
                              field.onChange(date);
                            }}
                            disabled={(date) =>
                              date <
                                new Date(new Date().setHours(0, 0, 0, 0)) ||
                              unavailableDates.day_of_week.includes(
                                date.getDay()
                              ) ||
                              (unavailableDates.is_today_closed &&
                                unavailableDates.is_today_closed.toDateString() ===
                                  date.toDateString()) ||
                              unavailableDates.closed_days.some(
                                (offDate) =>
                                  offDate.toDateString() === date.toDateString()
                              )
                            }
                            initialFocus
                          />
                        )}
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