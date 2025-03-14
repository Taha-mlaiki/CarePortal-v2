"use client";

import React, { useState, useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { X } from "lucide-react";
import Header from "../_components/Header";
import Image from "next/image";

// Zod schema for form validation
const cabinetSchema = z.object({
  username: z.string().min(2, "Username must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(10, "Phone number must be at least 10 digits"),
  contactEmail: z.string().email("Invalid contact email address"),
  specialty: z.string().min(1, "Specialty is required"),
  city: z.string().min(1, "City is required"),
  locationLink: z.string().url("Must be a valid URL"),
  address: z.string().min(5, "Address must be at least 5 characters"),
});

type CabinetFormValues = z.infer<typeof cabinetSchema>;
type ImageFile = { file: File; preview: string; id: string };

// Mock initial data
const mockCabinetData: CabinetFormValues = {
  username: "Dr. Sarah Johnson",
  email: "sarah.johnson@medclinic.com",
  phone: "555-123-4567",
  contactEmail: "contact@medclinic.com",
  specialty: "Cardiologist",
  city: "San Francisco",
  locationLink: "https://maps.google.com/?q=MedClinic+San+Francisco",
  address: "123 Health Avenue, San Francisco, CA 94107",
};

const specialtyOptions = [
  "Cardiologist",
  "Dentist",
  "Dermatologist",
  "Neurologist",
  "Oncologist",
  "Ophthalmologist",
  "Pediatrician",
  "Psychiatrist",
  "Surgeon",
  "Other",
];

export default function CabinetSettings() {
  const [isEditing, setIsEditing] = useState(false);
  const [cabinetImages, setCabinetImages] = useState<ImageFile[]>([]);
  const [thumbnailImage, setThumbnailImage] = useState<ImageFile | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<CabinetFormValues>({
    resolver: zodResolver(cabinetSchema),
    defaultValues: mockCabinetData,
  });

  // Image handling functions
  const handleCabinetImagesUpload = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (e.target.files) {
      const newImages = Array.from(e.target.files).map((file) => ({
        file,
        preview: URL.createObjectURL(file),
        id: crypto.randomUUID(),
      }));
      setCabinetImages((prev) => [...prev, ...newImages]);
    }
  };

  const handleThumbnailUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setThumbnailImage({
        file,
        preview: URL.createObjectURL(file),
        id: crypto.randomUUID(),
      });
    }
  };

  const removeCabinetImage = (id: string) => {
    setCabinetImages((prev) => prev.filter((img) => img.id !== id));
  };

  const removeThumbnailImage = () => setThumbnailImage(null);

  // Form submission
  const onSubmit = async (data: CabinetFormValues) => {
    setIsSubmitting(true);
    await new Promise((resolve) => setTimeout(resolve, 1500)); // Simulate API call
    console.log("Updated Data:", { ...data, cabinetImages, thumbnailImage });
    toast.success("Cabinet updated successfully!", {
      description: "Your changes have been saved.",
    });
    setIsSubmitting(false);
    setIsEditing(false);
  };

  // Reset form on cancel
  const handleCancel = () => {
    reset(mockCabinetData);
    setCabinetImages([]);
    setThumbnailImage(null);
    setIsEditing(false);
  };

  // Clean up object URLs
  useEffect(() => {
    return () => {
      cabinetImages.forEach((img) => URL.revokeObjectURL(img.preview));
      if (thumbnailImage) URL.revokeObjectURL(thumbnailImage.preview);
    };
  }, [cabinetImages, thumbnailImage]);

  return (
    <div className="lg:ml-64 min-h-screen p-5 md:p-10">
      <Header
        title="Manage Your Cabinet Profile"
        description="Update your personal and professional information"
      />
      <div className="w-full mx-auto max-w-4xl">
        <Card className="bg-white/90 backdrop-blur-md shadow-xl border border-gray-100">
          <CardHeader className="bg-gradient-to-r from-blue-500 to-blue-300 text-white p-6 rounded-t-lg">
            <CardTitle className="text-2xl font-bold">
              Cabinet Settings
            </CardTitle>
            <p className="text-sm opacity-80">
              Update your professional cabinet details
            </p>
          </CardHeader>
          <CardContent className="p-6">
            {!isEditing ? (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    {thumbnailImage ? (
                      <Image
                        src={thumbnailImage.preview}
                        alt="Thumbnail"
                        className="w-16 h-16 rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-16 h-16 rounded-full bg-blue-200 flex items-center justify-center text-2xl font-bold text-blue-800">
                        {mockCabinetData.username[0]}
                      </div>
                    )}
                    <div>
                      <h2 className="text-xl font-semibold text-gray-800">
                        {mockCabinetData.username}
                      </h2>
                      <p className="text-gray-600">
                        {mockCabinetData.specialty} • {mockCabinetData.city}
                      </p>
                    </div>
                  </div>
                  <Button onClick={() => setIsEditing(true)} variant="brand">
                    Edit Profile
                  </Button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-gray-700">
                  <p>
                    <strong>Email:</strong> {mockCabinetData.email}
                  </p>
                  <p>
                    <strong>Phone:</strong> {mockCabinetData.phone}
                  </p>
                  <p>
                    <strong>Contact Email:</strong>{" "}
                    {mockCabinetData.contactEmail}
                  </p>
                  <p>
                    <strong>Address:</strong> {mockCabinetData.address}
                  </p>
                  <p className="md:col-span-2">
                    <strong>Location:</strong>{" "}
                    <a
                      href={mockCabinetData.locationLink}
                      target="_blank"
                      className="text-blue-600 hover:underline"
                    >
                      {mockCabinetData.locationLink}
                    </a>
                  </p>
                </div>
                {thumbnailImage && (
                  <div className="my-3">
                    <h3 className="text-lg font-semibold text-gray-800 mb-2">
                      Cabinet thumbnail
                    </h3>
                    <Image
                      src={thumbnailImage.preview}
                      alt="thumbnail Image"
                      className=" h-32 aspect-video object-cover rounded-lg shadow-sm"
                    />
                  </div>
                )}
                {cabinetImages.length > 0 && (
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-2">
                      Cabinet Images
                    </h3>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      {cabinetImages.map((img) => (
                        <Image
                          key={img.id}
                          src={img.preview}
                          alt="Cabinet"
                          className="w-full h-32 object-cover rounded-lg shadow-sm"
                        />
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <Tabs defaultValue="personal" className="w-full">
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="personal">Personal Info</TabsTrigger>
                    <TabsTrigger value="images">Images</TabsTrigger>
                  </TabsList>
                  <TabsContent value="personal" className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="username">Username</Label>
                        <Input
                          id="username"
                          {...register("username")}
                          placeholder="Dr. John Doe"
                        />
                        {errors.username && (
                          <p className="text-red-500 text-sm">
                            {errors.username.message}
                          </p>
                        )}
                      </div>
                      <div>
                        <Label htmlFor="email">Email</Label>
                        <Input
                          id="email"
                          type="email"
                          {...register("email")}
                          placeholder="email@example.com"
                        />
                        {errors.email && (
                          <p className="text-red-500 text-sm">
                            {errors.email.message}
                          </p>
                        )}
                      </div>
                      <div>
                        <Label htmlFor="phone">Phone Number</Label>
                        <Input
                          id="phone"
                          {...register("phone")}
                          placeholder="555-123-4567"
                        />
                        {errors.phone && (
                          <p className="text-red-500 text-sm">
                            {errors.phone.message}
                          </p>
                        )}
                      </div>
                      <div>
                        <Label htmlFor="contactEmail">Contact Email</Label>
                        <Input
                          id="contactEmail"
                          type="email"
                          {...register("contactEmail")}
                          placeholder="contact@example.com"
                        />
                        {errors.contactEmail && (
                          <p className="text-red-500 text-sm">
                            {errors.contactEmail.message}
                          </p>
                        )}
                      </div>
                      <div>
                        <Label htmlFor="specialty">Specialty</Label>
                        <Select
                          onValueChange={(value) =>
                            setValue("specialty", value)
                          }
                          defaultValue={mockCabinetData.specialty}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select specialty" />
                          </SelectTrigger>
                          <SelectContent>
                            {specialtyOptions.map((option) => (
                              <SelectItem key={option} value={option}>
                                {option}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        {errors.specialty && (
                          <p className="text-red-500 text-sm">
                            {errors.specialty.message}
                          </p>
                        )}
                      </div>
                      <div>
                        <Label htmlFor="city">City</Label>
                        <Input
                          id="city"
                          {...register("city")}
                          placeholder="San Francisco"
                        />
                        {errors.city && (
                          <p className="text-red-500 text-sm">
                            {errors.city.message}
                          </p>
                        )}
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="locationLink">Location Link</Label>
                      <Input
                        id="locationLink"
                        {...register("locationLink")}
                        placeholder="https://maps.google.com/..."
                      />
                      {errors.locationLink && (
                        <p className="text-red-500 text-sm">
                          {errors.locationLink.message}
                        </p>
                      )}
                    </div>
                    <div>
                      <Label htmlFor="address">Cabinet Address</Label>
                      <Textarea
                        id="address"
                        {...register("address")}
                        placeholder="123 Health Ave..."
                      />
                      {errors.address && (
                        <p className="text-red-500 text-sm">
                          {errors.address.message}
                        </p>
                      )}
                    </div>
                  </TabsContent>
                  <TabsContent value="images" className="space-y-4">
                    <div>
                      <Label>Thumbnail Image</Label>
                      <div className="flex items-center gap-4">
                        {thumbnailImage ? (
                          <div className="relative">
                            <Image
                              src={thumbnailImage.preview}
                              alt="Thumbnail"
                              className="aspect-video h-24 rounded-lg object-cover"
                            />
                            <Button
                              variant="destructive"
                              size="icon"
                              className="absolute top-0 right-0 w-6 h-6 rounded-full"
                              onClick={removeThumbnailImage}
                            >
                              <X className="w-4 h-4" />
                            </Button>
                          </div>
                        ) : (
                          <label className="flex items-center justify-center aspect-video h-24 bg-gray-100 rounded-lg cursor-pointer hover:bg-gray-200 transition-colors">
                            <input
                              type="file"
                              accept="image/*"
                              className="hidden"
                              onChange={handleThumbnailUpload}
                            />
                            <span className="text-gray-500">+</span>
                          </label>
                        )}
                      </div>
                    </div>
                    <div>
                      <Label>Cabinet Images</Label>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-4">
                        {cabinetImages.map((img) => (
                          <div key={img.id} className="relative">
                            <Image
                              src={img.preview}
                              alt="Cabinet"
                              className="w-full h-24 object-cover rounded-lg shadow-sm"
                            />
                            <Button
                              variant="destructive"
                              size="icon"
                              className="absolute top-1 right-1 w-6 h-6 rounded-full"
                              onClick={() => removeCabinetImage(img.id)}
                            >
                              <X className="w-4 h-4" />
                            </Button>
                          </div>
                        ))}
                      </div>
                      <label className="flex items-center justify-center w-full p-4 bg-gray-100 rounded-lg cursor-pointer hover:bg-gray-200 transition-colors">
                        <input
                          type="file"
                          accept="image/*"
                          multiple
                          className="hidden"
                          onChange={handleCabinetImagesUpload}
                        />
                        <span className="text-gray-600">Upload Images</span>
                      </label>
                    </div>
                  </TabsContent>
                </Tabs>
                <div className="flex justify-end gap-4">
                  <Button
                    variant="outline"
                    onClick={handleCancel}
                    disabled={isSubmitting}
                  >
                    Cancel
                  </Button>
                  <Button type="submit" variant="brand" disabled={isSubmitting}>
                    {isSubmitting ? "Saving..." : "Save Changes"}
                  </Button>
                </div>
              </form>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
