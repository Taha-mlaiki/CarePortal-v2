"use client";
import React, { ReactNode, useEffect } from "react";
import Sidebar from "./_components/Sidebar";
import { useUserState } from "@/store/userStore";

const Layout = ({ children }: { children: ReactNode }) => {
  const fetchUser = useUserState((state) => state.fetchUser);

  useEffect(() => {
    fetchUser();
  }, [fetchUser]);
  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar />
      {children}
    </div>
  );
};

export default Layout;
