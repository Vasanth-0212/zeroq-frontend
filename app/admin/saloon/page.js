"use client"
import React from 'react';
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import ServiceForm from './serviceForm';
import { useRouter } from 'next/navigation';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

const page = () => {

  const [isOpen, setIsOpen] = useState(false);
  const [saloonId, setSaloonId] = useState("");
  const [services, setServices] = useState([]);
  const router = useRouter();

  useEffect(() => {
    const queryParams = new URLSearchParams(window.location.search);
    const id = queryParams.get("id");
    if (id) {
      setSaloonId(id);
    }
  }, []);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const response = await fetch(`http://localhost:8000/admin/saloon/${saloonId}`);
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        setServices(data);
      } catch (error) {
        console.error('Error fetching services:', error);
      }
    }
    if (saloonId) {
      fetchServices();
    }
  },[saloonId, isOpen]);

  return (
    <div className='h-full w-full overflow-x-hidden overflow-y-auto'>
      <div>
        <Button className="absolute top-10 right-10"
          onClick={() => setIsOpen(true)}
        >Create Service</Button>
      </div>
      <div className="absolute top-20 w-screen flex flex-col items-center justify-center">
        <h1 className="text-2xl font-bold mb-4">Services</h1>
        <div className="w-full max-w-4xl">
          <Table className="border rounded-2xl">
            <TableCaption>List of Services</TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Starting Price</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {services.map((service) => (
                <TableRow key={service._id}>
                  <TableCell>{service.name}</TableCell>
                  <TableCell>{service.description}</TableCell>
                  <TableCell>₹{service.startingPrice}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
      {isOpen && (
        <ServiceForm saloonId={saloonId} isOpen={isOpen} setIsOpen={setIsOpen} />
      )}
    </div>
  )
}

export default page