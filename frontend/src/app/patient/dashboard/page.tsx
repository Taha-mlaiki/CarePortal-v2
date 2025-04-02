"use client";
import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Search,
  Calendar,
  ChevronRight,
  Hourglass,
  Check,
  X,
  Loader,
} from "lucide-react";
import axios from "@/lib/axios";
import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns/format";

const fetchAppointments = async ({ page = 1, search = "", status = "all", date = "" }) => {
  const res = await axios.get("/appointments", {
    params: {
      page,
      search,
      status,
      date,
      per_page: 10, // Match backend default
    },
  });
  return res.data.appointments; // Returns paginated data
};

const AppointmentStatusPage = () => {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("all");
  const [date, setDate] = useState("");

  const { data: appointmentsData, isLoading } = useQuery({
    queryFn: () => fetchAppointments({ page, search, status, date }),
    queryKey: ["patient_appointments", page, search, status, date],
  });

  const appointments = appointmentsData?.data || [];
  const totalPages = appointmentsData?.last_page || 1;

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Pending":
        return (
          <Badge variant="outline" className="bg-yellow-100 gap-x-1 text-yellow-800">
            <Hourglass className="w-3 h-3" />
            Pending
          </Badge>
        );
      case "Confirmed":
        return (
          <Badge variant="outline" className="bg-green-100 gap-x-1 text-green-800">
            <Check className="w-3 h-3" />
            Scheduled
          </Badge>
        );
      case "Canceled":
        return (
          <Badge variant="outline" className="bg-red-100 gap-x-1 text-red-800">
            <X className="w-3 h-3" />
            Cancelled
          </Badge>
        );
      default:
        return null;
    }
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
    setPage(1); // Reset to page 1 on search
  };

  const handleStatusChange = (value: string) => {
    setStatus(value);
    setPage(1);
  };

  const handleDateChange = (value: string) => {
    setDate(value);
    setPage(1);
  };

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setPage(newPage);
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Appointments</h1>
        <p className="text-gray-500">Manage and track your appointments</p>
      </div>

      {/* Filters */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
        <div className="md:col-span-6 lg:col-span-8">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search appointments..."
              className="pl-10"
              value={search}
              onChange={handleSearch}
            />
          </div>
        </div>
        <div className="md:col-span-3 lg:col-span-2">
          <Select defaultValue={status} onValueChange={handleStatusChange}>
            <SelectTrigger>
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="Confirmed">Confirmed</SelectItem>
              <SelectItem value="Pending">Pending</SelectItem>
              <SelectItem value="Canceled">Canceled</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="md:col-span-3 lg:col-span-2">
          <Select value={date} onValueChange={handleDateChange}>
            <SelectTrigger>
              <SelectValue placeholder="Date" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Dates</SelectItem>
              <SelectItem value="today">Today</SelectItem>
              <SelectItem value="week">This Week</SelectItem>
              <SelectItem value="month">This Month</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Appointments List */}
      {isLoading ? (
        <Loader className="w-14 h-14 animate-spin text-neutral-700 mx-auto" />
      ) : appointments.length > 0 ? (
        <div className="space-y-4">
          {appointments.map((appointment: any) => (
            <Card key={appointment.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
                  <div className="flex items-center space-x-4">
                    <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center">
                      <Calendar className="h-6 w-6 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-900">{appointment.cabinet.name}</h3>
                      <p className="text-sm text-gray-500">
                        {format(appointment.appointment_date, "dd/MM/yyyy")}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between md:justify-end space-x-4">
                    {getStatusBadge(appointment.status)}
                    <Button variant="ghost" size="icon">
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="flex items-center justify-center py-10 text-center">
          No Appointments found
        </div>
      )}

      {/* Pagination */}
      {appointmentsData && (
        <div className="flex justify-center">
          <nav className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePageChange(page - 1)}
              disabled={page === 1}
            >
              Previous
            </Button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
              <Button
                key={p}
                variant="outline"
                size="sm"
                className={p === page ? "bg-blue-50" : ""}
                onClick={() => handlePageChange(p)}
              >
                {p}
              </Button>
            ))}
            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePageChange(page + 1)}
              disabled={page === totalPages}
            >
              Next
            </Button>
          </nav>
        </div>
      )}
    </div>
  );
};

export default AppointmentStatusPage;