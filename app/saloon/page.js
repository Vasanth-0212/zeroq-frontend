"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "sonner";

const TABS = ["Bookings", "Staff"];

const BookingsPage = () => {
  const [activeTab, setActiveTab] = useState("Bookings");
  const [saloonId, setSaloonId] = useState(null);
  const [saloonName, setSaloonName] = useState("");
  const [bookings, setBookings] = useState([]);
  const [filteredBookings, setFilteredBookings] = useState([]);
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [statusUpdate, setStatusUpdate] = useState("");
  const [staffList, setStaffList] = useState([]);
  const [newStaff, setNewStaff] = useState({ name: "", saloonId: "" });

  useEffect(() => {
    const queryParams = new URLSearchParams(window.location.search);
    const id = queryParams.get("id");
    if (id) {
      setSaloonId(id);
      setNewStaff((prev) => ({ ...prev, saloonId: id }));
    };
  }, []);

  useEffect(() => {
    if (!saloonId) return;

    axios
      .get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/bookings/get-bookings/saloon/${saloonId}`)
      .then((response) => {
        setBookings(response.data);
        if (response.data.length > 0) {
          setSaloonName(response.data[0].saloonId.business);
        }
        setFilteredBookings(response.data);
      })
      .catch((error) => {
        console.error("Error fetching bookings:", error);
      });

    axios
      .get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/staff/saloon/get-staff/${saloonId}`)
      .then((response) => setStaffList(response.data))
      .catch((err) => console.error("Error fetching staff:", err));
  }, [saloonId]);

  useEffect(() => {
    if (selectedDate) {
      const filtered = bookings.filter((b) => b.date.startsWith(selectedDate));
      setFilteredBookings(filtered);
    } else {
      setFilteredBookings(bookings);
    }
  }, [selectedDate, bookings]);

  const handleStatusUpdate = async () => {
    try {
      await axios.put(`${process.env.NEXT_PUBLIC_BACKEND_URL}/bookings/update-status/${selectedBooking._id}`, {
        status: statusUpdate,
      });
      toast("Status updated!");
      const response = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/bookings/get-bookings/saloon/${saloonId}`);
      setBookings(response.data);
      setSelectedBooking(null);
    } catch (error) {
      console.error("Error updating status:", error);
    }
  };

  const handleCreateStaff = async () => {
    try {
      await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/staff/saloon/create`, {
        saloonId,
        ...newStaff,
      });
      toast("Staff member added!");
      const response = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/staff/saloon/get-staff/${saloonId}`);
      setStaffList(response.data);
      setNewStaff({ name: "", saloonId: saloonId });
    } catch (err) {
      console.error("Error creating staff:", err);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 via-white to-blue-200 py-10 px-4">
      <h1 className="text-3xl font-extrabold text-blue-500 mb-6">{saloonName} Dashboard</h1>

      <div className="flex gap-4 mb-6">
        {TABS.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 rounded-full text-sm font-medium shadow ${activeTab === tab
                ? "bg-blue-500 text-white"
                : "bg-white text-gray-800 hover:bg-indigo-100"
              }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {activeTab === "Bookings" && (
        <>
          <div className="flex justify-end space-x-2 items-center mb-4">
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="border px-3 py-2 rounded shadow"
            />
          </div>
          {filteredBookings.length === 0 ? (
            <p className="text-center text-gray-500">No bookings found.</p>
          ) : (
            <div className="overflow-x-auto bg-white rounded-xl shadow">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-blue-500 text-white">
                  <tr>
                    <th className="px-4 py-3 text-left text-sm font-semibold">Booking Id</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold">Customer Number</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold">Staff</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold">Date</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold">Time</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold">Services</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filteredBookings.map((booking) => (
                    <tr
                      key={booking._id}
                      onClick={() => {
                        setSelectedBooking(booking);
                        setStatusUpdate(booking.status);
                      }}
                      className="hover:bg-gray-50 cursor-pointer"
                    >
                      <td className="px-4 py-2">{booking?.bookingId}</td>
                      <td className="px-4 py-2">{booking.userId.phone}</td>
                      <td className="px-4 py-2">{booking?.staffId?.name ?? 'Any Staff'}</td>
                      <td className="px-4 py-2">{new Date(booking.date).toDateString()}</td>
                      <td className="px-4 py-2">{booking.time}</td>
                      <td className="px-4 py-2">{booking.services.join(", ")}</td>
                      <td className="px-4 py-2">
                        <span
                          className={`inline-block px-2 py-1 text-xs rounded-full ${booking.status === "pending"
                              ? "bg-yellow-100 text-yellow-700"
                              : "bg-green-100 text-green-700"
                            }`}
                        >
                          {booking.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </>
      )}

      {activeTab === "Staff" && (
        <div className="bg-white p-6 rounded-xl shadow">
          <h2 className="text-xl font-semibold mb-4 text-blue-500">Staff List</h2>
          <ul className="mb-6">
            {staffList.map((staff, index) => (
              <li key={staff._id} className="border-b py-2">
                {index + 1}. {staff.name}
              </li>
            ))}
          </ul>

          <h3 className="text-lg font-medium mb-2">Add New Staff</h3>
          <div className="flex gap-2 mb-4">
            <input
              type="text"
              placeholder="Name"
              value={newStaff.name}
              onChange={(e) => setNewStaff({ ...newStaff, name: e.target.value })}
              className="border px-3 py-2 rounded w-1/2"
            />
          </div>
          <button
            onClick={handleCreateStaff}
            className="bg-blue-500 hover:bg-blue-500 text-white px-4 py-2 rounded"
          >
            Add Staff
          </button>
        </div>
      )}

      {selectedBooking && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white rounded-xl shadow-xl p-6 w-[90%] md:w-[400px] relative">
            <button
              onClick={() => setSelectedBooking(null)}
              className="absolute top-2 right-2 text-gray-500 hover:text-black"
            >
              ✕
            </button>
            <h2 className="text-xl font-semibold mb-4">Booking Details</h2>
            <p><strong>Phone:</strong> {selectedBooking.userId.phone}</p>
            <p><strong>Date:</strong> {new Date(selectedBooking.date).toDateString()}</p>
            <p><strong>Time:</strong> {selectedBooking.time}</p>
            <p><strong>Services:</strong> {selectedBooking.services.join(", ")}</p>
            <div className="mt-4">
              <label className="block text-sm mb-1">Update Status:</label>
              <select
                value={statusUpdate}
                onChange={(e) => setStatusUpdate(e.target.value)}
                className="w-full border rounded px-3 py-2"
              >
                <option value="pending">Pending</option>
                <option value="accepted">Accepted</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
              </select>
              <button
                onClick={handleStatusUpdate}
                className="mt-3 w-full bg-blue-500 hover:bg-blue-500 text-white py-2 px-4 rounded"
              >
                Update Status
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BookingsPage;