'use client'

import { useState } from "react"
import CheckoutPage from "@/components/CheckoutPage"
import SchoolDetailRegister from "@/components/SchoolDetailRegister"
import convertToSubcurrency from "@/lib/convertToSubcurrency"
import { Elements } from "@stripe/react-stripe-js"
import { loadStripe } from "@stripe/stripe-js"
import { ShieldCheck, CreditCard, School, ArrowRight } from "lucide-react"

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY)

function Payment() {
  const [step, setStep] = useState(1)
  const amount = 50.00

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="mb-12 text-center">
          <School className="w-12 h-12 text-blue-700 mx-auto mb-4" />
          <h1 className="text-4xl font-extrabold mb-4">
            Register Your School on <span className="text-blue-700">Scholar Scores</span>
          </h1>
          
          <div className="flex justify-center items-center gap-4 mt-8 mb-12">
            <div className={`flex items-center gap-2 px-4 py-2 rounded-lg ${
              step === 1 ? 'bg-blue-50 text-blue-700' : 'text-gray-500'
            }`}>
              <School className="w-5 h-5" />
              <span className="font-medium">School Details</span>
            </div>
            <ArrowRight className="w-4 h-4 text-gray-400" />
            <div className={`flex items-center gap-2 px-4 py-2 rounded-lg ${
              step === 2 ? 'bg-blue-50 text-blue-700' : 'text-gray-500'
            }`}>
              <CreditCard className="w-5 h-5" />
              <span className="font-medium">Payment</span>
            </div>
          </div>
        </div>

        {step === 1 ? (
          <div className="max-w-2xl mx-auto">
            <SchoolDetailRegister onSuccess={() => setStep(2)} />
          </div>
        ) : (
          <div>
            <div className="flex justify-center gap-8 mb-8">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-6 h-6 text-green-600" />
                <span className="text-gray-600">Secure Payment</span>
              </div>
              <div className="flex items-center gap-2">
                <CreditCard className="w-6 h-6 text-blue-600" />
                <span className="text-gray-600">Major Cards Accepted</span>
              </div>
            </div>
            
            <Elements
              stripe={stripePromise}
              options={{
                mode: "payment",
                amount: convertToSubcurrency(amount),
                currency: "usd",
              }}
            >
              <CheckoutPage amount={amount} />
            </Elements>
          </div>
        )}
      </div>
    </div>
  )
}

export default Payment