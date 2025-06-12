"use client"
import React, { useState } from "react"
import { Button } from "@/components/ui/button"
import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { X } from "lucide-react"
import { useRouter } from "next/navigation"
import axios from "axios";
import { usePathname } from "next/navigation"
import { toast } from "sonner"

export default function Login({ setIsLoginOpen }) {
    const router = useRouter()
    const [mobile, setMobile] = useState("")
    // const [otp, setOtp] = useState("")
    // const [step, setStep] = useState("input")
    const pathname = usePathname()

    const handleLogin = async () => {
        axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/contactUs/login` , {
            phone: mobile,
        })
            .then((response) => {
                if (response.status === 200) {
                    toast('Login successful')
                    setIsLoginOpen(false)
                    localStorage.setItem('userId', response.data.user._id)
                    if (response.data.user.status === 'client') {
                        localStorage.setItem('role', 'business-partner')
                    }
                    else {
                        localStorage.setItem('role', response.data.user.role)
                    }
                    if (pathname === '/'){
                        window.location.reload();
                    }
                } else {
                    toast('Login failed, please try again')
                }
            })
            .catch((error) => {
                console.error("Login error:", error)
                toast('Login failed, please try again')
            })
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
            <Card className="w-[90%] md:min-w-[500px] md:w-[500px] max-w-md">
                <CardHeader className="flex items-center justify-between">
                    <CardTitle className="text-xl">Login with Phone</CardTitle>
                    <X className="cursor-pointer" onClick={() => setIsLoginOpen(false)} />
                </CardHeader>

                <CardContent className="space-y-4">
                    <div>
                        <Label className="mb-2" htmlFor="mobile">Mobile Number</Label>
                        <Input
                            id="mobile"
                            placeholder="Enter 10-digit mobile number"
                            value={mobile}
                            onChange={(e) => setMobile(e.target.value)}
                        />
                    </div>

                    {/* OTP UI - Commented Out */}
                    {/*
                    {step === "otp" && (
                        <div>
                            <Label className="mb-2" htmlFor="otp">OTP</Label>
                            <InputOTP maxLength={6}>
                                <InputOTPGroup>
                                    <InputOTPSlot index={0} />
                                    <InputOTPSlot index={1} />
                                    <InputOTPSlot index={2} />
                                </InputOTPGroup>
                                <InputOTPSeparator />
                                <InputOTPGroup>
                                    <InputOTPSlot index={3} />
                                    <InputOTPSlot index={4} />
                                    <InputOTPSlot index={5} />
                                </InputOTPGroup>
                            </InputOTP>
                        </div>
                    )}
                    */}
                </CardContent>

                <CardFooter className="flex justify-end space-x-4">
                    <Button onClick={handleLogin}>Login</Button>
                </CardFooter>
            </Card>
        </div>
    )
}
