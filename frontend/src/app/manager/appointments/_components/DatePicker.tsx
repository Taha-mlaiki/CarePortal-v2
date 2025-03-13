"use client";

import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Control } from "react-hook-form";
import { useEffect, useState } from "react";
import { getDatesOff } from "@/actions/cabinets/getDatesOff";
import { toast } from "sonner";
type datesOffProps = {
  dayWeekOff: number[];
  todayOff: Date | null;
  datesOff:Date[]
};
export function DatePickerForm({
  control,
  name,
  cabinetId,
}: {
  control: Control<any>;
  name: string;
  cabinetId?: string;
}) {
  const [datesOff, setDatesOff] = useState<datesOffProps>();
  const [open,setOpen] = useState(false)
  useEffect(() => {
    if (cabinetId) {
      (async () => {
        const res = await getDatesOff(cabinetId);
        if (res.cabinet) {
          setDatesOff(res.cabinet);
        } else {
          toast.error(res.error);
        }
      })();
    }
  }, [open,cabinetId]);


  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem className="flex mt-2 flex-col">
          <FormLabel>Appointments Date</FormLabel>
          <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild className="mt-4">
              <FormControl>
                <Button
                  variant={"outline"}
                  className={cn(
                    " pl-3  text-left font-normal",
                    !field.value && "text-neutral-400"
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
            <PopoverContent className="w-full p-0" align="start">
              <Calendar
                mode="single"
                selected={field.value}
                onSelect={field.onChange}
                // the admin can select the days that he will be off on it
                disabled={(date) => {
                  const today = new Date();
                  const yesterday = new Date(today);
                  yesterday.setDate(today.getDate() - 1);
                  return (
                    datesOff?.dayWeekOff.includes(date.getDay()) ||
                    datesOff?.todayOff?.getDate() === date.getDate() ||
                    datesOff?.datesOff.some(offDate => 
                      offDate.getDate() === date.getDate() &&
                      offDate.getMonth() === date.getMonth() &&
                      offDate.getFullYear() === date.getFullYear()
                    ) ||
                    date < yesterday
                  );
                }}
                initialFocus
              />
            </PopoverContent>
          </Popover>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
