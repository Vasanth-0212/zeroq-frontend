"use client"

import { useSearchParams, useRouter } from "next/navigation"
import { CheckCircle2 } from "lucide-react"
import { Button } from "@/components/ui/button"

const SuccessPage = () => {
  const searchParams = useSearchParams()
  const router = useRouter()
  const bookingId = searchParams.get("bookingId")

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 via-white to-blue-50 flex flex-col justify-center items-center px-4 text-center">
      <CheckCircle2 className="w-16 h-16 text-green-500 mb-4" />
      <h1 className="text-3xl font-bold text-gray-800 mb-2">Appointment Confirmed!</h1>
      <p className="text-gray-600 text-base max-w-md mb-6">
        Thank you for booking with us. We look forward to seeing you!
      </p>

      <div className="bg-white p-4 rounded-xl shadow-md w-full max-w-md mb-6">
        <p className="text-gray-700 font-medium">Your Booking ID:</p>
        <p className="text-blue-600 text-xl font-semibold break-words">{bookingId || "N/A"}</p>
      </div>

      <Button
        className="bg-blue-500 text-white hover:bg-blue-600 w-full max-w-xs"
        onClick={() => router.push('/')}
      >
        Go to Home
      </Button>
    </div>
  )
}

export default SuccessPage
