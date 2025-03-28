"use client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import React, { ReactNode, useState } from "react";

const ReactQueryProvider = ({ children }: { children: ReactNode }) => {
  const [reactQuery] = useState(() => new QueryClient());
  return (
    <QueryClientProvider client={reactQuery}>{children}</QueryClientProvider>
  );
};

export default ReactQueryProvider;
