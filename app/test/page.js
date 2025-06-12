"use client";
import React, { useState, useEffect } from 'react';

function LocationComponent() {
  const [location, setLocation] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          });
          setError(null);
        },
        (error) => {
          setError(error.message);
          setLocation(null);
        }
      );
    } else {
      setError("Geolocation is not supported by this browser.");
      setLocation(null);
    }
  }, []);

  return (
    <div>
      {location ? (
        <p className='text-black text-lg'>
          Latitude: {location.latitude}, Longitude: {location.longitude}
        </p>
      ) : (
        <p className='text-black text-lg'>{error || "Loading location..."}</p>
      )}
    </div>
  );
}

export default LocationComponent;