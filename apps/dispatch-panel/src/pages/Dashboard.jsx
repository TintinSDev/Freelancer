import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const Dashboard = () => {
  const [dashboardData, setDashboardData] = useState({
    totalJobs: 0,
    pendingJobs: 0,
    completedJobs: 0,
    totalEarnings: 0,
    pendingPayouts: 0,
    activeFreelancers: 0,
    topRatedFreelancer: "",
    mostCompletedJobs: 0,
  });

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const response = await fetch("/api/dashboard");
        const data = await response.json();
        setDashboardData(data);
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      }
    };

    fetchDashboardData();
  }, []);

  return (
    <div className="p-6 space-y-4">
      <h1 className="text-2xl font-bold">Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Total Jobs</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-semibold">{dashboardData.totalJobs}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Pending Jobs</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-semibold text-yellow-500">{dashboardData.pendingJobs}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Completed Jobs</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-semibold text-green-500">{dashboardData.completedJobs}</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
        <Card>
          <CardHeader>
            <CardTitle>Total Earnings</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-semibold text-blue-500">${dashboardData.totalEarnings}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Pending Payouts</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-semibold text-red-500">${dashboardData.pendingPayouts}</p>
          </CardContent>
        </Card>
      </div>

      <div className="mt-6">
        <h2 className="text-xl font-semibold mb-2">Provider Activity</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <Card>
            <CardHeader>
              <CardTitle>Active Providers</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-4xl font-semibold text-purple-500">{dashboardData.activeFreelancers}</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Top Rated Provider</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-lg font-semibold">{dashboardData.topRatedFreelancer}</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Most Completed Jobs</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-lg font-semibold">{dashboardData.mostCompletedJobs}</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
