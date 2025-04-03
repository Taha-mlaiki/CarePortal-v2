"use client";
import React, { useState } from "react";
import { DataTable } from "../_components/data-table";
import { cn } from "@/lib/utils";
import Header from "../_components/Header";
import { DayOffCheckbox } from "./_components/DayOffCheckbox";
import axios from "@/lib/axios";
import { useQuery } from "@tanstack/react-query";

export type ParamsType = {
  searchTerm: string;
  date: string | null;
  status: string;
};

const fetchAppointments = async (params: ParamsType) => {
  try {
    const res = await axios.get("/cabinets/appointments", { params });
    return res.data.data.data || [];
  } catch (error) {
    console.error("Error fetching appointments:", error);
    return [];
  }
};

const Page = () => {
  const [params, setParams] = useState<ParamsType>({
    searchTerm: "",
    date: null,
    status: "",
  });

  const { data, isLoading } = useQuery({
    queryFn: () =>
      fetchAppointments({
        ...params,
      }),
    queryKey: ["cabinet_appointments", params],
  });

  return (
    <div
      className={cn(
        "transition-all duration-200 ease-in-out",
        "lg:ml-64 min-h-screen p-5 md:p-10"
      )}
    >
      <Header
        title="Manage Appointments"
        description="Manage your appointments with ease."
      />
      <div className="mt-10 mb-16">
        <DayOffCheckbox />
        <DataTable
          setParams={setParams}
          params={params}
          data={data || []}
          isLoading={isLoading}
        />
      </div>
    </div>
  );
};

export default Page;
