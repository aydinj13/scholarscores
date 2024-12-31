'use client'

import { CheckCircle, ArrowRight, School } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardContent, CardFooter } from "@/components/ui/card"
import { useEffect, useState } from "react"
import { supabase } from "@/supabaseClient"
import { useRouter } from "next/navigation"

export default function PaymentSuccess({
  searchParams: { amount, slug },
}: {
  searchParams: { amount: string; slug: string }
}) {
  const router = useRouter()
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function updatePaymentStatus() {
      try {
        const { error } = await supabase
          .from('schools')
          .update({ annual_fee_paid: true })
          .eq('slug', slug)

        if (error) throw error
      } catch (error) {
        console.error('Error updating payment status:', error)
      } finally {
        setLoading(false)
      }
    }

    updatePaymentStatus()
  }, [slug])
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white py-12 px-4">
      <div className="max-w-2xl mx-auto text-center">
        <Card className="bg-white shadow-lg">
          <CardHeader>
            <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
            <h1 className="text-3xl font-bold text-gray-900">Payment Successful!</h1>
            <p className="text-gray-500 mt-2">Your registration is now complete</p>
          </CardHeader>

          <CardContent className="space-y-6">
            <div className="bg-blue-50 p-6 rounded-lg">
              <p className="text-2xl font-semibold text-blue-700">${amount}</p>
              <p className="text-sm text-blue-600">Registration Fee (Annual)</p>
            </div>

            <div className="space-y-4 text-left">
              <h2 className="text-lg font-semibold text-gray-900">Next Steps:</h2>
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <div className="bg-blue-100 p-2 rounded-full">
                    <School className="w-5 h-5 text-blue-700" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">Set Up Your School Profile</p>
                    <p className="text-sm text-gray-500">Add additional information about your school</p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>

          <CardFooter className="flex flex-col gap-3">
            <Button className="w-full">
              Go to Dashboard
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
            <p className="text-sm text-gray-500">
              Need help? Contact our support team
            </p>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}