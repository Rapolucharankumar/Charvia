"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";

export function CheckoutButton() {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleCheckout = async () => {
    try {
      setIsLoading(true);
      
      const res = await fetch("/api/checkout", { method: "POST" });
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to initiate checkout");
      }

      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        subscription_id: data.subscriptionId,
        name: "Charvia",
        description: "Pro Plan Subscription",
        handler: async function (response: any) {
          // Verify payment success
          const verifyRes = await fetch("/api/webhooks/razorpay/verify", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_subscription_id: response.razorpay_subscription_id,
              razorpay_signature: response.razorpay_signature
            })
          });

          if (verifyRes.ok) {
            router.push("/dashboard?success=true");
          } else {
            alert("Payment verification failed. Please contact support.");
          }
        },
        theme: {
          color: "#0f172a",
        },
      };

      const rzp = new (window as any).Razorpay(options);
      rzp.on('payment.failed', function (response: any){
        alert("Payment Failed. Reason: " + response.error.description);
      });
      rzp.open();
    } catch (error: any) {
      console.error(error);
      alert(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <script src="https://checkout.razorpay.com/v1/checkout.js"></script>
      <Button 
        className="w-full mt-8" 
        size="lg" 
        onClick={handleCheckout} 
        disabled={isLoading}
      >
        {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        {isLoading ? "Redirecting..." : "Upgrade to Pro"}
      </Button>
    </>
  );
}
