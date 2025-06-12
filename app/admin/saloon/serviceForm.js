"use client"
import React, { useState } from "react"
import { Button } from "@/components/ui/button"
import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { X } from "lucide-react"
import axios from "axios"
import { toast } from "sonner"

export default function ServiceForm({ saloonId, isOpen, setIsOpen }) {
    const [formData, setFormData] = useState({
        name: "",
        startingPrice: 0,
        description: "",
    })

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post("http://localhost:8000/admin/saloon", {
                ...formData,
                saloon: saloonId,
            });
            if (response.status === 200) {
                toast("Form submitted successfully!");
                setIsOpen(false);
            }
        }
        catch (error) {
            console.error('Error saving contact form:', error);
            toast("Error saving contact form");
        }
    }

    return (
        <div className="absolute left-0 top-0 z-50 flex h-screen min-h-screen w-full items-center justify-center bg-slate-50 bg-opacity-80">
            <Card className="h-auto max-h-[60vh] w-[42vw] absolute top-[10%] left-[30%]">
                <CardHeader className={"flex items-center justify-between"}>
                    <CardTitle className="text-xl">Create Service</CardTitle>
                    <X className="cursor-pointer" onClick={() => setIsOpen(false)} />
                </CardHeader>

                <form className="space-y-4" onSubmit={handleSubmit}>
                    <CardContent className="space-y-4">

                        <div>
                            <Label className="mb-2" htmlFor="name">Service Name</Label>
                            <Input
                                id="name"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                placeholder="Enter service name"
                            />
                        </div>

                        <div>
                            <Label className="mb-2" htmlFor="startingPrice">Starting Price</Label>
                            <Input
                                id="startingPrice"
                                type="number"
                                value={formData.startingPrice}
                                onChange={(e) => setFormData({ ...formData, startingPrice: e.target.value })}
                                placeholder="Enter starting price"
                            />
                        </div>

                        <div>
                            <Label className="mb-2" htmlFor="description">Description</Label>
                            <Input
                                id="description"
                                value={formData.description}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                placeholder="Enter service description"
                            />
                        </div>
                    </CardContent>

                    <CardFooter className="flex justify-end space-x-4">
                        <Button type="submit">
                            Create
                        </Button>
                    </CardFooter>
                </form>
            </Card>
        </div>
    )
}
