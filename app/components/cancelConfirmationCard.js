"use client"
import React from "react"
import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { X } from "lucide-react"

export default function ConfirmationCard({ onClose, onConfirm }) {
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
            <Card className="w-[90%] md:min-w-[500px] md:w-[500px] max-w-md">
                <CardHeader className="flex items-center justify-between">
                    <CardTitle className="text-xl">Cancel Booking</CardTitle>
                    <X className="cursor-pointer" onClick={onClose} />
                </CardHeader>

                <CardContent className="text-gray-700 text-base">
                    Are you sure you want to cancel this booking?
                </CardContent>

                <CardFooter className="flex justify-end space-x-4">
                    <Button variant="outline" onClick={onClose}>
                        No
                    </Button>
                    <Button onClick={onConfirm}>Yes, Cancel</Button>
                </CardFooter>
            </Card>
        </div>
    )
}
