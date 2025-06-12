"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "sonner";
import { z } from "zod";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

const schema = z.object({
  address: z.string().min(5, "Address is required"),
  image: z.any().refine((file) => file instanceof File, "Image is required"),
});

const BusinessRequests = () => {
  const [contactRequests, setContactRequests] = useState([]);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [showDialog, setShowDialog] = useState(false);

  
  useEffect(() => {
    const fetchContactRequests = async () => {
      try {
        const response = await axios.get(
          "http://localhost:8000/admin/business-requests"
        );
        setContactRequests(
          response.data.filter((request) => request.status === "pending")
        );
      } catch (error) {
        console.error("Error fetching contact requests:", error);
      }
    };

    fetchContactRequests();
  }, []);

  const onSubmit = async (data) => {
    if (!selectedRequest) return;

    const formData = new FormData();
    formData.append("image", data.image[0]);
    formData.append("address", data.address);
    formData.append("name", selectedRequest.business);
    formData.append("phone", selectedRequest.phone);
    formData.append("role", "business-partner");

    try {
      // Upload image and get URL
      const imageUpload = await axios.post(
        "http://localhost:8000/upload",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      const imageUrl = imageUpload.data.url;

      // Update status to client
      await axios.put(
        `http://localhost:8000/admin/business-requests/${selectedRequest._id}`,
        {
          ...selectedRequest,
          status: "client",
        }
      );

      // Add saloon user
      await axios.post(`http://localhost:8000/contactUs/addUser`, {
        name: selectedRequest.business,
        phone: selectedRequest.phone,
        role: "business-partner",
        address: data.address,
        image: imageUrl,
      });

      toast("Client added successfully!");
      setShowDialog(false);
      reset();
      window.location.reload();
    } catch (error) {
      console.error(error);
      toast("Failed to add client.");
    }
  };

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <h1 className="text-2xl font-bold mb-6 text-center">Business Requests</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {contactRequests.map((request) => (
          <div
            key={request._id}
            className="bg-white shadow-md rounded-2xl p-6 border border-gray-100 hover:shadow-lg transition"
          >
            <h2 className="text-xl font-semibold mb-2">{request.name}</h2>
            <p>
              <span className="font-medium">Business:</span> {request.business}
            </p>
            <p>
              <span className="font-medium">Phone:</span> {request.phone}
            </p>
            <p>
              <span className="font-medium">Email:</span> {request.email}
            </p>
            <p>
              <span className="font-medium">Location:</span>{" "}
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
            <Button
              className="mt-4"
              onClick={() => {
                setSelectedRequest(request);
                setShowDialog(true);
              }}
            >
              Add as client
            </Button>
          </div>
        ))}
      </div>

      {/* Dialog */}
      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Client Details</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit(onSubmit)} encType="multipart/form-data">
            <div className="grid gap-4">
              <div>
                <Label htmlFor="address">Address</Label>
                <Textarea
                  id="address"
                  placeholder="Enter address"
                  {...register("address")}
                />
                {errors.address && (
                  <p className="text-sm text-red-500 mt-1">
                    {errors.address.message}
                  </p>
                )}
              </div>

              <div>
                <Label htmlFor="image">Upload Image</Label>
                <Input
                  id="image"
                  type="file"
                  accept="image/*"
                  {...register("image")}
                />
                {errors.image && (
                  <p className="text-sm text-red-500 mt-1">
                    {errors.image.message}
                  </p>
                )}
              </div>
            </div>
            <DialogFooter className="mt-4">
              <Button type="submit">Submit</Button>
              <Button
                variant="outline"
                type="button"
                onClick={() => setShowDialog(false)}
              >
                Cancel
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default BusinessRequests;
