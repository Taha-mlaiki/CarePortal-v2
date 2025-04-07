"use client";

import {
  TrendingUp,
  Users,
  Clock,
  CheckCircle,
  XCircle,
  DollarSign,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import dynamic from "next/dynamic";
import Header from "../_components/Header";
import { useEffect, useState } from "react";
import axios from "@/lib/axios";

const Charts = dynamic(() => import("../_components/Charts"), {
  ssr: false,
});

const MedicalDashboard = () => {
  const [statistiques, setStatistiques] = useState({
    canceled_appointments: 0,
    completed_appointments: 0,
    pending_appointments: 0,
    scheduled_appointments: 0,
    total_appointments: 0,
    appointment_weeks: null,
  });
  useEffect(() => {
    const fetchStatistiques = async () => {
      try {
        const res = await axios.get("/cabinets/statistiques");
        setStatistiques(res.data);
      } catch (error) {
        console.log(error)
      }
    };
    fetchStatistiques();
  }, []);

  const stats = [
    {
      title: "Total Appointments",
      value: statistiques.total_appointments,
      icon: Users,
    },
    {
      title: "Pending Approvals",
      value: statistiques.pending_appointments,
      icon: Clock,
    },
    {
      title: "Scheduled",
      value: statistiques.scheduled_appointments,
      icon: CheckCircle,
    },
    {
      title: "Canceled",
      value: statistiques.canceled_appointments,
      icon: XCircle,
    },
    {
      title: "Completed",
      value: statistiques.completed_appointments,
      icon: CheckCircle,
    },
  ];

  return (
    <div
      className={cn(
        "transition-all duration-200 ease-in-out",
        "lg:ml-64 min-h-screen p-5 md:p-10"
      )}
    >
      <div>
        {/* Header */}
        <Header
          title="Dashboard Overview"
          description="Welcome back! Here's your practice at a glance."
        />

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
          {stats.map((stat, index) => (
            <Card key={index} className="bg-white">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-gray-500">
                  {stat.title}
                </CardTitle>
                <stat.icon className="h-4 w-4 text-gray-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Charts Section */}
        <Charts statistiques={statistiques} />
      </div>
    </div>
  );
};

export default MedicalDashboard;
