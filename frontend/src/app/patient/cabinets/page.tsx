"use client";

import { useState, useEffect } from "react";
import {
  Search,
  Filter,
  ChevronLeft,
  ChevronRight
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CabinetCard } from "./_components/CabinetCard";



// Dummy data for cabinets
export const CABINETS_DATA = [
  {
    id: 1,
    name: "Wellness Central",
    thumbnail: "",
    address: "123 Healing Ave, New York, NY 10001",
    specialty: "General Medicine",
    dateStarted: new Date("2018-03-15"),
    totalAppointments: 1458,
  },
  {
    id: 2,
    name: "Dental Excellence",
    thumbnail: null,
    address: "456 Smile Street, Boston, MA 02108",
    specialty: "Dentistry",
    dateStarted: new Date("2015-07-22"),
    totalAppointments: 3254,
  },
  {
    id: 3,
    name: "Mind & Body Wellness",
    thumbnail: "",
    address: "789 Serenity Blvd, San Francisco, CA 94107",
    specialty: "Psychology",
    dateStarted: new Date("2019-11-05"),
    totalAppointments: 876,
  },
  {
    id: 4,
    name: "Heart Health Specialists",
    thumbnail: null,
    address: "321 Pulse Lane, Chicago, IL 60601",
    specialty: "Cardiology",
    dateStarted: new Date("2010-02-28"),
    totalAppointments: 5432,
  },
  {
    id: 5,
    name: "Family Care Center",
    thumbnail: "",
    address: "555 Nurture Road, Seattle, WA 98101",
    specialty: "Family Medicine",
    dateStarted: new Date("2017-09-12"),
    totalAppointments: 2187,
  },
  {
    id: 6,
    name: "Orthopedic Solutions",
    thumbnail: "",
    address: "888 Joint Street, Denver, CO 80202",
    specialty: "Orthopedics",
    dateStarted: new Date("2014-05-17"),
    totalAppointments: 1932,
  },
  {
    id: 7,
    name: "Vision Care Experts",
    thumbnail: null,
    address: "777 Clarity Court, Austin, TX 78701",
    specialty: "Ophthalmology",
    dateStarted: new Date("2016-08-30"),
    totalAppointments: 1645,
  },
  {
    id: 8,
    name: "Pediatric Wellness",
    thumbnail: "",
    address: "444 Children's Way, Portland, OR 97201",
    specialty: "Pediatrics",
    dateStarted: new Date("2013-12-10"),
    totalAppointments: 2876,
  },
  {
    id: 9,
    name: "Dermatology Institute",
    thumbnail: "",
    address: "222 Skin Street, Miami, FL 33101",
    specialty: "Dermatology",
    dateStarted: new Date("2018-01-25"),
    totalAppointments: 1234,
  },
  {
    id: 10,
    name: "Neurology Center",
    thumbnail: null,
    address: "999 Brain Boulevard, Philadelphia, PA 19102",
    specialty: "Neurology",
    dateStarted: new Date("2011-04-18"),
    totalAppointments: 3421,
  },
  {
    id: 11,
    name: "Women's Health Clinic",
    thumbnail: "",
    address: "333 Wellness Way, Atlanta, GA 30303",
    specialty: "Gynecology",
    dateStarted: new Date("2015-10-05"),
    totalAppointments: 2543,
  },
  {
    id: 12,
    name: "Physical Therapy Plus",
    thumbnail: null,
    address: "111 Recovery Road, Nashville, TN 37203",
    specialty: "Physical Therapy",
    dateStarted: new Date("2017-06-20"),
    totalAppointments: 1876,
  },
];

// Get unique specialties for filter
const SPECIALTIES = Array.from(
  new Set(CABINETS_DATA.map((cabinet) => cabinet.specialty))
);

export default function CabinetsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [specialty, setSpecialty] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [filteredCabinets, setFilteredCabinets] = useState(CABINETS_DATA);

 

  const itemsPerPage = 6;

  // Filter cabinets based on search term and specialty
  useEffect(() => {
    let result = CABINETS_DATA;

    // Filter by specialty
    if (specialty !== "all") {
      result = result.filter((cabinet) => cabinet.specialty === specialty);
    }

    // Filter by search term
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(
        (cabinet) =>
          cabinet.name.toLowerCase().includes(term) ||
          cabinet.address.toLowerCase().includes(term)
      );
    }

    setFilteredCabinets(result);
    setCurrentPage(1); // Reset to first page when filters change
  }, [searchTerm, specialty]);

  // Calculate pagination
  const totalPages = Math.ceil(filteredCabinets.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedCabinets = filteredCabinets.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  // Generate page numbers
  const pageNumbers = [];
  for (let i = 1; i <= totalPages; i++) {
    pageNumbers.push(i);
  }

  return (
    <div>
      {/* Header */}
      <div className="mb-8 ">
        <h1 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
          Medical Cabinets
        </h1>
        <p className="mt-2 text-lg text-gray-600">
          Find the perfect medical cabinet for your healthcare needs
        </p>
      </div>

      {/* Filters */}
      <div className="mb-10 rounded-2xl bg-white p-6 shadow-md">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">
              Search by Name or Address
            </label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <Input
                type="text"
                placeholder="Search cabinets..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="border-gray-300 pl-10 focus:border-brand focus:ring-brand"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">
              Filter by Specialty
            </label>
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <Select value={specialty} onValueChange={setSpecialty}>
                <SelectTrigger className="border-gray-300 pl-10 focus:border-brand focus:ring-brand">
                  <SelectValue placeholder="Select specialty" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Specialties</SelectItem>
                  {SPECIALTIES.map((spec) => (
                    <SelectItem key={spec} value={spec}>
                      {spec}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex items-end lg:justify-end">
            <p className="text-sm text-gray-600">
              Showing{" "}
              <span className="font-medium text-gray-900">
                {filteredCabinets.length}
              </span>{" "}
              cabinets
            </p>
          </div>
        </div>
      </div>

      {/* Cabinet Cards */}
      {filteredCabinets.length > 0 ? (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {paginatedCabinets.map((cabinet) => (
            <CabinetCard key={cabinet.id} cabinet={cabinet} />
          ))}
        </div>
      ) : (
        <div className="rounded-xl bg-white p-12 text-center shadow">
          <h3 className="text-xl font-medium text-gray-900">
            No cabinets found
          </h3>
          <p className="mt-2 text-gray-600">
            Try adjusting your search or filter criteria
          </p>
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
