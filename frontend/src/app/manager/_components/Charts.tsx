"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import React from "react";
import {
  Bar,
  BarChart,
  Cell,
  Legend,
  Pie,
  PieChart,
  XAxis,
  YAxis,
} from "recharts";

const Charts = () => {
  // Dummy data for charts
  const appointmentData = [
    { date: "Mon", appointments: 12 },
    { date: "Tue", appointments: 19 },
    { date: "Wed", appointments: 15 },
    { date: "Thu", appointments: 22 },
    { date: "Fri", appointments: 18 },
    { date: "Sat", appointments: 10 },
    { date: "Sun", appointments: 8 },
  ];

  const statusData = [
    { name: "Confirmed", value: 65, color: "#22c55e" },
    { name: "Pending", value: 25, color: "#eab308" },
    { name: "Canceled", value: 10, color: "#ef4444" },
  ];
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-8">
      {/* Weekly Appointments Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Weekly Appointments</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            <BarChart
              width={500}
              height={300}
              data={appointmentData}
              margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
            >
              <XAxis dataKey="date" />
              <YAxis />
              <Bar dataKey="appointments" fill="#3b82f6" />
            </BarChart>
          </div>
        </CardContent>
      </Card>

      {/* Appointment Status Distribution */}
      <Card>
        <CardHeader>
          <CardTitle>Appointment Status Distribution</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            <PieChart width={500} height={300}>
              <Pie
                data={statusData}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={80}
                dataKey="value"
              >
                {statusData.map((entry, index) => (
                  <Cell key={index} fill={entry.color} />
                ))}
              </Pie>
              <Legend />
            </PieChart>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Charts;
