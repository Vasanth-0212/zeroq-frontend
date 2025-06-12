"use client";
import React, { useState, useEffect } from 'react';
import Image from 'next/image';

const images = [
  {
    url: '/images/saloon.png',
    tagline: 'Book your next haircut',
  },
  {
    url: '/images/massage.png',
    tagline: 'Book your next massage',
  },
  {
    url: '/images/facial.png',
    tagline: 'Book your next facial',
  },
];

const Search = () => {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % images.length);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="w-full flex flex-col items-center justify-center mt-[80px] ">
      <div className="relative w-full h-64 md:h-96">
        <Image
          src={images[index].url}
          alt={images[index].tagline}
          layout="fill"
          objectFit="cover"
          priority
          className="rounded-lg"
        />
        <div className="absolute inset-0 bg-transparent bg-opacity-50 flex flex-col items-center justify-center">
          <h1 className="text-white text-xl md:text-3xl lg:text-5xl font-bold text-center px-4">
            {images[index].tagline}
          </h1>
        </div>
      </div>

      {/* <button className="mt-6 px-6 py-3 bg-blue-600 text-white rounded-full text-sm md:text-base hover:bg-blue-700 transition">
        Search
      </button> */}
    </div>
  );
};

export default Search;
