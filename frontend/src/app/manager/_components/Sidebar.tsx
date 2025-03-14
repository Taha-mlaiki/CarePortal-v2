"use client";

import { Logo } from "@/components/Logo";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  Calendar,
  LayoutDashboard,
  LucideIcon,
  Menu,
  Settings,
  X,
} from "lucide-react";
import { useState } from "react";

const Sidebar = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const SidebarLink = ({
    icon: Icon,
    label,
    active = false,
  }: {
    icon: LucideIcon;
    label: string;
    active?: boolean;
  }) => (
    <Button
      variant="ghost"
      className={cn(
        "w-full justify-start gap-2",
        active && "bg-primary/10 text-primary"
      )}
    >
      <Icon className="h-4 w-4" />
      <span>{label}</span>
    </Button>
  );

  return (
    <div>
      {/* Mobile Sidebar Toggle */}
      <div className="lg:hidden fixed top-4 mb-10 left-4 z-50">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setSidebarOpen(!sidebarOpen)}
        >
          {sidebarOpen ? (
            <X className="h-4 w-4" />
          ) : (
            <Menu className="h-4 w-4" />
          )}
        </Button>
      </div>
      <div
        className={cn(
          "fixed inset-y-0 left-0 z-40 w-64 bg-white border-r transform transition-transform duration-200 ease-in-out lg:translate-x-0",
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="p-4">
          <Logo className=" ms-10 mt-1 mb-8" />
          <nav className="space-y-2">
            <SidebarLink icon={LayoutDashboard} label="Dashboard" active />
            <SidebarLink icon={Calendar} label="Appointments" />
            <SidebarLink icon={Settings} label="Settings" />
          </nav>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
