import React from "react";
import { HelpCenter } from "./HelpCenter";
import { UserMenu } from "@/app/_components/UserMenu";

const Header = ({
  title,
  description,
}: {
  title: string;
  description: string;
}) => {
  return (
    <div className="flex items-center justify-between mb-16 pt-10 md:pt-0">
      <div>
        <h1 className="text-2xl font-bold text-gray-800">
          {title}
        </h1>
        <p className="text-gray-500">
          {description}
        </p>
      </div>
      <div className="flex items-center gap-x-7">
        <HelpCenter />
        <UserMenu />
      </div>
    </div>
  );
};

export default Header;
