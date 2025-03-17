"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

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

const items = [
  {
    id: 1,
    label: "Monday",
  },
  {
    id: 2,
    label: "Tuesday",
  },
  {
    id: 3,
    label: "Wednesday",
  },
  {
    id: 4,
    label: "Thursday",
  },
  {
    id: 5,
    label: "Friday",
  },
  {
    id: 6,
    label: "Saturday",
  },
  {
    id: 0,
    label: "Sunday",
  },
] as const;

const FormSchema = z.object({
  days: z.array(z.number()),
  datesOff: z.array(z.date()),
});

const Page = () => {
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      days: items.map((item) => item.id),
      datesOff: [new Date()],
    },
  });

  const { isDirty } = form.formState;

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    console.log(data);
  }

  return (
    <div className="lg:ml-64 min-h-screen p-5 md:p-10">
      <Header
        title="Manage Your Cabinet"
        description="Update your Cabinet  settings"
      />
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <FormField
            control={form.control}
            name="days"
            render={() => (
              <FormItem>
                <div className="mb-4">
                  <FormLabel className="text-base">Days off</FormLabel>
                  <FormDescription>
                    Select the days that the cabinet will be closed.
                  </FormDescription>
                </div>
                {items.map((item) => (
                  <FormField
                    key={item.id}
                    control={form.control}
                    name="days"
                    render={({ field }) => {
                      return (
                        <FormItem
                          key={item.id}
                          className="flex flex-row items-start space-x-3 space-y-0"
                        >
                          <FormControl>
                            <Checkbox
                              checked={field.value?.includes(item.id)}
                              onCheckedChange={(checked) => {
                                return checked
                                  ? field.onChange([...field.value, item.id])
                                  : field.onChange(
                                      field.value?.filter(
                                        (value) => value !== item.id
                                      )
                                    );
                              }}
                            />
                          </FormControl>
                          <FormLabel className="font-normal">
                            {item.label}
                          </FormLabel>
                        </FormItem>
                      );
                    }}
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
                        variant={"outline"}
                        className={cn(
                          "max-w-[240px] w-full pl-3 text-left font-normal",
                          !field.value && "text-muted-foreground"
                        )}
                      >
                        Pick dates
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
                  {field.value.map((e, idx) => (
                    <li
                      className="max-w-[240px] w-full flex justify-between"
                      key={idx}
                    >
                      - {format(e, "yyyy/MMMM/dd")}
                      <Trash2
                        onClick={() => {
                          const newDates = field.value.filter(
                            (date) => date !== e
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
            disabled={!isDirty}
            variant="brand"
            className="max-w-lg w-full"
          >
            Submit
          </SubmitButton>
        </form>
      </Form>
    </div>
  );
};

export default Page;
