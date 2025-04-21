"use client";
import { Logo } from "@/components/Logo";
import { Button } from "@/components/ui/button";
import { useUserState } from "@/store/userStore";
import Image from "next/image";
import Link from "next/link";
import { useEffect } from "react";
import { UserMenu } from "./UserMenu";

export const Navbar = () => {
  const { user, fetchUser } = useUserState();

  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  return (
    <header>
      <nav className="flex items-center justify-between max-w-7xl px-5 2xl:px-0 mx-auto  h-16">
        <div className="hidden lg:block">
          <Logo />
        </div>
        <div className="block lg:hidden">
          <Image width={50} height={50} alt="logo" src="/logoCare.png" />
        </div>
        {!user ? (
          <div className="flex items-center gap-x-2 z-10">
            <Link href="/auth">
              <Button variant="secondary">Book an appointment</Button>
            </Link>
            <Link href="/auth">
              <button className="shadow-[0_4px_14px_0_rgb(0,118,255,39%)] px-3  hover:shadow-[0_6px_20px_rgba(0,118,255,23%)] hover:bg-[rgba(0,118,255,0.9)] lg:px-8 py-2 bg-[#0070f3] rounded-md text-white font-light transition duration-200 ease-linear">
                Sign in
              </button>
            </Link>
          </div>
        ) : (
          <UserMenu />
        )}
      </nav>
    </header>
  );
};
