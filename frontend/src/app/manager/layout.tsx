import React, { ReactNode } from "react";
import Sidebar from "./_components/Sidebar";

const layout = ({ children }: { children: ReactNode }) => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar />
      {children}
    </div>
  );
};

export default layout;
