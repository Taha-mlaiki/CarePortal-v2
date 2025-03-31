import React, { ReactNode } from "react";
import InitilizeFavorites from "./_components/InitilizeFavorites";

const layout = ({ children }: { children: ReactNode }) => {
  return (
    <div>
      <InitilizeFavorites />
      {children}
    </div>
  );
};

export default layout;
