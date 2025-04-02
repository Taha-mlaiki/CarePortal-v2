"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Calendar,
  Mail,
  MapPin,
  Phone,
  User,
  Building,
  Loader2,
  XCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { format } from "date-fns";
import CommentsSection, { Comment } from "../_components/CommentSection";
import FavoriteButton from "../_components/FavoritesBtn";
import Image from "next/image";
import { useParams } from "next/navigation";
import axios from "@/lib/axios";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import BookModal from "../_components/BookModal";
import { toast } from "sonner";

const DEFAULT_THUMBNAIL = "/cabinetPlacholder.svg";
import { imageSrc } from "../_components/CabinetCard";

// Type definitions (adjust based on your API)
type Cabinet = {
  id: number;
  name: string;
  speciality: string;
  address: string;
  email: string;
  phone: string;
  description: string;
  thumbnail: string;
  images: string;
  created_at: string;
  manager: {
    username: string;
    email: string;
    phone: string;
  };
  comments: Comment[];
};

// API functions
const fetchCabinet = async (cabinetId: string) => {
  const { data } = await axios.get(`/cabinets/${cabinetId}`);
  return data.cabinet as Cabinet;
};

const addComment = async ({
  cabinetId,
  content,
}: {
  cabinetId: string | string[];
  content: string;
}) => {
  const { data } = await axios.post("/patient/cabinets/comments", {
    cabinetId,
    content,
  });
  return data.comment;
};

const updateComment = async ({
  commentId,
  content,
}: {
  commentId: number;
  content: string;
}) => {
  console.log(commentId,content);
  const { data } = await axios.put(`/patient/cabinets/comments/${commentId}`, {
    content,
  });
  return data.comment; // Assuming API returns the updated comment
};

const deleteComment = async (commentId: number) => {
  await axios.delete(`/patient/cabinets/comments/${commentId}`);
};

