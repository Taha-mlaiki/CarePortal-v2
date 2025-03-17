"use client";

import React, { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ImagesForm from "./_components/ImagesForm";
import PersonalInfoForm from "./_components/PersonalInfoForm";

// Zod schema with updated validation
const cabinetSchema = z.object({
  name: z
    .string()
    .min(5, "Name must be at least 5 characters")
    .nonempty("Username is required"),
  description: z
    .string()
    .min(50, "description must be at least 50 characters")
    .nonempty("Username is required"),
  doctor_name: z
    .string()
    .min(5, "Name must be at least 5 characters")
    .nonempty("Username is required"),
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
    .nonempty("Specialty is required"),
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

export type CabinetFormValues = z.infer<typeof cabinetSchema>;
export type ImageFile = { file: File; preview: string; id: string };

export default function CabinetPage() {
  const [cabinetImages, setCabinetImages] = useState<ImageFile[]>([]);
  const [thumbnailImage, setThumbnailImage] = useState<ImageFile | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<CabinetFormValues>({
    resolver: zodResolver(cabinetSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      doctor_name: "",
      speciality: "",
      city: "",
      description: "",
      location_link: "",
      address: "",
      images: [],
      thumbnail: null,
    },
  });

  const onSubmit = async (data: CabinetFormValues) => {
    setIsSubmitting(true);
    await new Promise((resolve) => setTimeout(resolve, 1500)); // Simulate API call
    console.log("Form Data:", data);
    toast.success("Cabinet updated successfully!", {
      description: "Your changes have been saved.",
    });
    setIsSubmitting(false);
  };

  return (
    <div className="max-w-7xl mx-auto px-5 md:px-10 py-8">
      <Card className="bg-white border rounded-md shadow-sm">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">
            Cabinet Information
          </CardTitle>
          <p className="text-sm text-neutral-700">
            Fill in your cabinet details to start receiving appointments
          </p>
        </CardHeader>
        <CardContent>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <Tabs defaultValue="personal" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="personal">Cabinet Info</TabsTrigger>
                <TabsTrigger value="images">Cabinet Images</TabsTrigger>
              </TabsList>

              <TabsContent value="personal" className="space-y-4">
                <PersonalInfoForm form={form} />
              </TabsContent>

              <TabsContent value="images" className="space-y-4">
                <ImagesForm
                  form={form}
                  cabinetImages={cabinetImages}
                  setCabinetImages={setCabinetImages}
                  thumbnailImage={thumbnailImage}
                  setThumbnailImage={setThumbnailImage}
                />
              </TabsContent>
            </Tabs>
            <div className="flex justify-end gap-4">
              <Button type="submit" variant="brand" disabled={isSubmitting}>
                {isSubmitting ? "Saving..." : "Save Changes"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
