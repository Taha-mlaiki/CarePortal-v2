"use client";

import { Checkbox } from "@/components/ui/checkbox";

export const DayOffCheckbox = () => {
  return (
    <div className="items-top flex space-x-2 my-10">
      <Checkbox id="day" />
      <div className="grid gap-1.5 leading-none">
        <label
          htmlFor="day"
          className="text-sm font-medium text-red-500 peer-checked:text-neutral-200 leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
        >
          Turn off appointments today
        </label>
        <p className="text-sm text-muted-foreground peer-checked:text-neutral-200">
          Stop patients from scheduling appointments for today
        </p>
      </div>
    </div>
  );
};
