"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { format } from "date-fns";
import { CalendarIcon, Check, ChevronsUpDown } from "lucide-react";

import { Button } from "@/components/ui/button";
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
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import axios from "@/lib/axios";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { SubmitButton } from "@/components/SubmitButton";

const formSchema = z.object({
  patient: z.string({ required_error: "Patient is required" }),
  appointment_date: z.string({
    required_error: "Appointment date is required",
  }),
  issueDate: z.date({ required_error: "Issue date is required" }),
  expiryDate: z.date({ required_error: "Expiry date is required" }),
  diagnosis: z.string().min(2, { message: "Diagnosis is required" }),
  recommendations: z
    .string()
    .min(2, { message: "Recommendations are required" }),
});

type FormValues = z.infer<typeof formSchema>;

const fetchPatients = async () => {
  const res = await axios.get("/manager/cabinet/patients");
  return res.data.patients;
};

interface patientType {
  id: string;
  email: string;
}

export function CreateCertificateForm({
  setActiveTab,
}: {
  setActiveTab: Dispatch<SetStateAction<string>>;
}) {
  const [patientId, setPatientId] = useState<string | null>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [appointments, setAppointments] = useState<any | null>(null);
  const [appointmentLoading, setAppointmentLoading] = useState(false);
  const [loading, setLoading] = useState(false);
  const queryClient = useQueryClient();
  const { data: patients, isLoading } = useQuery({
    queryFn: fetchPatients,
    queryKey: ["cabinet_patients"],
  });

  useEffect(() => {
    if (patientId) {
      const fetchAppointments = async () => {
        setAppointmentLoading(true);
        try {
          const res = await axios.post(
            "/manager/cabinet/patients/appointments",
            {
              patient_id: patientId,
            }
          );
          setAppointments(res.data.appointments);
          console.log("appointments", res.data.appointments);
        } catch (error) {
          console.log(error);
        } finally {
          setAppointmentLoading(false);
        }
      };
      fetchAppointments();
    }
  }, [patientId]);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      diagnosis: "",
      recommendations: "",
    },
  });

  const handleSubmit = async (values: FormValues) => {
    setLoading(true);
    const appointment = appointments.filter(
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (ele: any) => ele.appointment_date === values.appointment_date
    );
    try {
      const res = await axios.post("/manager/cabinet/certificates", {
        appointment_id: appointment[0].id,
        issue_date: format(values.issueDate, "yyyy-MM-dd"),
        expiration_date: format(values.expiryDate, "yyyy-MM-dd"),
        diagnosis: values.diagnosis,
        recommendations: values.recommendations,
      });
      if (res.status === 200) {
        toast.success(res.data.success);
        form.reset();
        queryClient.invalidateQueries({ queryKey: ["cabinet_certaficates"] });
        setActiveTab("list");
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardContent className="pt-6">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="space-y-6"
          >
            {isLoading ? (
              <Skeleton className="w-full h-10 rounded-md" />
            ) : (
              <FormField
                control={form.control}
                name="patient"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Patients</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant="outline"
                            role="combobox"
                            className={cn(
                              "justify-start",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                            {field.value ? field.value : "Select Patient"}
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="p-0">
                        <Command>
                          <CommandInput placeholder="Search Patient by email..." />
                          <CommandList>
                            <CommandEmpty>No Patient found.</CommandEmpty>
                            <CommandGroup>
                              {patients?.map((patient: patientType) => (
                                <CommandItem
                                  value={patient.email}
                                  key={patient.id}
                                  onSelect={() => {
                                    form.setValue("patient", patient.email);
                                    setPatientId(patient.id);
                                  }}
                                >
                                  <Check
                                    className={cn(
                                      "mr-2 h-4 w-4",
                                      patient.id === field.value
                                        ? "opacity-100"
                                        : "opacity-0"
                                    )}
                                  />
                                  {patient.email}
                                </CommandItem>
                              ))}
                            </CommandGroup>
                          </CommandList>
                        </Command>
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}
            {appointmentLoading ? (
              <Skeleton className="w-full h-10 rounded-md" />
            ) : (
              appointments && (
                <FormField
                  control={form.control}
                  name="appointment_date"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>Appointment Date</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant="outline"
                              role="combobox"
                              className={cn(
                                "justify-start",
                                !field.value && "text-muted-foreground"
                              )}
                            >
                              <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                              {field.value
                                ? format(new Date(field.value), "yyyy-MM-dd")
                                : "Select Appointment date"}
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="p-0">
                          <Command>
                            <CommandInput placeholder="Search Patient by email..." />
                            <CommandList>
                              <CommandEmpty>
                                No Appointment found .
                              </CommandEmpty>
                              <CommandGroup>
                                {appointments?.map(
                                  (app: {
                                    id: string;
                                    appointment_date: string;
                                  }) => (
                                    <CommandItem
                                      value={app.appointment_date}
                                      key={app.id}
                                      onSelect={() => {
                                        form.setValue(
                                          "appointment_date",
                                          app.appointment_date
                                        );
                                      }}
                                    >
                                      <Check
                                        className={cn(
                                          "mr-2 h-4 w-4",
                                          app.appointment_date === field.value
                                            ? "opacity-100"
                                            : "opacity-0"
                                        )}
                                      />
                                      {app.appointment_date}
                                    </CommandItem>
                                  )
                                )}
                              </CommandGroup>
                            </CommandList>
                          </Command>
                        </PopoverContent>
                      </Popover>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )
            )}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="issueDate"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Issue Date</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={"outline"}
                            className={`w-full pl-3 text-left font-normal ${
                              !field.value && "text-muted-foreground"
                            }`}
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
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
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
                name="expiryDate"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Expiry Date</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={"outline"}
                            className={`w-full pl-3 text-left font-normal ${
                              !field.value && "text-muted-foreground"
                            }`}
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
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="space-y-6">
              <FormField
                control={form.control}
                name="diagnosis"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Diagnosis</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Enter medical diagnosis"
                        className="min-h-[100px]"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="recommendations"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Recommendations</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Enter medical recommendations"
                        className="min-h-[100px]"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="flex justify-end space-x-4">
              <Button type="button" variant="outline">
                Cancel
              </Button>
              <SubmitButton loading={loading} disabled={loading} variant="brand">
                Create Certificate
              </SubmitButton>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
