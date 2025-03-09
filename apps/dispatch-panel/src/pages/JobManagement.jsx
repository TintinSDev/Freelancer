import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";

const JobManagement = () => {
  const [jobData, setJobData] = useState({
    totalJobs: "",
    pendingJobs: "",
    completedJobs: "",
    totalEarnings: "",
    activeFreelancers: 0,
    topRatedFreelancer: "",
    mostCompletedJobs: "",
  });
  const [jobs, setJobs] = useState([]);
  const [freelancers, setFreelancers] = useState([]);
  const [selectedJob, setSelectedJob] = useState(null);
  const [assignedFreelancer, setAssignedFreelancer] = useState("");

  useEffect(() => {
    const fetchJobData = async () => {
      try {
        const response = await fetch("/api/job-management");
        const data = await response.json();
        setJobData(data);
      } catch (error) {
        console.error("Error fetching job management data:", error);
      }
    };

    const fetchJobs = async () => {
      try {
        const response = await fetch("/api/jobs");
        const data = await response.json();
        setJobs(data);
      } catch (error) {
        console.error("Error fetching jobs:", error);
      }
    };

    const fetchFreelancers = async () => {
      try {
        const response = await fetch("/api/freelancers");
        const data = await response.json();
        setFreelancers(data);
      } catch (error) {
        console.error("Error fetching freelancers:", error);
      }
    };

    fetchJobData();
    fetchJobs();
    fetchFreelancers();
  }, []);

  const handleAssignFreelancer = (jobId) => {
    console.log(`Assigned ${assignedFreelancer} to job ${jobId}`);
    setAssignedFreelancer("");
  };

  return (
    <div className="p-6 space-y-4">
      <h1 className="text-2xl font-bold">Job Management</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Total Jobs</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-semibold">{jobData.totalJobs}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Pending Jobs</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-semibold text-yellow-500">
              {jobData.pendingJobs}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Completed Jobs</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-semibold text-green-500">
              {jobData.completedJobs}
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
        <Card>
          <CardHeader>
            <CardTitle>Total Earnings</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-semibold text-blue-500">
              ${jobData.totalEarnings}
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="mt-6">
        <h2 className="text-xl font-semibold mb-2">Freelancer Activity</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <Card>
            <CardHeader>
              <CardTitle>Active Freelancers</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-4xl font-semibold text-purple-500">
                {jobData.activeFreelancers}
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Top Rated Freelancer</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-lg font-semibold">
                {jobData.topRatedFreelancer}
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Most Completed Jobs</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-lg font-semibold">
                {jobData.mostCompletedJobs}
              </p>
            </CardContent>
          </Card>
        </div>
      </div>

      <div className="mt-6">
        <h2 className="text-xl font-semibold mb-2">Assign Jobs</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {jobs.map((job) => (
            <Card
              key={job.id}
              onClick={() => setSelectedJob(job.id)}
              className={`cursor-pointer ${selectedJob === job.id ? "border-2 border-blue-500" : ""}`}
            >
              <CardHeader>
                <CardTitle>{job.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p>
                  <strong>Status:</strong> {job.status}
                </p>
                <p>
                  <strong>Provider:</strong> {job.provider || "Unassigned"}
                </p>
                {job.status === "Pending" && (
                  <>
                    <Select onValueChange={setAssignedFreelancer}>
                      <SelectTrigger>
                        <SelectValue placeholder="Assign Freelancer" />
                      </SelectTrigger>
                      <SelectContent>
                        {freelancers.map((freelancer) => (
                          <SelectItem
                            key={freelancer.id}
                            value={freelancer.name}
                          >
                            {freelancer.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <Button
                      onClick={() => handleAssignFreelancer(job.id)}
                      className="mt-2 w-full"
                    >
                      Assign
                    </Button>
                  </>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default JobManagement;
