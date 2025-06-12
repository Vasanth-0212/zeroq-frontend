"use client";
import React from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';

const Admin = () => {
  const router = useRouter();

  return (
    <div className="h-screen w-screen flex flex-col overflow-hidden">
      <div className="bg-gray-200 p-4 text-xl font-semibold">
        Admin
      </div>
      <div className="flex flex-1">
        <div className="w-64 bg-white border-r border-gray-200 pt-4">
          <div className="flex flex-col">
            <Button
              variant="ghost"
              className="justify-start rounded-none border-b border-gray-200"
              onClick={() => router.push('/admin/dashboard')}
            >
              Dashboard
            </Button>
            <Button
              variant="ghost"
              className="justify-start rounded-none border-b border-gray-200"
              onClick={() => router.push('/admin/business-requests')}
            >
              Business Requests
            </Button>
            <Button
              variant="ghost"
              className="justify-start rounded-none border-b border-gray-200"
              onClick={() => router.push('/admin/our-clients')}
            >
              Our Clients
            </Button>
          </div>
        </div>
        <div className="flex-1 bg-gray-100 flex items-center justify-center">
          Admin Page
        </div>
      </div>
    </div>
  );
};

export default Admin;
