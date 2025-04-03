import { Calendar } from "@/components/ui/calendar";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

import {
  Menubar,
  MenubarContent,
  MenubarMenu,
  MenubarSeparator,
  MenubarSub,
  MenubarSubContent,
  MenubarSubTrigger,
  MenubarTrigger,
} from "@/components/ui/menubar";
import { Filter } from "lucide-react";
import { Dispatch, SetStateAction } from "react";
import { format } from "date-fns/format";
import { ParamsType } from "../page";

type propsType = {
  params: ParamsType;
  setParams: Dispatch<SetStateAction<ParamsType>>;
};
export const FilterPopover = ({ params, setParams }: propsType) => {
  // Update search parameters and apply filters
  const updateSearchParams = (date?: Date, status?: string) => {
    if (date) {
      const formatedDate = format(new Date(date), "yyyy-MM-dd");
      setParams((prev: ParamsType) => ({ ...prev, date: formatedDate }));
    }

    if (status) {
      const newStatus = status === "All" ? "" : status;
      setParams((prev: ParamsType) => ({ ...prev, status: newStatus }));
    }
  };

  return (
    <Menubar>
      <MenubarMenu>
        <MenubarTrigger className="cursor-pointer">
          Filter <Filter className="ml-2 h-4 w-4" />
        </MenubarTrigger>
        <MenubarContent>
          <MenubarSub>
            <MenubarSubTrigger>Filter by Date</MenubarSubTrigger>
            <MenubarSubContent className="right-20 ">
              <Calendar
                selected={params.date ? new Date(params.date) : new Date()}
                mode="single"
                onSelect={(date) => updateSearchParams(date)}
              />
            </MenubarSubContent>
          </MenubarSub>
          <MenubarSeparator />
          <MenubarSub>
            <MenubarSubTrigger>Filter by Status</MenubarSubTrigger>
            <MenubarSubContent>
              <div className="p-2">
                <RadioGroup
                  value={params.status == "" ? "All" : params.status}
                  onValueChange={(e) => updateSearchParams(undefined, e)}
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="All" id="All" />
                    <Label htmlFor="All">All</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="Scheduled" id="Scheduled" />
                    <Label htmlFor="Scheduled">
                      <p className="text-green-500">Scheduled</p>
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="Pending" id="Pending" />
                    <Label htmlFor="Pending">
                      <p className="text-blue-500">Pending</p>
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="Canceled" id="Canceled" />
                    <Label htmlFor="Canceled">
                      <p className="text-red-500">Canceled</p>
                    </Label>
                  </div>
                </RadioGroup>
              </div>
            </MenubarSubContent>
          </MenubarSub>
          <MenubarSeparator />
        </MenubarContent>
      </MenubarMenu>
    </Menubar>
  );
};
