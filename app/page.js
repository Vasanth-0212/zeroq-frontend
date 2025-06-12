"use client";
import Image from "next/image";
import Navbar from "./components/Navbar";
import ContactForm from "./components/ContactUs";
import Search from "./components/Search";
import Saloons from "./components/Saloons";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Lenis from '@studio-freight/lenis';

// components/YourBookingsBadge.tsx

function YourBookingsBadge({ role, userId }) {

  const router = useRouter();

  const handleClick = () => {
    if (role === "business-partner") {
      router.push("/saloon?id=" + userId);
    } else {
      router.push("/bookings?customer=" + userId);
    }
  };

  return (
    <div className="fixed top-24 right-4 z-50 bg-blue-600 text-white px-6 py-3 rounded-full shadow-lg cursor-pointer hover:bg-blue-700 transition-all flex items-center gap-2 w-48"
      onClick={handleClick}
    >
      <span className="flex-grow">{role === "customer" ? "Your Bookings" : "View Bookings"}</span>
      <span className="relative w-5 h-5 overflow-hidden">
        <span className="absolute animate-arrowMove">{">"}</span>
      </span>
    </div>
  );
}

export default function Home() {
  
  useEffect(() => {
    const lenis = new Lenis();
    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);
    // Cleanup function
    return () => {
      lenis.destroy();
    };
  }, []);

  

  return (
    <div>
      <div className="fixed top-0 z-50"><Navbar /></div>
      <div className="overflow-x-hidden overflow-y-auto">
        {/* {role && (
          <YourBookingsBadge role={role} userId={userId} />
        )} */}
        <Search />
        <Saloons />
        <ContactForm />
      </div>
    </div>
  );
}
