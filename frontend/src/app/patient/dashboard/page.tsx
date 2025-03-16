import React from "react";
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
} from "lucide-react";
import { Logo } from "@/components/Logo";
import { UserMenu } from "@/app/_components/UserMenu";

const AppointmentStatusPage = () => {
  // Sample data for demonstration
  const appointments = [
    {
      id: 1,
      date: "2025-01-28",
      time: "09:30",
      cabinetName: "HealthCare Center",
      status: "confirmed",
    },
    {
      id: 2,
      date: "2025-01-28",
      time: "14:15",
      cabinetName: "Medical Plaza",
      status: "pending",
    },
    {
      id: 3,
      date: "2025-01-29",
      time: "11:00",
      cabinetName: "City Clinic",
      status: "canceled",
    },
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return (
          <Badge
            variant="outline"
            className="bg-yellow-100 gap-x-1 text-yellow-800"
          >
            <Hourglass className="w-3 h-3" />
            Pending
          </Badge>
        );
      case "confirmed":
        return (
          <Badge
            variant="outline"
            className="bg-green-100 gap-x-1 text-green-800"
          >
            <Check className="w-3 h-3" />
            Scheduled
          </Badge>
        );
      case "canceled":
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

  return (
    <div className="min-h-screen bg-gray-50 px-4 md:px-8">
        <div className=" max-w-7xl h-20  w-full mx-auto flex items-center justify-between">
          <Logo />
          <UserMenu />
        </div>
      <div className="max-w-7xl mt-20 mx-auto space-y-8">
        {/* Header */}
        <div className="flex flex-col space-y-4 md:space-y-0 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Appointments</h1>
            <p className="text-gray-500">Manage and track your appointments</p>
          </div>
          <Button variant="brand" className="w-full md:w-auto">
            <Calendar className="w-4 h-4 mr-2" />
            New Appointment
          </Button>
        </div>

        {/* Filters */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
          <div className="md:col-span-6 lg:col-span-8">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input placeholder="Search appointments..." className="pl-10" />
            </div>
          </div>
          <div className="md:col-span-3 lg:col-span-2">
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="confirmed">Confirmed</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="canceled">Canceled</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="md:col-span-3 lg:col-span-2">
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="Date" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="today">Today</SelectItem>
                <SelectItem value="week">This Week</SelectItem>
                <SelectItem value="month">This Month</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Appointments List */}
        <div className="space-y-4">
          {appointments.map((appointment) => (
            <Card
              key={appointment.id}
              className="hover:shadow-md transition-shadow"
            >
              <CardContent className="p-6">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
                  <div className="flex items-center space-x-4">
                    <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center">
                      <Calendar className="h-6 w-6 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-900">
                        {appointment.cabinetName}
                      </h3>
                      <p className="text-sm text-gray-500">
                        {new Date(
                          `${appointment.date}T${appointment.time}`
                        ).toLocaleString("en-US", {
                          dateStyle: "long",
                          timeStyle: "short",
                        })}
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

        {/* Pagination */}
        <div className="flex justify-center">
          <nav className="flex items-center space-x-2">
            <Button variant="outline" size="sm" disabled>
              Previous
            </Button>
            <Button variant="outline" size="sm" className="bg-blue-50">
              1
            </Button>
            <Button variant="outline" size="sm">
              2
            </Button>
            <Button variant="outline" size="sm">
              3
            </Button>
            <Button variant="outline" size="sm">
              Next
            </Button>
          </nav>
        </div>
      </div>
    </div>
  );
};

export default AppointmentStatusPage;
