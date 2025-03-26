import React, { useEffect } from "react";
import { UseFormReturn } from "react-hook-form";
import Image from "next/image";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { X } from "lucide-react";
import { CabinetFormValues, ImageFile } from "../page";

interface ImagesFormProps {
  form: UseFormReturn<CabinetFormValues>;
  cabinetImages: ImageFile[];
  setCabinetImages: React.Dispatch<React.SetStateAction<ImageFile[]>>;
  thumbnailImage: ImageFile | null;
  setThumbnailImage: React.Dispatch<React.SetStateAction<ImageFile | null>>;
}

export default function ImagesForm({
  form,
  cabinetImages,
  setCabinetImages,
  thumbnailImage,
  setThumbnailImage,
}: ImagesFormProps) {
  const handleCabinetImagesUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newImages = Array.from(e.target.files).map((file) => ({
        file,
        preview: URL.createObjectURL(file),
        id: crypto.randomUUID(),
      }));
      setCabinetImages((prev) => [...prev, ...newImages]);
      form.setValue("images", [...cabinetImages, ...newImages.map((image) => image.file)]);
    }
  };

  const handleThumbnailUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const newThumbnail = { file, preview: URL.createObjectURL(file), id: crypto.randomUUID() };
      setThumbnailImage(newThumbnail);
      form.setValue("thumbnail", file);
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

  useEffect(() => {
    return () => {
      cabinetImages.forEach((img) => URL.revokeObjectURL(img.preview));
      if (thumbnailImage) URL.revokeObjectURL(thumbnailImage.preview);
    };
  }, [cabinetImages, thumbnailImage]);

  return (
    <Form {...form}>
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
              <span className="text-gray-600">Upload Images</span>
            </label>
            <FormMessage />
          </FormItem>
        )}
      />
    </Form>
  );
}