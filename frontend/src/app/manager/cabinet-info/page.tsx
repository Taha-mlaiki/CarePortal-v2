"use client";

import React, { useState, useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { toast } from "sonner";
import Image from "next/image";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { X } from "lucide-react";
import Header from "../_components/Header"; // Adjust path as needed

// Zod schema for form validation
const cabinetSchema = z.object({
  name: z
    .string()
    .min(5, "Name must be at least 5 characters")
    .nonempty("Name is required"),
  description: z
    .string()
    .min(50, "Description must be at least 50 characters")
    .nonempty("Description is required"),
  doctor_name: z
    .string()
    .min(5, "Doctor name must be at least 5 characters")
    .nonempty("Doctor name is required"),
  email: z
    .string()
    .email("Invalid email address")
    .nonempty("Email is required"),
  phone: z
    .string()
    .min(10, "Phone number must be at least 10 digits")
    .nonempty("Phone number is required"),
  speciality: z
    .string()
    .min(1, "Speciality is required")
    .nonempty("Speciality is required"),
  city: z.string().min(1, "City is required").nonempty("City is required"),
  location_link: z
    .string()
    .url("Must be a valid URL")
    .nonempty("Location link is required"),
  address: z
    .string()
    .min(5, "Address must be at least 5 characters")
    .nonempty("Address is required"),
  images: z.array(z.any()).min(2, "At least 2 cabinet images are required"),
  thumbnail: z
    .any()
    .refine((val) => val !== null, "Thumbnail image is required"),
});

type CabinetFormValues = z.infer<typeof cabinetSchema>;
type ImageFile = { file: File; preview: string; id: string };

// Mock initial data
const mockCabinetData: CabinetFormValues = {
  name: "Wellness Central",
  email: "sarah.johnson@medclinic.com",
  description:
    "Welcome to Wellness Central where our team of expert medical professionals is dedicated to providing you with the best possible care. We specialize in and are committed to making your experience as comfortable and stress-free as possible. Please don't hesitate to contact us if you have any questions or concerns.",
  phone: "555-123-4567",
  doctor_name: "Sarah Central",
  speciality: "Cardiologist",
  city: "San Francisco",
  location_link: "https://maps.google.com/?q=MedClinic+San+Francisco",
  address: "123 Health Avenue, San Francisco, CA 94107",
  images: [],
  thumbnail: null, // Changed to null to match schema expectation
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

  const form = useForm<CabinetFormValues>({
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
      form.setValue("images", [...cabinetImages, ...newImages]);
    }
  };

  const handleThumbnailUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const newThumbnail = {
        file,
        preview: URL.createObjectURL(file),
        id: crypto.randomUUID(),
      };
      setThumbnailImage(newThumbnail);
      form.setValue("thumbnail", newThumbnail);
    }
  };

  const removeCabinetImage = (id: string) => {
    const updatedImages = cabinetImages.filter((img) => img.id !== id);
    setCabinetImages(updatedImages);
    form.setValue("images", updatedImages);
  };

  const removeThumbnailImage = () => {
    setThumbnailImage(null);
    form.setValue("thumbnail", null);
  };

  // Form submission
  const onSubmit = async (data: CabinetFormValues) => {
    setIsSubmitting(true);
    await new Promise((resolve) => setTimeout(resolve, 1500)); // Simulate API call
    console.log("Updated Data:", data);
    toast.success("Cabinet updated successfully!", {
      description: "Your changes have been saved.",
    });
    setIsSubmitting(false);
    setIsEditing(false);
  };

  // Reset form on cancel
  const handleCancel = () => {
    form.reset(mockCabinetData);
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
        title="Manage Your Cabinet"
        description="Update your personal and cabinet information"
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
                        width={64}
                        height={64}
                        src={thumbnailImage.preview}
                        alt="Thumbnail"
                        className="w-16 h-16 rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-16 h-16 rounded-full bg-blue-200 flex items-center justify-center text-2xl font-bold text-blue-800">
                        {mockCabinetData.doctor_name[0]}{" "}
                      </div>
                    )}
                    <div>
                      <h2 className="text-xl font-semibold text-gray-800">
                        {mockCabinetData.doctor_name}{" "}
                      </h2>
                      <p className="text-gray-600">
                        {mockCabinetData.speciality} • {mockCabinetData.city}{" "}
                      </p>
                      <p className="text-gray-700 font-medium">
                        {mockCabinetData.name} 
                      </p>
                    </div>
                  </div>
                  <Button variant="brand" onClick={() => setIsEditing(true)}>
                    Edit Profile
                  </Button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-gray-700">
                  <p>
                    <strong>Email:</strong> {mockCabinetData.email}{" "}
                  </p>
                  <p>
                    <strong>Phone:</strong> {mockCabinetData.phone}{" "}
                  </p>
                  <p>
                    <strong>City:</strong> {mockCabinetData.city}{" "}
                  </p>
                  <p>
                    <strong>Address:</strong> {mockCabinetData.address}{" "}
                  </p>
                  <p className="md:col-span-2">
                    <strong>Location:</strong>{" "}
                    <a
                      href={mockCabinetData.location_link}
                      target="_blank"
                      className="text-blue-600 hover:underline"
                    >
                      {mockCabinetData.location_link}{" "}
                    </a>
                  </p>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">
                    Description
                  </h3>
                  <p className="text-gray-600">{mockCabinetData.description}</p>{" "}
                </div>
                {thumbnailImage && (
                  <div className="my-3">
                    <h3 className="text-lg font-semibold text-gray-800 mb-2">
                      Cabinet Thumbnail
                    </h3>
                    <Image
                      height={128}
                      width={300}
                      src={thumbnailImage.preview}
                      alt="Thumbnail Image"
                      className="h-32 aspect-video object-cover rounded-lg shadow-sm"
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
                          width={128}
                          height={128}
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
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="space-y-6"
                >
                  <Tabs defaultValue="personal" className="w-full">
                    <TabsList className="grid w-full grid-cols-2">
                      <TabsTrigger value="personal">Personal Info</TabsTrigger>
                      <TabsTrigger value="images">Images</TabsTrigger>
                    </TabsList>

                    <TabsContent value="personal" className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <FormField
                          control={form.control}
                          name="name"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Cabinet Name</FormLabel>
                              <FormControl>
                                <Input
                                  placeholder="HealthCare Clinic"
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="doctor_name"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Doctor Name</FormLabel>
                              <FormControl>
                                <Input placeholder="Dr. John Doe" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="email"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Email</FormLabel>
                              <FormControl>
                                <Input
                                  type="email"
                                  placeholder="email@example.com"
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="phone"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Phone Number</FormLabel>
                              <FormControl>
                                <Input placeholder="555-123-4567" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="speciality"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Speciality</FormLabel>
                              <Select
                                onValueChange={field.onChange}
                                value={field.value}
                              >
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select speciality" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  {specialtyOptions.map((option) => (
                                    <SelectItem key={option} value={option}>
                                      {option}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="city"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>City</FormLabel>
                              <FormControl>
                                <Input placeholder="San Francisco" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                      <FormField
                        control={form.control}
                        name="location_link"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Location Link</FormLabel>
                            <FormControl>
                              <Input
                                placeholder="https://maps.google.com/..."
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="address"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Cabinet Address</FormLabel>
                            <FormControl>
                              <Textarea
                                placeholder="123 Health Ave..."
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="description"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Description</FormLabel>
                            <FormControl>
                              <Textarea
                                placeholder="Provide a detailed description of the cabinet (min 50 characters)..."
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </TabsContent>

                    <TabsContent value="images" className="space-y-4">
                      <FormField
                        control={form.control}
                        name="thumbnail"
                        render={() => (
                          <FormItem>
                            <FormLabel>Thumbnail Image (Required)</FormLabel>
                            <div className="flex items-center gap-4">
                              {thumbnailImage ? (
                                <div className="relative">
                                  <Image
                                    width={96}
                                    height={96}
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
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="images"
                        render={() => (
                          <FormItem>
                            <FormLabel>Cabinet Images (Minimum 2)</FormLabel>
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-4">
                              {cabinetImages.map((img) => (
                                <div key={img.id} className="relative">
                                  <Image
                                    width={96}
                                    height={96}
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
                              <span className="text-gray-600">
                                Upload Images
                              </span>
                            </label>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
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
                    <Button variant="brand" type="submit" disabled={isSubmitting}>
                      {isSubmitting ? "Saving..." : "Save Changes"}
                    </Button>
                  </div>
                </form>
              </Form>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
