import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

const UserManagement = () => {
  const [consumers, setConsumers] = useState([]);
  const [serviceProviders, setServiceProviders] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [rejectionReason, setRejectionReason] = useState("");

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch("/api/users");
        const data = await response.json();
        setConsumers(data.filter(user => user.role === "Consumer"));
        setServiceProviders(data.filter(user => user.role === "Service Provider"));
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };
    fetchUsers();
  }, []);

  const handleApprove = () => {
    console.log(`Approved: ${selectedUser.name}`);
    setSelectedUser(null);
  };

  const handleReject = () => {
    console.log(`Rejected: ${selectedUser.name}, Reason: ${rejectionReason}`);
    setSelectedUser(null);
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-semibold mb-4">User Management</h2>
      
      <h3 className="text-xl font-semibold mt-4">Service Providers</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {serviceProviders.map((user) => (
          <Card key={user.id} className="cursor-pointer" onClick={() => setSelectedUser(user)}>
            <CardHeader>
              <CardTitle>{user.name}</CardTitle>
            </CardHeader>
            <CardContent>
              <p><strong>Status:</strong> {user.status}</p>
              <p><strong>Rating:</strong> {user.rating} ⭐</p>
              <p><strong>Jobs Completed:</strong> {user.jobsCompleted}</p>
            </CardContent>
          </Card>
        ))}
      </div>
      
      <h3 className="text-xl font-semibold mt-6">Consumers</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {consumers.map((user) => (
          <Card key={user.id} className="cursor-pointer" onClick={() => setSelectedUser(user)}>
            <CardHeader>
              <CardTitle>{user.name}</CardTitle>
            </CardHeader>
            <CardContent>
              <p><strong>Status:</strong> {user.status}</p>
            </CardContent>
          </Card>
        ))}
      </div>
      
      {selectedUser && (
        <Dialog open={!!selectedUser} onOpenChange={() => setSelectedUser(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{selectedUser.name}</DialogTitle>
            </DialogHeader>
            <div>
              <p><strong>Role:</strong> {selectedUser.role}</p>
              <p><strong>Rating:</strong> {selectedUser.rating || "N/A"} ⭐</p>
              <p><strong>Jobs Completed:</strong> {selectedUser.jobsCompleted || "N/A"}</p>
              {selectedUser.status === "Pending" && (
                <div className="mt-4">
                  <Textarea
                    placeholder="Detailed reason for rejection"
                    value={rejectionReason}
                    onChange={(e) => setRejectionReason(e.target.value)}
                  />
                  <Input
                    placeholder="Short reason for rejection"
                    value={rejectionReason}
                    onChange={(e) => setRejectionReason(e.target.value)}
                    className="mt-2"
                  />
                </div>
              )}
            </div>
            <DialogFooter>
              <Button onClick={handleApprove} className="bg-green-500">Approve</Button>
              <Button onClick={handleReject} className="bg-red-500">Reject</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default UserManagement;
