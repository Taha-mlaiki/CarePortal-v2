"use client";
import React, { ReactNode, useEffect } from "react";
import Sidebar from "./_components/Sidebar";
import { useUserState } from "@/store/userStore";
import { redirect } from "next/navigation";

const Layout = ({ children }: { children: ReactNode }) => {
  const { user, fetchUser } = useUserState();

  useEffect(() => {
    fetchUser();
    if (user) {
      if (!user?.hasCabinet) {
        redirect("/create-cabinet");
      }
      if (!user?.hasCabinet) {
        redirect("/pricing");
      }
    }
  }, [fetchUser]);
  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar />
      {children}
    </div>
  );
};

export default Layout;
