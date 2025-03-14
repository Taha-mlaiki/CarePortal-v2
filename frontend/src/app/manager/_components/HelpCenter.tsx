import {
  PopoverTrigger,
  Popover,
  PopoverContent,
} from "@/components/ui/popover";
import { Separator } from "@/components/ui/separator";
import { HelpCircle } from "lucide-react";

export const HelpCenter = () => {
  return (
    <Popover>
      <PopoverTrigger>
        <div className="flex items-center gap-x-2 text-neutral-500">
          <HelpCircle className="w-5 h-5" />
          <h1>Help center</h1>
        </div>
      </PopoverTrigger>
      <PopoverContent
        side="bottom"
        sideOffset={20}
        className="absolute -right-6"
      >
        <h1 className="font-bold">Need Assistance? We&apos;re Here to Help!</h1>
        <Separator className="my-2" />
        <h2 className="font-semibold text-neutral-700">Contact Us :</h2>
        <div className="text-sm text-neutral-500 mt-2 flex flex-col gap-y-2">
            <p>Email:<span className="ms-2">mlaikitaha29@gmail.com</span></p>
            <p>Phone:<span className="ms-2">(+212) 0719475033</span></p>
        </div>
      </PopoverContent>
    </Popover>
  );
};
