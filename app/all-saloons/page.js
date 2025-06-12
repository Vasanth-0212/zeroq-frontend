"use client"
import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { MapPin, ExternalLink, LocateFixed } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from 'sonner'


const Saloons = () => {
  const router = useRouter()
  const [saloons, setSaloons] = useState([])
  const [filteredSaloons, setFilteredSaloons] = useState([])
  const [userLocation, setUserLocation] = useState({ lat: null, lng: null })
  const [loading, setLoading] = useState(false);
  const [locationGranted, setLocationGranted] = useState(false);

  useEffect(() => {
    if (!navigator.geolocation) {
      toast('Geolocation is not supported by your browser.');
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        setUserLocation({ lat: latitude, lng: longitude });
        setLocationGranted(true);
        setLoading(true);

        try {
          const response = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/all-saloons`, {
            params: { lat: latitude, lng: longitude },
          });
          setSaloons(response.data);
          setFilteredSaloons(response.data);
        } catch (error) {
          console.error('Error fetching saloons:', error);
        } finally {
          setLoading(false);
        }
      },
      (error) => {
        console.error('Geolocation error:', error.message);
        setLocationGranted(false);
        toast('Location access denied or unavailable.');
      }
    );
  }, []);


  useEffect(() => {
    const fetchSaloons = async () => {
      try {
        const response = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/all-saloons`)
        setSaloons(response.data)
        setFilteredSaloons(response.data)
      } catch (error) {
        console.error('Error fetching saloons:', error)
      }
    }

    fetchSaloons()
  }, [])

  const fetchLocationAndSaloons = () => {
    setLoading(true)
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords
        setUserLocation({ lat: latitude, lng: longitude })
        try {
          const response = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/all-saloons`, {
            params: { lat: latitude, lng: longitude },
          })
          setSaloons(response.data)
          setFilteredSaloons(response.data)
          setLocationGranted(true)
        } catch (error) {
          console.error('Error fetching saloons:', error)
        } finally {
          setLoading(false)
        }
      },
      (error) => {
        console.error('Geolocation error:', error.message)
        toast('Location access is required to fetch nearby saloons.')

        axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/all-saloons`)
          .then((res) => {
            setSaloons(res.data)
            setFilteredSaloons(res.data)
          })
          .catch((err) => console.error('Error fetching saloons:', err))
          .finally(() => setLoading(false))
      }
    )
  }

  const [search, setSearch] = useState('');
  const [selectedCity, setSelectedCity] = useState('');

  const handleUserSearch = () => {
    const filtered = saloons.filter((saloon) => {
      const isCityMatch = selectedCity ? saloon.city === selectedCity : true;
      const isSearchMatch = saloon.business.toLowerCase().includes(search.toLowerCase());
      return isSearchMatch && isCityMatch;
    });
    setFilteredSaloons(filtered);
  }

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-blue-100 via-sky-100 to-white p-4 md:p-6">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl md:text-4xl font-extrabold text-center mb-8 text-sky-700 animate-pulse">Nearby Saloons</h1>

        <div className="flex flex-col sm:flex-row sm:justify-center gap-3 mb-6 animate-fade-in">
          <Input
            type="text"
            placeholder="Search saloon"
            className="flex-1 bg-white"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          <div>
            <Select disabled={locationGranted} value={selectedCity} onValueChange={setSelectedCity}>
              <SelectTrigger className="bg-white">
                <SelectValue placeholder="Select City" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Chennai">Chennai</SelectItem>
                <SelectItem value="Bangalore">Bangalore</SelectItem>
                <SelectItem value="Hyderabad">Hyderabad</SelectItem>
                <SelectItem value="Kochi">Kochi</SelectItem>
                <SelectItem value="Gurugram">Gurugram</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Button
            className="bg-sky-600 hover:bg-sky-700 text-white rounded-full"
            onClick={handleUserSearch}
          >
            Search
          </Button>
        </div>

        {!locationGranted && (
          <div className="flex justify-center mb-6">
            <Button
              onClick={fetchLocationAndSaloons}
              className="flex items-center gap-2 bg-sky-600 hover:bg-sky-700 text-white rounded-full"
            >
              <LocateFixed size={18} /> Get Nearby Saloons
            </Button>
          </div>
        )}

        {loading && <div className="text-center text-gray-700 mb-4">Loading nearby saloons...</div>}

        <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          {filteredSaloons.map((saloon) => (
            <div
              key={saloon._id}
              className="bg-white shadow-xl rounded-2xl overflow-hidden p-4 flex flex-col justify-between transition-transform hover:scale-105 hover:shadow-2xl duration-300 animate-fade-in"
            >
              <img
                src="/images/saloon.png"
                alt="Default Saloon"
                className="w-full h-40 object-cover rounded-xl mb-4"
              />

              <div className="flex flex-col space-y-2">
                <h2 className="text-xl font-bold text-sky-600 mb-2">{saloon.business}</h2>
                <p className='text-base font-semibold text-gray-700'>Location: {saloon.city}</p>
              </div>

              <div className="flex flex-wrap gap-3 mt-4">
                <a
                  href={saloon.location}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 bg-sky-100 text-sky-800 px-4 py-2 rounded-full text-sm font-medium hover:bg-sky-200 transition"
                >
                  <MapPin size={16} /> Maps
                </a>

                <button
                  onClick={() => router.push(`all-saloons/saloon?id=${saloon._id}`)}
                  className="flex items-center gap-2 bg-gray-100 text-gray-800 px-4 py-2 rounded-full text-sm font-medium cursor-pointer hover:bg-gray-200 transition"
                >
                  <ExternalLink size={16} /> View Details
                </button>
              </div>
              <div className="text-sm text-gray-500 mt-2">
                {saloon.distance ? `${saloon.distance.toFixed(2)} km away` : ''}
              </div>
            </div>
          ))}
        </div>

        {filteredSaloons.length === 0 && !loading && (
          <div className="text-center text-gray-700 mt-20">No saloons available</div>
        )}
      </div>
    </div>
  )
}

export default Saloons
