"use client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { HeartIcon, LayoutDashboard, LogOut, Store } from "lucide-react";
import { Separator } from "@/components/ui/separator";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import ProfileModal from "./Profile";
import Link from "next/link";
import axios from "@/lib/axios";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { FormEvent } from "react";

export const UserMenu = () => {
  const router = useRouter();
  const logout = async (e: FormEvent) => {
    e.preventDefault();
    const res = await axios.post("/logout");
    if (res.status === 200) {
      toast.success("logout successfully");
      router.push("/");
    } else {
      console.log(res.data.error || "Something went wrong in logout process");
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Avatar className="cursor-pointer">
          <AvatarImage src={undefined} />
          <AvatarFallback className="uppercase font-bold">TA</AvatarFallback>
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
            <AvatarFallback className="uppercase font-bold">TA</AvatarFallback>
          </Avatar>
          <div className="text-sm text-neutral-600 mb-3">
            <h1>Taha Mlaiki</h1>
            <p>mlaikitaha29@gmail.com</p>
          </div>
        </div>
        <DropdownMenuItem onSelect={(e) => e.preventDefault()} asChild>
          <ProfileModal />
        </DropdownMenuItem>
        <Separator className="my-0.5 h-[1.5px]" />
        <Link href="/patient/dashboard" className="flex items-center gap-x-2">
          <DropdownMenuItem className="w-full">
            <LayoutDashboard className="w-4 h-4" />
            Dashboard
          </DropdownMenuItem>
        </Link>
        <Separator className="my-0.5" />
        <Link
          href="/patient/cabinets/favorites"
          className="flex items-center gap-x-2"
        >
          <DropdownMenuItem className="w-full">
            <HeartIcon className="w-4 h-4" />
            Favorites
          </DropdownMenuItem>
        </Link>

        <Separator className="my-0.5" />
        <Link
          href="/patient/cabinets"
          className="flex items-center w-full gap-x-2"
        >
          <DropdownMenuItem className="w-full">
            <Store className="w-4 h-4" />
            Cabinets
          </DropdownMenuItem>
        </Link>
        <Separator className="my-0.5" />
        <form className="w-full" onSubmit={logout}>
          <button className="w-full justify-between">
            <DropdownMenuItem className="flex justify-between">
              <span className="text-red-500">Log out</span>
              <LogOut className="w-4 h-4 text-red-500" />
            </DropdownMenuItem>
          </button>
        </form>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
