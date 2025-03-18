import { Logo } from "@/components/Logo";
import React, { ReactNode } from "react";
import { UserMenu } from "../_components/UserMenu";

const layout = ({ children }: { children: ReactNode }) => {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container">
        <div className=" max-w-7xl h-20 mb-16 w-full mx-auto flex items-center justify-between">
          <Logo />
          <UserMenu />
        </div>
        {children}
      </div>
    </div>
  );
};

export default layout;
