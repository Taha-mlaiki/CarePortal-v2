"use client";

import { useUserState } from "@/store/userStore";
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
import { FormEvent, useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { imageSrc } from "../patient/cabinets/_components/CabinetCard";

export const UserMenu = () => {
  const router = useRouter();
  const { user, clearUser } = useUserState();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const logout = async (e: FormEvent) => {
    e.preventDefault();
    try {
      const res = await axios.post("/logout");
      if (res.status === 200) {
        toast.success("Logout successful");
        setIsLoggingOut(true);
        clearUser();
        router.push("/");
      }
    } catch (error) {
      console.log(error || "Something went wrong in logout process");
      toast.error("Logout failed");
    }
  };

  if (!user || isLoggingOut) {
    return <Skeleton className="w-10 h-10 rounded-full" />;
  }

  const basePath = user.role === "manager" ? "/manager" : "/patient";

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Avatar className="cursor-pointer">
          <AvatarImage src={imageSrc + user.image} />
          <AvatarFallback className="uppercase font-bold">
            {user.username.slice(0, 2)}
          </AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        side="bottom"
        sideOffset={20}
        className="absolute  -right-6 p-2 w-[250px]"
      >
        <div className="flex items-start gap-x-2 mb-2">
          <Avatar>
            <AvatarImage src={imageSrc + user.image} />
            <AvatarFallback className="uppercase font-bold">
              {user.username.slice(0, 2)}
            </AvatarFallback>
          </Avatar>
          <div className="text-sm text-neutral-600 mb-3">
            <h1>{user.username}</h1>
            <p>{user.email}</p>
          </div>
        </div>
        <DropdownMenuItem onSelect={(e) => e.preventDefault()} asChild>
          <ProfileModal />
        </DropdownMenuItem>
        <Separator className="my-0.5 h-[1.5px]" />
        <Link
          href={`${basePath}/dashboard`}
          className="flex items-center gap-x-2"
        >
          <DropdownMenuItem className="w-full">
            <LayoutDashboard className="w-4 h-4" />
            Dashboard
          </DropdownMenuItem>
        </Link>
        <Separator className="my-0.5" />
        <Link
          href={`${basePath}/cabinets/favorites`}
          className="flex items-center gap-x-2"
        >
          <DropdownMenuItem className="w-full">
            <HeartIcon className="w-4 h-4" />
            Favorites
          </DropdownMenuItem>
        </Link>
        {user.role == "manager" && (
          <>
            <Separator className="my-0.5" />
            <Link
              href={`${basePath}/cabinets`}
              className="flex items-center w-full gap-x-2"
            >
              <DropdownMenuItem className="w-full">
                <Store className="w-4 h-4" />
                Cabinets
              </DropdownMenuItem>
            </Link>
          </>
        )}
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
