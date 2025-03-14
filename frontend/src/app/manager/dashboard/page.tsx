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

const Charts = dynamic(() => import("../_components/Charts"), {
  ssr: false,
});

const MedicalDashboard = () => {
  const stats = [
    {
      title: "Total Appointments",
      value: "124",
      icon: Users,
      trend: "+12% vs last month",
    },
    {
      title: "Pending Approvals",
      value: "18",
      icon: Clock,
      trend: "-3% vs last month",
    },
    {
      title: "Confirmed",
      value: "92",
      icon: CheckCircle,
      trend: "+8% vs last month",
    },
    {
      title: "Canceled",
      value: "14",
      icon: XCircle,
      trend: "-2% vs last month",
    },
    {
      title: "Busiest Day",
      value: "Thursday",
      icon: TrendingUp,
      trend: "22 appointments",
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
       <Header title="Dashboard Overview" description="Welcome back! Here's your practice at a glance." /> 

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
                <p className="text-xs text-gray-500 mt-1">{stat.trend}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Charts Section */}
        <Charts />
      </div>
    </div>
  );
};

export default MedicalDashboard;
