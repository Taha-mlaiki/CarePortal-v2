import React, { ReactNode } from "react";
import InitilizeFavorites from "./_components/InitilizeFavorites";
import InitilizeCommentableCabinets from "./_components/InitilizeCommentableCabinets";

const layout = ({ children }: { children: ReactNode }) => {
  return (
    <div>
      <InitilizeFavorites />
      <InitilizeCommentableCabinets />
      {children}
    </div>
  );
};

export default layout;
