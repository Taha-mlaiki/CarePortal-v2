
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { LogOut } from "lucide-react";
import { Separator } from "@/components/ui/separator";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export const UserMenu = () => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Avatar className="cursor-pointer">
          <AvatarImage src={undefined} />
          <AvatarFallback className="uppercase font-bold">
            TA
          </AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        side="bottom"
        sideOffset={20}
        className="absolute w-fit -right-6 p-2"
      >
        <div className="flex items-start gap-x-2 mb-2">
          <Avatar>
            <AvatarImage src={undefined} />
            <AvatarFallback className="uppercase font-bold">
              TA
            </AvatarFallback>
          </Avatar>
          <div className="text-sm text-neutral-600">
            <h1>Taha Mlaiki</h1>
            <p>mlaikitaha29@gmail.com</p>
          </div>
        </div>
        <Separator />
        <form
          className="w-full mt-2"
        >
          <button className="w-full justify-between  ">
            <DropdownMenuItem className="flex justify-between" >
                <span className="text-red-500">Log out</span>
                <LogOut className="w-4 h-4 text-red-500" />
            </DropdownMenuItem>
          </button>
        </form>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
