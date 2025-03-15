import React, { ReactNode } from "react";
import { Logo } from "@/components/Logo";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";
const Layout = ({ children }: { children: ReactNode }) => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-blue-50 dark:from-gray-950 dark:to-blue-950">
      <div className="flex max-w-7xl px-5 md:px-10 mx-auto h-16 items-center mb-10 justify-between">
        <Logo />
        <Link href="/">
          <Button variant="brand">
            <ChevronLeft />
            Back to Home page
          </Button>
        </Link>
      </div>
      {children}
    </div>
  );
};

export default Layout;