export default function CabinetDetailsPage() {
  const params = useParams();
  const cabinetId = params.id as string;
  const queryClient = useQueryClient();
  const [selectedImage, setSelectedImage] = useState<string>(DEFAULT_THUMBNAIL);

  const {
    data: cabinet,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["cabinet", cabinetId],
    queryFn: () => fetchCabinet(cabinetId),
  });

  useEffect(() => {
    if (cabinet?.thumbnail) {
      setSelectedImage(cabinet.thumbnail);
    }
  }, [cabinet]);

  // Mutations
  const addCommentMutation = useMutation({
    mutationFn: addComment,
    onSuccess: (newComment) => {
      queryClient.setQueryData(
        ["cabinet", cabinetId],
        (old: Cabinet | undefined) => {
          if (!old) return old;
          return { ...old, comments: [...old.comments, newComment] };
        }
      );
      toast.success("Comment added successfully!");
    },
    onError: (error) => {
      toast.error("Failed to add comment. Please try again.");
      console.error("Add comment error:", error);
    },
  });

  const updateCommentMutation = useMutation({
    mutationFn: updateComment,
    onSuccess: (updatedComment) => {
      queryClient.setQueryData(
        ["cabinet", cabinetId],
        (old: Cabinet | undefined) => {
          if (!old) return old;
          return {
            ...old,
            comments: old.comments.map((c) =>
              c.id === updatedComment.id ? updatedComment : c
            ),
          };
        }
      );
      toast.success("Comment updated successfully!");
    },
    onError: (error) => {
      toast.error("Failed to update comment. Please try again.");
      console.error("Update comment error:", error);
    },
  });

  const deleteCommentMutation = useMutation({
    mutationFn: deleteComment,
    onSuccess: (_, commentId) => {
      queryClient.setQueryData(
        ["cabinet", cabinetId],
        (old: Cabinet | undefined) => {
          if (!old) return old;
          return {
            ...old,
            comments: old.comments.filter((c) => c.id !== commentId),
          };
        }
      );
      toast.success("Comment deleted successfully!");
    },
    onError: (error) => {
      toast.error("Failed to delete comment. Please try again.");
      console.error("Delete comment error:", error);
    },
  });

  // Comment handlers
  const handleAddComment = (content: string) => {
    addCommentMutation.mutate({ cabinetId, content });
  };

  const handleUpdateComment = (id: number, content: string) => {
    updateCommentMutation.mutate({ commentId: id, content });
  };

  const handleDeleteComment = (id: number) => {
    deleteCommentMutation.mutate(id);
  };

  if (isLoading) {
    return (
      <div className="h-[60vh] flex items-center justify-center">
        <Loader2 className="w-20 h-20 animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="h-[60vh] flex items-center justify-center">
        <div className="bg-white rounded-lg p-8 shadow-lg">
          <XCircle className="h-10 w-10 text-red-600 mx-auto" />
          <h2 className="text-2xl font-bold text-center mt-4">
            Something went wrong
          </h2>
          <p className="text-center text-gray-600">
            {(error as Error).message || "An unexpected error occurred"}
          </p>
        </div>
      </div>
    );
  }

  if (!cabinet) {
    return (
      <Link href="/patient/cabinets">
        <Button variant="ghost" className="text-brand hover:text-brand">
          <ArrowLeft className="h-4 w-4" />
          Back to Directory
        </Button>
      </Link>
    );
  }

  return (
    <div>
      <Link href="/patient/cabinets">
        <Button variant="ghost" className="text-brand hover:text-brand">
          <ArrowLeft className="h-4 w-4" />
          Back to Directory
        </Button>
      </Link>

      {/* Header */}
      <div className="mt-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            {cabinet.name}
          </h1>
          <div className="mt-2 flex flex-wrap items-center gap-2 text-sm text-gray-600">
            <Badge className="bg-[#3b82f6] text-white">
              {cabinet.speciality}
            </Badge>
            <div className="flex items-center gap-1">
              <MapPin className="h-4 w-4" />
              <span>{cabinet.address}</span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <FavoriteButton
            cabinetId={cabinet.id}
            cabinetName={cabinet.name}
            variant="button"
          />
          <BookModal cabinetName={cabinet.name} id={cabinet.id} />
        </div>
      </div>

      {/* Main content */}
      <div className="mt-8 grid mb-10 gap-8 lg:grid-cols-3">
        {/* Image gallery */}
        <div className="lg:col-span-2">
          <div className="overflow-hidden relative rounded-xl bg-white shadow">
            <div className="aspect-video overflow-hidden">
              <Image
                fill
                src={imageSrc + selectedImage || DEFAULT_THUMBNAIL}
                alt={cabinet.name}
                className="h-full w-full object-cover"
              />
            </div>
            <div className="grid grid-cols-3 gap-2 p-4 sm:grid-cols-6">
              {JSON.parse(cabinet.images || "[]").map(
                (image: string, index: number) => (
                  <div
                    key={index}
                    className={`cursor-pointer relative overflow-hidden rounded-md border-2 transition-all ${
                      selectedImage === image
                        ? "border-[#3b82f6]"
                        : "border-transparent hover:border-gray-300"
                    }`}
                    onClick={() => setSelectedImage(image)}
                  >
                    <Image
                      width={100}
                      height={100}
                      src={imageSrc + image}
                      alt={image}
                      className="aspect-video h-full w-full object-cover"
                    />
                  </div>
                )
              )}
            </div>
          </div>

          {/* Cabinet description */}
          <div className="mt-6 rounded-xl bg-white p-6 shadow">
            <h2 className="text-xl font-bold text-gray-900">
              About {cabinet.name}
            </h2>
            <p className="mt-4 text-gray-700 leading-relaxed">
              {cabinet.description}
            </p>
            {/* Add working hours if available */}
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Contact Information</CardTitle>
              <CardDescription>
                Get in touch with {cabinet.name}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-start gap-3">
                <Mail className="mt-0.5 h-5 w-5 flex-shrink-0 text-[#3b82f6]" />
                <div>
                  <p className="text-sm font-medium text-gray-700">Email</p>
                  <p className="text-sm text-gray-600">{cabinet.email}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Phone className="mt-0.5 h-5 w-5 flex-shrink-0 text-[#3b82f6]" />
                <div>
                  <p className="text-sm font-medium text-gray-700">Phone</p>
                  <p className="text-sm text-gray-600">{cabinet.phone}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <MapPin className="mt-0.5 h-5 w-5 flex-shrink-0 text-[#3b82f6]" />
                <div>
                  <p className="text-sm font-medium text-gray-700">Address</p>
                  <p className="text-sm text-gray-600">{cabinet.address}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Owner Information</CardTitle>
              <CardDescription>About the cabinet Manager</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-start gap-3">
                <User className="mt-0.5 h-5 w-5 flex-shrink-0 text-[#3b82f6]" />
                <div>
                  <p className="text-sm font-medium text-gray-700">Name</p>
                  <p className="text-sm text-gray-600">
                    {cabinet.manager.username}
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Mail className="mt-0.5 h-5 w-5 flex-shrink-0 text-[#3b82f6]" />
                <div>
                  <p className="text-sm font-medium text-gray-700">Email</p>
                  <p className="text-sm text-gray-600">
                    {cabinet.manager.email}
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Phone className="mt-0.5 h-5 w-5 flex-shrink-0 text-[#3b82f6]" />
                <div>
                  <p className="text-sm font-medium text-gray-700">Phone</p>
                  <p className="text-sm text-gray-600">
                    {cabinet.manager.phone}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Cabinet Statistics</CardTitle>
              <CardDescription>
                Key information about this cabinet
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-start gap-3">
                <Building className="mt-0.5 h-5 w-5 flex-shrink-0 text-[#3b82f6]" />
                <div>
                  <p className="text-sm font-medium text-gray-700">Specialty</p>
                  <p className="text-sm text-gray-600">{cabinet.speciality}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Calendar className="mt-0.5 h-5 w-5 flex-shrink-0 text-[#3b82f6]" />
                <div>
                  <p className="text-sm font-medium text-gray-700">
                    Established
                  </p>
                  <p className="text-sm text-gray-600">
                    {format(new Date(cabinet.created_at), "MMMM yyyy")}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Comments Section */}
      <CommentsSection
        cabinet_id={cabinet.id}
        comments={cabinet.comments}
        onAddComment={handleAddComment}
        onUpdateComment={handleUpdateComment}
        onDeleteComment={handleDeleteComment}
      />
    </div>
  );
}
