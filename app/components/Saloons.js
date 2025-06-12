"use client";
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

const Saloons = () => {
  const router = useRouter();
  const [saloons, setSaloons] = useState([]);

  useEffect(() => {
    const fetchContactRequests = async () => {
      try {
        const response = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/`);
        setSaloons(response.data.filter(saloon => saloon.status === 'client'));
      } catch (error) {
        console.error('Error fetching Saloons:', error);
      }
    };

    fetchContactRequests();
  }, []);

  return (
    <div className="p-4 bg-gradient-to-br from-white via-sky-100 to-blue-100  space-x-2">
      <div className='flex space-x-3 items-center'>
        <h2 className="text-xl font-semibold mb-4">Salons</h2>
        <p
          className="font-serif text-sm mb-3 cursor-pointer text-blue-600"
          onClick={() => router.push('/all-saloons')}
        >View All Salons {">"} </p>
      </div>

      <div
        className="flex overflow-x-auto bg-transparent space-x-4 hide-scrollbar"
      >
        {saloons.map((saloon) => (
          <div
            key={saloon._id}
            onClick={() => router.push(`/all-saloons/saloon?id=${saloon._id}`)}
            className="min-w-[300px] bg-white rounded-2xl p-4 flex-shrink-0 cursor-pointer"
          >
            <Image
              src="/images/saloon.png"
              alt="Saloon"
              width={300}
              height={160}
              className="rounded-xl mb-3 w-full h-40 object-cover"
            />
            <h3 className="text-lg font-bold mb-2">{saloon.business}</h3>
            <a
              href={saloon.location}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 text-sm mt-2 inline-block"
            >
              View Location
            </a>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Saloons;
