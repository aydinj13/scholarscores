"use client"

import React, { useEffect, useState } from "react";
import { PaymentElement, useElements, useStripe } from "@stripe/react-stripe-js";
import { Card, CardHeader, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Shield, CreditCard } from "lucide-react";
import convertToSubcurrency from "@/lib/convertToSubcurrency";
import { LockClosedIcon } from "@heroicons/react/24/outline";

function CheckoutPage({ amount }: { amount: number }) {
  const stripe = useStripe();
  const elements = useElements();
  
  const [errorMessage, setErrorMessage] = useState<string>();
  const [clientSecret, setClientSecret] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Fetch the client secret when the component mounts
    fetch("/api/create-payment-intent", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ amount: convertToSubcurrency(amount) }),
    })
      .then((res) => res.json())
      .then((data) => setClientSecret(data.clientSecret))
      .catch((error) => setErrorMessage("Failed to initialize payment. Please try again."));
  }, [amount]);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);

    if (!stripe || !elements) {
      return;
    }

    const { error: submitError } = await elements.submit();

    if (submitError) {
      setErrorMessage(submitError.message);
      setLoading(false);
      return;
    }

    const { error } = await stripe.confirmPayment({
      elements,
      clientSecret,
      confirmParams: {
        return_url: `http://www.localhost:3000/school/new/payment-success?amount=${amount}`,
      },
    });

    if (error) {
      setErrorMessage(error.message);
    }

    setLoading(false);
  };

  if (!clientSecret || !stripe || !elements) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-pulse flex flex-col items-center gap-4">
          <CreditCard className="w-12 h-12 text-gray-400" />
          <p className="text-lg text-gray-600">Initializing payment...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md mx-auto">
        <Card>
          <CardHeader>
            <div className="text-center">
              <h1 className="text-2xl font-bold text-gray-900">Secure Checkout</h1>
              <p className="mt-2 text-gray-600">Complete your payment securely</p>
            </div>
          </CardHeader>

          <CardContent>
            <div className="mb-6">
              <div className="flex items-center justify-between mb-4">
                <span className="text-lg font-medium">Annual Fee:</span>
                <span className="text-2xl font-bold">${amount.toFixed(2)}</span>
              </div>
              
              <div className="bg-blue-50 p-4 rounded-lg mb-6">
                <div className="flex items-center gap-2 text-blue-700 mb-2">
                  <Shield className="w-5 h-5" />
                  <span className="font-medium">Secure Payment</span>
                </div>
                <p className="text-sm text-blue-600">
                  Your payment is encrypted and processed securely through Stripe.
                </p>
              </div>

              <form onSubmit={handleSubmit}>
                <div className="mb-6">
                  <PaymentElement />
                </div>

                {errorMessage && (
                  <Alert variant="destructive" className="mb-4">
                    <AlertDescription>{errorMessage}</AlertDescription>
                  </Alert>
                )}

                <Button 
                  type="submit" 
                  className="w-full"
                  disabled={loading}
                >
                  <LockClosedIcon className="w-4 h-4 mr-2" />
                  {!loading ? `Pay $${amount.toFixed(2)}` : "Processing..."}
                </Button>
              </form>
            </div>
          </CardContent>

          <CardFooter className="bg-gray-50 px-4 py-3">
            <div className="flex items-center justify-center text-sm text-gray-500 gap-2">
              <LockClosedIcon className="w-4 h-4" />
              <span>Powered by Stripe</span>
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}

export default CheckoutPage;