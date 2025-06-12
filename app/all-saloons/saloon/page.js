/* eslint-disable react-hooks/exhaustive-deps */
"use client"
import React, { useState, useEffect } from 'react'
import axios from 'axios'
import Login from '../../components/Login'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { DatePicker } from '@/components/ui/datepicker';
import { X } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'

const Saloon = () => {
  const router = useRouter()
  const [saloonId, setSaloonId] = useState(null)
  const [services, setServices] = useState([])
  const [cart, setCart] = useState([])
  const [date, setDate] = useState('')
  const [time, setTime] = useState('')
  const [isLoginOpen, setIsLoginOpen] = useState(false)
  const [userId, setUserId] = useState("")
  const [saloonStaff, setSaloonStaff] = useState([])
  const [selectedStaff, setSelectedStaff] = useState(null)
  const [showCart, setShowCart] = useState(false)

  useEffect(() => {
    const storedUserId = localStorage.getItem('userId')
    if (storedUserId) setUserId(storedUserId.replace(/"/g, ''))
  }, [isLoginOpen])

  useEffect(() => {
    const queryParams = new URLSearchParams(window.location.search)
    const id = queryParams.get("id")
    if (id) setSaloonId(id)
  }, [])

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/all-saloons/saloon/${saloonId}`);
        const data = await response.json();
        setServices(data.services || []);
      } catch (err) {
        console.error('Error fetching services:', err);
      }
    };

    const fetchStaff = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/staff/saloon/get-staff/${saloonId}`);
        const data = await response.json();
        setSaloonStaff(data || []);
      } catch (err) {
        console.error('Error fetching staff:', err);
      }
    };

    if (saloonId) {
      fetchServices();
      fetchStaff();
    }
  }, [saloonId])

  const addToCart = (service) => {
    if (!cart.some(item => item._id === service._id)) {
      setCart(prev => [...prev, service])
    }
  }

  const removeFromCart = (id) => {
    setCart(prev => prev.filter(item => item._id !== id))
  }

  const getTotalPrice = () => cart.reduce((sum, item) => sum + item.startingPrice, 0)

  const handleBooking = async () => {
  if (cart.length === 0 || !date || !time) {
    toast("Please complete all fields.")
    return
  }

  const bookingDetails = {
    userId,
    saloonId,
    bookingId: Math.floor(Math.random() * 100000),
    services: cart.map(item => item.name),
    date,
    time,
  }

  if (selectedStaff && selectedStaff !== "select" && selectedStaff !== "") {
    bookingDetails.staffId = selectedStaff
  }

  try {
    const response = await axios.post(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/bookings/book-appointment`,
      bookingDetails
    )

    if (response.status === 200) {
      setCart([])
      setDate('')
      setTime('')
      setSelectedStaff('')
      router.push(`/success?bookingId=${bookingDetails.bookingId}`)
    } else {
      
      toast("Failed to book appointment. Try again.")
    }
  } catch (err) {
    console.error(err)
    toast("Error booking appointment.")
  }
}


  const getAvailableTimeSlots = () => {
    const slots = []

    if (!date) return slots // no date selected

    const now = new Date()
    const selected = new Date(date)

    // Reset time to midnight for comparison
    const nowDate = new Date(now.getFullYear(), now.getMonth(), now.getDate())
    const selectedDate = new Date(selected.getFullYear(), selected.getMonth(), selected.getDate())

    if (selectedDate < nowDate) {
      return slots // past date — no time slots
    }

    let startIndex = 0

    const isToday = selectedDate.getTime() === nowDate.getTime()

    if (isToday) {
      const currentHour = now.getHours()
      const currentMinute = now.getMinutes()
      startIndex = currentHour < 9 ? 0 : Math.ceil(((currentHour - 9) * 60 + currentMinute) / 30)
    }

    for (let i = startIndex; i < 28; i++) {
      const h = 9 + Math.floor(i / 2)
      const m = i % 2 === 0 ? "00" : "30"
      const val = `${h.toString().padStart(2, '0')}:${m}`
      const lbl = h < 12 ? `${h}:${m} AM` : h === 12 ? `${h}:${m} PM` : `${h - 12}:${m} PM`
      slots.push(<SelectItem key={val} value={val}>{lbl}</SelectItem>)
    }

    return slots
  }

  const today = new Date()
  today.setHours(0, 0, 0, 0)

  return (
    <div className="bg-gradient-to-br from-blue-100 via-white to-blue-50 min-h-screen p-4">
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="col-span-2">
          <h1 className="text-3xl font-bold mb-6 text-gray-800">Available Services</h1>
          <div className="space-y-4">
            {services.map(service => {
              const isInCart = cart.some(item => item._id === service._id)
              return (
                <div key={service._id} className="bg-white p-5 rounded-xl shadow flex justify-between items-center">
                  <div>
                    <h2 className="text-lg font-semibold text-gray-800">{service.name}</h2>
                    <p className="text-sm text-gray-600">Start from ₹{service.startingPrice}</p>
                  </div>
                  <Button
                    onClick={() => addToCart(service)}
                    disabled={isInCart}
                    variant={isInCart ? "secondary" : "default"}
                    className={`${isInCart ? 'bg-gray-300 text-gray-700' : 'bg-blue-500 text-white'}`}
                  >
                    {isInCart ? 'Added' : 'Add Service'}
                  </Button>
                </div>
              )
            })}
            {services.length === 0 && <p className="text-center text-gray-500">No services available</p>}
          </div>
        </div>

        {/* Cart Drawer for Desktop */}
        <div className={`bg-white p-6 rounded-xl shadow-lg transition-all duration-300 ${showCart ? 'block' : 'hidden'} lg:block`}>
          <h2 className="text-2xl font-bold mb-4">Cart</h2>
          {cart.length === 0 ? (
            <p className="text-gray-600">No services added</p>
          ) : (
            <>
              <div className="space-y-4 overflow-y-auto max-h-56 pr-1">
                {cart.map(item => (
                  <div key={item._id} className="flex justify-between border-b pb-2">
                    <div>
                      <p className="font-medium text-gray-800 text-sm">{item.name}</p>
                      <p className="text-xs text-gray-500">₹{item.startingPrice}</p>
                    </div>
                    <Button variant="ghost" onClick={() => removeFromCart(item._id)} className="text-red-500 text-sm">Remove</Button>
                  </div>
                ))}
              </div>

              <div className="mt-4 space-y-4">
                <DatePicker
                  date={date ? new Date(date) : null}
                  setDate={(d) => setDate(d ? d.toLocaleDateString("sv-SE") : "")}
                />

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <Select onValueChange={setTime} value={time}>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select Time" />
                      </SelectTrigger>
                      <SelectContent>
                        {getAvailableTimeSlots()}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Select onValueChange={setSelectedStaff} value={selectedStaff}>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select Staff" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value={null}>Any Staff</SelectItem>
                        {saloonStaff.map(staff => (
                          <SelectItem key={staff._id} value={staff._id}>{staff.name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="flex justify-between text-lg font-semibold">
                  <span>Total</span>
                  <span>₹{getTotalPrice()}</span>
                </div>

                <Button
                  className="w-full bg-green-500 hover:bg-green-600"
                  onClick={() => { if (!userId) setIsLoginOpen(true); else handleBooking() }}
                >
                  Book Appointment
                </Button>
              </div>
            </>
          )}
        </div>

        {/* Mobile Slide-In Cart */}
        {showCart && (
          <div className="lg:hidden fixed inset-0 z-50 flex">
            {/* Overlay */}
            <div
              className="fixed inset-0 bg-black/70 backdrop-blur-sm"
            />

            {/* Animated Panel */}
            <div
              className={`relative ml-auto h-full w-full sm:w-[90%] bg-white p-6 shadow-lg animate-slideIn`}
            >
              <div className="flex justify-between items-center mb-7">
                <h2 className="text-2xl font-bold">Cart</h2>
                <X className='text-gray-800 '
                  onClick={() => setShowCart(false)}
                />
              </div>
              {cart.length === 0 ? (
                <p className="text-gray-600">No services added</p>
              ) : (
                <>
                  <div className="space-y-4 overflow-y-auto max-h-56 pr-1">
                    <p className="text-gray-600">Selected Services</p>
                    {cart.map(item => (
                      <div key={item._id} className="flex justify-between border-b pb-2">
                        <div>
                          <p className="font-medium text-gray-800 text-sm">{item.name}</p>
                          <p className="text-xs text-gray-500">₹{item.startingPrice}</p>
                        </div>
                        <Button variant="ghost" onClick={() => removeFromCart(item._id)} className="text-red-500 text-sm">Remove</Button>
                      </div>
                    ))}
                  </div>

                  <div className="mt-4 space-y-4">
                    <DatePicker
                      date={date ? new Date(date) : null}
                      setDate={(d) => setDate(d ? d.toLocaleDateString("sv-SE") : "")}
                    />
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <Select onValueChange={setTime} value={time}>
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Select Time" />
                          </SelectTrigger>
                          <SelectContent>
                            {getAvailableTimeSlots()}
                          </SelectContent>
                        </Select>
                      </div>

                      <div>
                        <Select onValueChange={setSelectedStaff} value={selectedStaff}>
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Select Staff" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value={null}>Any Staff</SelectItem>
                            {saloonStaff.map(staff => (
                              <SelectItem key={staff._id} value={staff._id}>{staff.name}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="flex justify-between text-lg font-semibold">
                      <span>Total</span>
                      <span>₹{getTotalPrice()}</span>
                    </div>

                    <Button
                      className="w-full bg-green-500 hover:bg-green-600"
                      onClick={() => { if (!userId) setIsLoginOpen(true); else handleBooking() }}
                    >
                      Book Appointment
                    </Button>
                  </div>
                </>
              )}
            </div>
          </div>
        )}
        {/* Cart Toggle Button (Mobile) */}
        {!showCart && (
          <div className="lg:hidden fixed bottom-0 left-0 w-full border-t bg-white shadow p-3 z-40">
            <Button className="w-full bg-blue-500" onClick={() => setShowCart(!showCart)}>
              {`View Cart (${cart.length})`}
            </Button>
          </div>
        )}
      </div>
      {isLoginOpen && <Login setIsLoginOpen={setIsLoginOpen} />}
    </div>
  )
}

export default Saloon