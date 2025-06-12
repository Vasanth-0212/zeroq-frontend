"use client";
import { useState, useEffect } from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

export default function ContactForm() {
    const router = useRouter();
    const [form, setForm] = useState({
        name: '',
        business: '',
        phone: '',
        email: '',
        location: '',
    });

    const handleChange = (e) => {
        setForm({ ...form, [e.target.id]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        axios.post(`http://localhost:8000/contactUs`, form)
            .then(response => {
                if (response.status === 200) {
                    toast('Form submitted successfully!');
                    setForm({
                        name: '',
                        business: '',
                        phone: '',
                        email: '',
                        location: ''
                    })
                    router.push('/');
                }
                else if (response.status === 401) {
                    toast('Error: Unauthorized!');
                }
            })
    };

    return (
        <div id="contact" className="min-h-screen bg-gradient-to-br from-blue-100 via-sky-100 to-blue-200 flex flex-col md:flex-row items-center justify-center p-6">
            <div className="w-[50%] flex flex-col items-center my-10">
                <div className="w-full text-center">
                    <h1 className="text-2xl sm:text-4xl md:text-5xl font-extrabold text-gray-800 leading-snug sm:leading-tight">
                        Get in Touch<br />
                        <span className="text-blue-500">To</span><br />
                        Grow Your Business
                    </h1>
                </div>
            </div>

            <div className="bg-white/80 backdrop-blur-lg shadow-2xl rounded-3xl p-8 w-full max-w-lg">
                <form onSubmit={handleSubmit} className="space-y-6">
                    <Input
                        className="border border-gray-400"
                        placeholder="Name"
                        id="name"
                        type="text"
                        value={form.name}
                        onChange={handleChange}
                    />
                    <Input
                        id="business"
                        className="border border-gray-400"
                        placeholder="Business Name"
                        value={form.business}
                        onChange={handleChange}
                    />
                    <Input
                        id="email"
                        className="border border-gray-400"
                        placeholder="Email"
                        value={form.email}
                        onChange={handleChange}
                    />
                    <Input
                        id="phone"
                        type="text"
                        className="border border-gray-400"
                        placeholder="Mobile"
                        value={form.phone}
                        onChange={handleChange}
                    />
                    <Input
                        id="location"
                        className="border border-gray-400"
                        placeholder="Location"
                        type="url"
                        value={form.location}
                        onChange={handleChange}
                    />

                    <Button
                        type="submit"
                        className="w-full bg-blue-500 text-white py-2 rounded-xl text-lg font-semibold hover:bg-blue-600 transition"
                    >
                        Submit
                    </Button>
                </form>
            </div>
        </div>
    );
}