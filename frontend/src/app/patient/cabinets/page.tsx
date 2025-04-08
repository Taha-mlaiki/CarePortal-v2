"use client";

import { useState, useEffect } from "react";
import { Search, ChevronLeft, ChevronRight, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CabinetCard } from "./_components/CabinetCard";
import axios from "@/lib/axios";
import { keepPreviousData, useQuery } from "@tanstack/react-query";

export interface CabinetType {
  id: number;
  name: string;
  doctor_name: string;
  speciality: string;
  address: string;
  city: string;
  location_link: string;
  thumbnail: string | null;
  email: string;
  phone: string;
  total_appointments: number;
  description: string;
  created_at: string;
  appointments_count: number;
}

interface CabinetResponse {
  data: CabinetType[];
  last_page: number;
  total: number;
}

const fetchCabinets = async (
  page: number,
  searchTerm: string
): Promise<CabinetResponse> => {
  const res = await axios.get("/cabinets", {
    params: {
      page,
      search: searchTerm || undefined,
    },
  });
  return res.data.data;
};

export default function CabinetsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);

  const { data, isLoading } = useQuery({
    queryKey: ["cabinets", currentPage, searchTerm],
    queryFn: () => fetchCabinets(currentPage, searchTerm),
    placeholderData: keepPreviousData,
  });

  // Update totalPages and totalItems when data changes
  useEffect(() => {
    if (data) {
      setTotalPages(data.last_page || 1); // Fallback to 1 if undefined
      setTotalItems(data.total || 0); // Fallback to 0 if undefined
    }
  }, [data]);

  // Generate page numbers (optional: limit visible pages)
  const pageNumbers = [];
  for (let i = 1; i <= totalPages; i++) {
    pageNumbers.push(i);
  }

  return (
    <div className="pb-10">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 sm:text-4xl">
          Medical Cabinets
        </h1>
        <p className="mt-2 text-lg text-gray-600">
          Find the perfect medical cabinet for your healthcare needs
        </p>
      </div>

      {/* Filters */}
      <div className="mb-10 rounded-2xl bg-white p-6 shadow-md">
        <div className="flex items-end justify-between">
          <div className="space-y-2 max-w-md w-full">
            <label className="text-sm font-medium text-gray-700">
              Search by Name or Address
            </label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <Input
                type="text"
                placeholder="Search cabinets..."
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setCurrentPage(1); // Reset to page 1 on search
                }}
                className="border-gray-300 pl-10 focus:border-brand w-full focus:ring-brand"
              />
            </div>
          </div>

          <div className="flex items-end lg:justify-end">
            <p className="text-sm text-gray-600">
              Showing{" "}
              <span className="font-medium text-gray-900">{totalItems}</span>{" "}
              cabinets
            </p>
          </div>
        </div>
      </div>

      {!isLoading && data ? (
        data.data.length > 0 ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {data.data.map((cabinet: CabinetType) => (
              <CabinetCard key={cabinet.id} cabinet={cabinet} />
            ))}
          </div>
        ) : (
          <div className="rounded-xl bg-white p-12 text-center shadow">
            <h3 className="text-xl font-medium text-gray-900">
              No cabinets found
            </h3>
            <p className="mt-2 text-gray-600">Try adjusting your search</p>
          </div>
        )
      ) : (
        <div className="py-20 flex items-center justify-center">
          <Loader2 className="w-10 h-10 animate-spin" />
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="py-14 flex items-center justify-center">
          <div className="inline-flex items-center gap-1 rounded-lg bg-white p-1.5 shadow">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="text-gray-700 hover:bg-gray-100 hover:text-gray-900 disabled:text-gray-400"
            >
              <ChevronLeft className="h-5 w-5" />
            </Button>

            {pageNumbers.map((page) => (
              <Button
                key={page}
                variant={currentPage === page ? "default" : "ghost"}
                onClick={() => setCurrentPage(page)}
                className={
                  currentPage === page
                    ? "bg-brand text-white hover:bg-brand/90"
                    : "text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                }
              >
                {page}
              </Button>
            ))}

            <Button
              variant="ghost"
              size="icon"
              onClick={() =>
                setCurrentPage((prev) => Math.min(prev + 1, totalPages))
              }
              disabled={currentPage === totalPages}
              className="text-gray-700 hover:bg-gray-100 hover:text-gray-900 disabled:text-gray-400"
            >
              <ChevronRight className="h-5 w-5" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
