"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { DatePicker } from '@/components/ui/datepicker';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import ConfirmationCard from "../components/cancelConfirmationCard";

const STATUS_TABS = ["Awaiting", "Today", "Upcoming", "Past", "Cancelled"];

const UserBookingsPage = () => {
    const [bookings, setBookings] = useState([]);
    const [activeTab, setActiveTab] = useState("Today");
    const [filtered, setFiltered] = useState([]);
    const [userId, setUserId] = useState(null);
    const [rescheduleId, setRescheduleId] = useState(null);
    const [date, setDate] = useState('');
    const [time, setTime] = useState('');
    const [isConfirmOpen, setIsConfirmOpen] = useState(false);
    const [selectedBookingId, setSelectedBookingId] = useState(null);


    useEffect(() => {
        const queryParams = new URLSearchParams(window.location.search);
        const id = queryParams.get("customer");
        if (id) setUserId(id);
    }, []);

    useEffect(() => {
        if (!userId) return;
        axios
            .get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/bookings/get-bookings/user/${userId}`)
            .then((response) => {
                setBookings(response.data);
                setFiltered(response.data);
            })
            .catch((error) => {
                console.error("Error fetching bookings:", error);
            });
    }, [userId]);

    useEffect(() => {
        const todayStr = new Date().toISOString().split("T")[0];
        const filteredData = bookings.filter((booking) => {
            const bookingDate = booking.date.split("T")[0];
            switch (activeTab) {
                case "Awaiting":
                    return booking.status === "pending";
                case "Today":
                    return bookingDate === todayStr;
                case "Upcoming":
                    return bookingDate > todayStr && booking.status !== "cancelled";
                case "Past":
                    return bookingDate < todayStr && booking.status !== "cancelled";
                case "Cancelled":
                    return booking.status === "cancelled";
                default:
                    return true;
            }
        });
        setFiltered(filteredData);
    }, [activeTab, bookings]);

    const getCount = (status) => {
        const todayStr = new Date().toISOString().split("T")[0];
        return bookings.filter((booking) => {
            const bookingDate = booking.date.split("T")[0];
            switch (status) {
                case "Awaiting":
                    return booking.status === "pending";
                case "Today":
                    return bookingDate === todayStr;
                case "Upcoming":
                    return bookingDate > todayStr && booking.status !== "cancelled";
                case "Past":
                    return bookingDate < todayStr && booking.status !== "cancelled";
                case "Cancelled":
                    return booking.status === "cancelled";
                default:
                    return false;
            }
        }).length;
    };

    const handleReschedule = (id) => {
        if (!date || !time) return;
        axios
            .put(`${process.env.NEXT_PUBLIC_BACKEND_URL}/bookings/update-booking/reschedule/${id}`, {
                date,
                time,
            })
            .then(() => {
                setDate('');
                setTime('');
                setRescheduleId(null);
                return axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/bookings/get-bookings/user/${userId}`);
            })
            .then((response) => setBookings(response.data))
            .catch((error) => {
                console.error("Error rescheduling:", error);
            });
    };

    const handleCancel = () => {
        axios
            .put(`${process.env.NEXT_PUBLIC_BACKEND_URL}/bookings/update-booking/cancel/${selectedBookingId}`)
            .then(() => {
                setIsConfirmOpen(false);
                return axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/bookings/get-bookings/user/${userId}`);
            })
            .then((response) => setBookings(response.data))
            .catch((error) => {
                console.error("Error cancelling booking:", error);
            });
    };

    return (
        <div className="p-6 bg-gradient-to-br from-blue-100 via-sky-100 to-white min-h-screen">
            <h1 className="text-3xl font-extrabold text-blue-500 mb-6">Your Bookings</h1>

            <div className="flex flex-wrap gap-3 mb-8">
                {STATUS_TABS.map((tab) => (
                    <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={`px-4 py-2 rounded-full text-sm font-medium shadow transition ${activeTab === tab
                            ? "bg-blue-400 text-white"
                            : "bg-white text-gray-800 hover:bg-indigo-100"
                            }`}
                    >
                        {tab} ({getCount(tab)})
                    </button>
                ))}
            </div>

            {filtered.length === 0 ? (
                <p className="text-gray-500 text-center">No bookings in this category.</p>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filtered.map((booking) => {
                        const bookingDate = new Date(booking.date);
                        const formattedDate = bookingDate.toLocaleDateString(undefined, {
                            weekday: "short",
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                        });

                        return (
                            <div
                                key={booking._id}
                                className="bg-white border border-gray-200 p-5 rounded-2xl shadow-md hover:shadow-lg transition w-full flex flex-col justify-between"
                            >
                                {/* Top: Salon & Status */}
                                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
                                    <div>
                                        <h2 className="font-semibold text-blue-500 text-lg">{booking.saloonId?.business || "Salon"}</h2>
                                        <p className="text-sm text-gray-500">{formattedDate} at {booking.time}</p>
                                    </div>
                                    <span
                                        className={`px-3 py-1 text-xs font-semibold rounded-full w-max ${booking.status === "pending"
                                            ? "bg-yellow-100 text-yellow-800"
                                            : booking.status === "cancelled"
                                                ? "bg-red-100 text-red-800"
                                                : "bg-green-100 text-green-800"
                                            }`}
                                    >
                                        {booking.status}
                                    </span>
                                </div>

                                {/* Services */}
                                <p className="text-sm text-gray-700 mt-3">
                                    <span className="font-medium text-gray-800">Services:</span> {booking.services.join(", ")}
                                </p>

                                {/* Actions */}
                                <div className="mt-5 space-y-4 sm:space-y-0 sm:flex sm:justify-between sm:items-end">
                                    {/* Reschedule */}
                                    {activeTab === "Upcoming" && (
                                        <div className="sm:w-1/2">
                                            {rescheduleId === booking._id ? (
                                                <div className="space-y-4">
                                                    <div className="md:w-full grid grid-cols-1 sm:grid-cols-2 md:flex md:justify-between gap-3">
                                                        <DatePicker
                                                            date={date ? new Date(date) : null}
                                                            setDate={(d) => setDate(d ? d.toISOString().slice(0, 10) : "")}
                                                        />
                                                        <Select onValueChange={setTime} value={time}>
                                                            <SelectTrigger className="w-full">
                                                                <SelectValue placeholder="Select Time" />
                                                            </SelectTrigger>
                                                            <SelectContent>
                                                                {Array.from({ length: 28 }, (_, i) => {
                                                                    const h = 9 + Math.floor(i / 2);
                                                                    const m = i % 2 === 0 ? "00" : "30";
                                                                    const val = `${h.toString().padStart(2, "0")}:${m}`;
                                                                    const lbl =
                                                                        h < 12
                                                                            ? `${h}:${m} AM`
                                                                            : h === 12
                                                                                ? `${h}:${m} PM`
                                                                                : `${h - 12}:${m} PM`;
                                                                    return (
                                                                        <SelectItem key={val} value={val}>
                                                                            {lbl}
                                                                        </SelectItem>
                                                                    );
                                                                })}
                                                            </SelectContent>
                                                        </Select>
                                                    </div>

                                                    <div className="flex justify-end gap-2">
                                                        <button
                                                            className="px-4 py-2 rounded text-sm text-gray-600 hover:text-black"
                                                            onClick={() => {
                                                                setRescheduleId(null);
                                                                setDate("");
                                                                setTime("");
                                                            }}
                                                        >
                                                            Cancel
                                                        </button>
                                                        <button
                                                            className="px-4 py-2 rounded bg-blue-500 w-auto text-white text-sm hover:bg-blue-400"
                                                            onClick={() => handleReschedule(booking._id)}
                                                        >
                                                            Save Changes
                                                        </button>
                                                    </div>
                                                </div>
                                            ) : (
                                                <button
                                                    onClick={() => {
                                                        setRescheduleId(booking._id);
                                                        setDate("");
                                                        setTime("");
                                                    }}
                                                    className="text-sm font-semibold text-white bg-blue-500 hover:bg-blue-600 px-4 py-2 rounded"
                                                >
                                                    Reschedule
                                                </button>
                                            )}
                                        </div>
                                    )}

                                    {/* Cancel Booking */}
                                    {(activeTab === "Upcoming" || activeTab === "Today") && booking.status !== "cancelled" && (
                                        <div className="sm:w-auto">
                                            <button
                                                onClick={() => {
                                                    setIsConfirmOpen(true);
                                                    setSelectedBookingId(booking._id);
                                                }}
                                                className="text-sm font-semibold text-white bg-red-500 hover:bg-red-600 px-4 py-2 rounded"
                                            >
                                                Cancel Booking
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
            {isConfirmOpen && (
                <ConfirmationCard
                    onClose={() => setIsConfirmOpen(false)}
                    onConfirm={() => handleCancel(selectedBookingId)}
                />
            )}

        </div>
    );
};

export default UserBookingsPage;
