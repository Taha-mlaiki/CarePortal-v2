"use client";

import { Checkbox } from "@/components/ui/checkbox";
import axios from "@/lib/axios";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

const getTodayClosed = async () => {
  const res = await axios.get("/cabinets/today-closed");
  return res.data.is_today_closed; // Returns a date string like "2025-04-03" or null
};

const toggleTodayClosed = async (shouldClose: boolean) => {
  const today = new Date().toISOString().split("T")[0]; // e.g., "2025-04-03"
  const res = await axios.post("/cabinets/today-closed", {
    is_today_closed: shouldClose ? today : null,
  });
  return res.data.is_today_closed;
};

export const DayOffCheckbox = () => {
  const queryClient = useQueryClient();

  // Fetch current "closed" status
  const { data, isLoading } = useQuery({
    queryFn: getTodayClosed,
    queryKey: ["today_closed"],
  });

  // Mutation to toggle the "closed" status
  const { mutate, isPending } = useMutation({
    mutationFn: toggleTodayClosed,
    onSuccess: (data, checked) => {
      queryClient.invalidateQueries({ queryKey: ["today_closed"] });
      if (checked) {
        toast.success("Appointments turn Off");
      } else {
        toast.success("Appointments turn On");
      }
    },
    onError: (err) => {
      console.error("Failed to toggle day off:", err);
    },
  });

  // Check if today is closed: compare data with today's date
  const today = new Date().toISOString().split("T")[0];
  const isChecked = data === today;

  const handleCheckboxChange = (checked: boolean) => {
    mutate(checked);
  };

  return (
    <div className="items-top flex space-x-2 my-10">
      <Checkbox
        id="day"
        checked={isChecked}
        onCheckedChange={handleCheckboxChange}
        disabled={isLoading || isPending}
      />
      <div className="grid gap-1.5 leading-none">
        <label
          htmlFor="day"
          className={`text-sm font-medium ${
            isChecked ? "text-neutral-200" : "text-red-500"
          } leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70`}
        >
          Turn off appointments today
        </label>
        <p
          className={`text-sm text-muted-foreground ${
            isChecked ? "text-neutral-200" : ""
          }`}
        >
          Stop patients from scheduling appointments for today
        </p>
      </div>
    </div>
  );
};
