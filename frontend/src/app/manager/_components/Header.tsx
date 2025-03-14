import React from "react";
import { HelpCenter } from "./HelpCenter";

const Header = ({
  title,
  description,
}: {
  title: string;
  description: string;
}) => {
  return (
    <div className="flex items-center justify-between mb-8 pt-10 md:pt-0">
      <div>
        <h1 className="text-2xl font-bold text-gray-800">
          {title}
        </h1>
        <p className="text-gray-500">
          {description}
        </p>
      </div>
      <div>
        <HelpCenter />
      </div>
    </div>
  );
};

export default Header;
