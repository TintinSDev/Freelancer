import { useEffect, useState } from "react";
import { loadStripe } from "@stripe/stripe-js";
import { Elements} from "@stripe/react-stripe-js";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const stripePromise = loadStripe("your_publishable_key");

const Payments = () => {
  const [payments, setPayments] = useState([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const fetchPayments = async () => {
      try {
        const response = await fetch("/api/payments");
        const data = await response.json();
        setPayments(data);
      } catch (error) {
        console.error("Error fetching payments:", error);
      }
    };

    fetchPayments();
  }, []);

  const handleApprove = async (id) => {
    try {
      await fetch(`/api/payments/${id}/approve`, { method: "POST" });
      setPayments((prev) =>
        prev.map((p) => (p.id === id ? { ...p, status: "Completed" } : p))
      );
    } catch (error) {
      console.error("Error approving payment:", error);
    }
  };

  const handleReject = async (id) => {
    try {
      await fetch(`/api/payments/${id}/reject`, { method: "POST" });
      setPayments((prev) =>
        prev.map((p) => (p.id === id ? { ...p, status: "Failed" } : p))
      );
    } catch (error) {
      console.error("Error rejecting payment:", error);
    }
  };

  const handlePayout = async (id) => {
    try {
      const response = await fetch("/api/create-checkout-session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ paymentId: id }),
      });
      const { sessionId } = await response.json();
      const stripe = await stripePromise;
      const { error } = await stripe.redirectToCheckout({ sessionId });
      if (error) console.error("Stripe error:", error);
    } catch (error) {
      console.error("Error processing payout:", error);
    }
  };

  const filteredPayments = payments.filter(
    (payment) =>
      payment.date.includes(search) ||
      payment.amount.toString().includes(search) ||
      payment.status.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <Elements stripe={stripePromise}>
      <div className="p-6 space-y-4">
        <h1 className="text-2xl font-bold">Payments & Payouts</h1>

        <Input
          type="text"
          placeholder="Search payments..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="mb-4 w-full"
        />

        <div className="bg-white p-4 rounded-lg shadow">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-100">
                <th className="p-2">Date</th>
                <th className="p-2">Amount</th>
                <th className="p-2">Status</th>
                <th className="p-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredPayments.map((payment) => (
                <tr key={payment.id} className="border-b">
                  <td className="p-2">{payment.date}</td>
                  <td className="p-2">${payment.amount}</td>
                  <td className="p-2">{payment.status}</td>
                  <td className="p-2">
                    {payment.status === "Pending" && (
                      <div className="space-x-5">
                        <Button
                          onClick={() => handleApprove(payment.id)}
                          className="px-3 py-2 bg-green-500 text-white rounded"
                        >
                          Approve
                        </Button>
                        <Button
                          onClick={() => handleReject(payment.id)}
                          className="px-3 py-1 bg-red-500 text-white rounded"
                        >
                          Reject
                        </Button>
                      </div>
                    )}
                    {payment.status === "Completed" && (
                      <Button
                        onClick={() => handlePayout(payment.id)}
                        className="px-3 py-2 bg-blue-500 text-white rounded"
                      >
                        Process Payout
                      </Button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </Elements>
  );
};

export default Payments;
