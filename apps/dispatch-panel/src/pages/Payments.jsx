import { useEffect, useState } from "react";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const stripePromise = loadStripe("your_publishable_key");

const Payments = () => {
  const [payments, setPayments] = useState([]);

  useEffect(() => {
    const fetchPayments = async () => {
      try {
        const response = await fetch("/api/payments/me"); // Fetch only the logged-in user's payments
        const data = await response.json();
        setPayments(data);
      } catch (error) {
        console.error("Error fetching payments:", error);
      }
    };
    fetchPayments();
  }, []);

  const handlePayment = async (amount) => {
    try {
      const response = await fetch("/api/payments/initiate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount }),
      });
      const { sessionId } = await response.json();
      const stripe = await stripePromise;
      await stripe.redirectToCheckout({ sessionId });
    } catch (error) {
      console.error("Error processing payment:", error);
    }
  };

  return (
    <Elements stripe={stripePromise}>
      <div className="p-6 space-y-4">
        <h1 className="text-2xl font-bold">My Payments</h1>

        <Input
          type="number"
          placeholder="Enter amount"
          id="amount"
          className="mb-4 w-full"
        />
        <Button
          onClick={() => handlePayment(document.getElementById("amount").value)}
          className="px-3 py-2 bg-blue-500 text-white rounded"
        >
          Pay Now
        </Button>

        <div className="bg-white p-4 rounded-lg shadow">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-100">
                <th className="p-2">Date</th>
                <th className="p-2">Amount</th>
                <th className="p-2">Status</th>
              </tr>
            </thead>
            <tbody>
              {payments.map((payment) => (
                <tr key={payment.id} className="border-b">
                  <td className="p-2">{payment.date}</td>
                  <td className="p-2">${payment.amount}</td>
                  <td className="p-2">{payment.status}</td>
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
