import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Legend } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useEffect, useState } from "react";

const COLORS = ["#10B981", "#FBBF24", "#3B82F6", "#EF4444"]; // Completed, Pending, In Progress, Cancelled

const Reports = () => {
  const [reportData, setReportData] = useState({
    completedJobs: 0,
    pendingJobs: 0,
    inProgressJobs: 0,
    cancelledJobs: 0,
    earnings: [],
  });

  useEffect(() => {
    const fetchReportData = async () => {
      try {
        const response = await fetch("/api/reports");
        const data = await response.json();
        setReportData(data);
      } catch (error) {
        console.error("Error fetching report data:", error);
      }
    };
    fetchReportData();
  }, []);

  const chartData = [
    { name: "Completed", value: reportData.completedJobs },
    { name: "Pending", value: reportData.pendingJobs },
    { name: "In Progress", value: reportData.inProgressJobs },
    { name: "Cancelled", value: reportData.cancelledJobs },
  ];

  return (
    <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Pie Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Job Distribution</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={chartData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={100}
                fill="#8884d8"
                label
              >
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
      
      {/* Bar Chart for Earnings */}
      <Card>
        <CardHeader>
          <CardTitle>Earnings Over Time</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={reportData.earnings}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="earnings" fill="#82ca9d" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
};

export default Reports;
