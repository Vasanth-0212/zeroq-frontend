"use client";
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';

const BusinessRequests = () => {
    const [contactRequests, setContactRequests] = useState([]);
    const router = useRouter();

    useEffect(() => {
        const fetchContactRequests = async () => {
            try {
                const response = await axios.get('http://localhost:8000/admin/business-requests');
                setContactRequests(response.data.filter(request => request.status === 'client'));
            } catch (error) {
                console.error('Error fetching contact requests:', error);
            }
        };

        fetchContactRequests();
    }, []);

    return (
        <div className="p-6 max-w-5xl mx-auto">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-center w-full">Our Clients</h1>
                <button
                    className="absolute left-6 top-6 px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400 transition"
                    onClick={() => router.push('/admin')}
                >
                    Back to Admin
                </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {contactRequests.map((request) => (
                    <div
                        key={request._id}
                        className="bg-white shadow-md rounded-2xl p-6 border border-gray-100 hover:shadow-lg transition"
                    >
                        <h2 className="text-xl font-semibold mb-2">{request.name}</h2>
                        <p><span className="font-medium">Business:</span> {request.business}</p>
                        <p><span className="font-medium">Phone:</span> {request.phone}</p>
                        <p><span className="font-medium">Email:</span> {request.email}</p>
                        <p>
                            <span className="font-medium">Location:</span>{' '}
                            <a
                                href={request.location}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-600 underline"
                            >
                                View on Map
                            </a>
                        </p>
                        <p className="text-sm text-gray-500 mt-2">
                            Submitted: {new Date(request.createdAt).toLocaleString()}
                        </p>
                        <button
                            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
                            onClick={() => {
                                router.push(`/admin/saloon?id=${request._id}`);
                            }}
                        >
                            Add / Edit Services
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default BusinessRequests;
