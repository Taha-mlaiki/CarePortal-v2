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
import Header from "../_components/Header";
import axios from "@/lib/axios";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { SubmitButton } from "@/components/SubmitButton";
import { imageSrc } from "@/app/patient/cabinets/_components/CabinetCard";
import { Skeleton } from "@/components/ui/skeleton";

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
type ImageFile = { file?: File; preview: string; id: string };

// Specialty options
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

// API functions
const fetchCabinetInfo = async () => {
  const res = await axios.get("/manager/cabinet");
  const cabinet = res.data.cabinet;
  return {
    ...cabinet,
    images: cabinet.images ? JSON.parse(cabinet.images) : [],
  };
};

const updateCabinetInfo = async (data: FormData) => {
  const res = await axios.post("/manager/cabinet", data, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  const cabinet = res.data.cabinet;
  return {
    ...cabinet,
    images: cabinet.images ? JSON.parse(cabinet.images) : [],
  };
};

export default function CabinetSettings() {
  const [isEditing, setIsEditing] = useState(false);
  const [cabinetImages, setCabinetImages] = useState<ImageFile[]>([]);
  const [thumbnailImage, setThumbnailImage] = useState<ImageFile | null>(null);
  const queryClient = useQueryClient();

  // Fetch cabinet data
  const { data, isLoading } = useQuery({
    queryFn: fetchCabinetInfo,
    queryKey: ["manager_cabinet"],
  });

  // Mutation for updating cabinet
  const { mutate, isPending } = useMutation({
    mutationFn: updateCabinetInfo,
    onSuccess: (updatedData) => {
      queryClient.setQueryData(["manager_cabinet"], updatedData); // Update cache immediately
      toast.success("Cabinet updated successfully!", {
        description: "Your changes have been saved.",
      });
      setIsEditing(false);
    },
    onError: (err) => {
      toast.error("Failed to update cabinet", {
        description: err.message,
      });
    },
  });

  // Initialize form
  const form = useForm<CabinetFormValues>({
    resolver: zodResolver(cabinetSchema),
    defaultValues: {
      name: "",
      description: "",
      doctor_name: "",
      email: "",
      phone: "",
      speciality: "",
      city: "",
      location_link: "",
      address: "",
      images: [],
      thumbnail: null,
    },
  });

  // Sync form and images when data loads
  useEffect(() => {
    if (data) {
      form.reset(data);
      setCabinetImages(
        data.images.map((path: string) => ({
          preview: imageSrc + path,
          id: crypto.randomUUID(),
        }))
      );
      if (data.thumbnail) {
        setThumbnailImage({
          preview: imageSrc + data.thumbnail,
          id: crypto.randomUUID(),
        });
      }
    }
  }, [data, form]);

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
      form.setValue("images", [...cabinetImages, ...newImages], {
        shouldValidate: true,
      });
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
      form.setValue("thumbnail", newThumbnail, { shouldValidate: true });
    }
  };

  const removeCabinetImage = (id: string) => {
    const updatedImages = cabinetImages.filter((img) => img.id !== id);
    setCabinetImages(updatedImages);
    form.setValue("images", updatedImages, { shouldValidate: true });
  };

  const removeThumbnailImage = () => {
    setThumbnailImage(null);
    form.setValue("thumbnail", null, { shouldValidate: true });
  };

  // Form submission
  const onSubmit = async (values: CabinetFormValues) => {
    const formData = new FormData();

    formData.append("id", data.id);
    // Append text fields
    Object.entries(values).forEach(([key, value]) => {
      if (key !== "images" && key !== "thumbnail") {
        formData.append(key, value as string);
      }
    });

    // Append cabinet images
    cabinetImages.forEach((img, index) => {
      if (img.file) {
        formData.append(`images[${index}]`, img.file);
      } else {
        formData.append(
          `existing_images[${index}]`,
          img.preview.replace(imageSrc, "")
        );
      }
    });

    // Append thumbnail
    if (values.thumbnail?.file) {
      formData.append("thumbnail", values.thumbnail.file);
    } else if (values.thumbnail && values.thumbnail.preview) {
      formData.append(
        "existing_thumbnail",
        values.thumbnail.preview.replace(imageSrc, "")
      );
    }
    mutate(formData);
  };

  // Clean up object URLs
  useEffect(() => {
    return () => {
      cabinetImages.forEach((img) => {
        if (img.file) URL.revokeObjectURL(img.preview);
      });
      if (thumbnailImage?.file) URL.revokeObjectURL(thumbnailImage.preview);
    };
  }, [cabinetImages, thumbnailImage]);

  if (isLoading) {
    return (
      <div className="lg:ml-64 min-h-screen p-5 md:p-10">
        <Header
          title="Manage Your Cabinet"
          description="Update your personal and cabinet information"
        />
        <Skeleton className="w-full max-w-4xl mx-auto rounded-lg h-[50vh]" />
      </div>
    );
  }

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
                        {data?.name[0] || "C"}
                      </div>
                    )}
                    <div>
                      <h2 className="text-xl font-semibold text-gray-800">
                        {data?.doctor_name || "N/A"}
                      </h2>
                      <p className="text-gray-600">
                        {data?.speciality || ""} • {data?.city || ""}
                      </p>
                      <p className="text-gray-700 font-medium">
                        {data?.name || "N/A"}
                      </p>
                    </div>
                  </div>
                  <Button variant="brand" onClick={() => setIsEditing(true)}>
                    Edit Profile
                  </Button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-gray-700">
                  <p>
                    <strong>Email:</strong> {data?.email || "N/A"}
                  </p>
                  <p>
                    <strong>Phone:</strong> {data?.phone || "N/A"}
                  </p>
                  <p>
                    <strong>City:</strong> {data?.city || "N/A"}
                  </p>
                  <p>
                    <strong>Address:</strong> {data?.address || "N/A"}
                  </p>
                  <p className="md:col-span-2">
                    <strong>Location:</strong>{" "}
                    {data?.location_link ? (
                      <a
                        href={data.location_link}
                        target="_blank"
                        className="text-blue-600 hover:underline"
                      >
                        {data.location_link}
                      </a>
                    ) : (
                      "N/A"
                    )}
                  </p>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">
                    Description
                  </h3>
                  <p className="text-gray-600">
                    {data?.description || "No description available"}
                  </p>
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
                      onClick={() => setIsEditing(false)}
                      disabled={isPending}
                    >
                      Cancel
                    </Button>
                    <SubmitButton variant="brand" disabled={isPending}>
                      {isPending ? "Saving..." : "Save Changes"}
                    </SubmitButton>
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
