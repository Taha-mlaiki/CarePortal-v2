"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { SubmitButton } from "@/components/SubmitButton";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { format } from "date-fns";
import { CalendarIcon, Trash2 } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import Header from "../_components/Header";
import axios from "@/lib/axios";
import { toast } from "sonner";

const items = [
  { id: 1, label: "Monday" },
  { id: 2, label: "Tuesday" },
  { id: 3, label: "Wednesday" },
  { id: 4, label: "Thursday" },
  { id: 5, label: "Friday" },
  { id: 6, label: "Saturday" },
  { id: 0, label: "Sunday" },
] as const;

const FormSchema = z.object({
  days: z.array(z.number()).default([]), // Default to empty array
  datesOff: z.array(z.date()).default([]), // Default to empty array
});

const getClosing = async () => {
  const res = await axios.get("/manager/cabinet/dates");
  return {
    days: res.data.cabinet.day_of_week
      ? JSON.parse(res.data.cabinet.day_of_week)
      : [],
    datesOff: res.data.cabinet.closed_days
      ? JSON.parse(res.data.cabinet.closed_days).map(
          (date: string) => new Date(date)
        )
      : [],
  };
};

const Page = () => {
  const clientQuery = useQueryClient();
  const [loading, setLoading] = useState(false);
  const { data, isLoading } = useQuery({
    queryFn: getClosing,
    queryKey: ["dates_info"],
  });

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      days: [],
      datesOff: [],
    },
  });

  useEffect(() => {
    if (data) {
      form.reset({
        days: data.days || [],
        datesOff: data.datesOff || [],
      });
    }
  }, [data, form]);

  const { isDirty } = form.formState;

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    setLoading(true);
    try {
      const res = await axios.post("/manager/cabinet/dates", {
        day_of_week: JSON.stringify(data.days),
        closed_days: JSON.stringify(
          data.datesOff.map((date) => date.toISOString().split("T")[0])
        ),
      });
      if (res.status == 200) {
        toast.success("Dates updated successfully");
        clientQuery.invalidateQueries({ queryKey: ["dates_info"] });
      }
    } catch (error) {
      //@ts-expect-error I don't know what is going on
      console.log(error.response);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="lg:ml-64 min-h-screen p-5 md:p-10">
      <Header
        title="Manage Your Cabinet"
        description="Update your Cabinet settings"
      />
      {isLoading ? (
        <div className="space-y-4">
          <div className="h-4 bg-gray-200 rounded w-3/4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          <div className="h-4 bg-gray-200 rounded w-2/3"></div>
        </div>
      ) : (
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="days"
              render={() => (
                <FormItem>
                  <div className="mb-4">
                    <FormLabel className="text-base">Days Off</FormLabel>
                    <FormDescription>
                      Select the days that the cabinet will be closed.
                    </FormDescription>
                  </div>
                  {items.map((item) => (
                    <FormField
                      key={item.id}
                      control={form.control}
                      name="days"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                          <FormControl>
                            <Checkbox
                              checked={field.value.includes(item.id)}
                              onCheckedChange={(checked) => {
                                const newValue = checked
                                  ? [...field.value, item.id]
                                  : field.value.filter(
                                      (value) => value !== item.id
                                    );
                                field.onChange(newValue);
                              }}
                            />
                          </FormControl>
                          <FormLabel className="font-normal">
                            {item.label}
                          </FormLabel>
                        </FormItem>
                      )}
                    />
                  ))}
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="datesOff"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Dates Off</FormLabel>
                  <FormDescription>
                    Select the specific dates this year when the cabinet will be
                    closed.
                  </FormDescription>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant="outline"
                          className={cn(
                            "max-w-[240px] w-full pl-3 text-left font-normal",
                            !field.value.length && "text-muted-foreground"
                          )}
                        >
                          {field.value.length > 0
                            ? `${field.value.length} dates selected`
                            : "Pick dates"}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="multiple"
                        selected={field.value}
                        onSelect={field.onChange}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                  <ul className="flex ml-2 flex-col mt-5 gap-y-2 text-sm text-neutral-600">
                    {field.value.map((date, idx) => (
                      <li
                        className="max-w-[240px] w-full flex justify-between"
                        key={idx}
                      >
                        - {format(date, "yyyy/MMMM/dd")}
                        <Trash2
                          onClick={() => {
                            const newDates = field.value.filter(
                              (_, i) => i !== idx
                            );
                            field.onChange(newDates);
                          }}
                          className="text-red-600 w-4 h-4 me-3"
                          role="button"
                        />
                      </li>
                    ))}
                  </ul>
                </FormItem>
              )}
            />
            <SubmitButton
              loading={loading}
              disabled={!isDirty || loading}
              variant="brand"
              className="max-w-lg w-full"
            >
              Submit
            </SubmitButton>
          </form>
        </Form>
      )}
    </div>
  );
};

export default Page;
