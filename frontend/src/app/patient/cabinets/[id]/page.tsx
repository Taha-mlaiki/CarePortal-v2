"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Calendar,
  Clock,
  Mail,
  MapPin,
  Phone,
  User,
  Users,
  Building,
  Award,
  CheckCircle,
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import CommentsSection, { Comment } from "../_components/CommentSection";
import FavoriteButton from "../_components/FavoritesBtn";
import Image from "next/image";

// Default thumbnail
const DEFAULT_THUMBNAIL = "/cabinetPlacholder.svg";

// Mock data for a single cabinet
const getCabinetData = (id: string) => {
  return {
    id: Number.parseInt(id),
    name: "Wellness Central",
    specialty: "General Medicine",
    address: "123 Healing Ave, New York, NY 10001",
    dateStarted: new Date("2018-03-15"),
    totalAppointments: 1458,
    email: "contact@wellnesscentral.com",
    phone: "+1 (555) 123-4567",
    owner: {
      name: "Dr. Sarah Johnson",
      email: "dr.johnson@wellnesscentral.com",
      phone: "+1 (555) 987-6543",
      qualifications: "MD, Board Certified in Internal Medicine",
    },
    description:
      "Wellness Central is a state-of-the-art medical facility dedicated to providing comprehensive healthcare services with a focus on preventive medicine and holistic wellness. Our team of experienced healthcare professionals is committed to delivering personalized care in a comfortable and welcoming environment.",
    workingHours: {
      weekdays: "8:00 AM - 6:00 PM",
      saturday: "9:00 AM - 2:00 PM",
      sunday: "Closed",
    },
    services: [
      "General Check-ups",
      "Preventive Care",
      "Chronic Disease Management",
      "Vaccinations",
      "Health Screenings",
      "Nutritional Counseling",
    ],
    images: ["", "", "", "", ""],
  };
};

const COMMENTS_DATA: Comment[] = [
  {
    id: 1,
    user: {
      name: "Michael Thompson",
      avatar: null,
      initials: "MT",
    },
    content:
      "Excellent service! Dr. Johnson was very thorough and took the time to explain everything. The staff was friendly and the facility is clean and modern. Highly recommend this place for anyone looking for quality healthcare.",
  },
  {
    id: 2,
    user: {
      name: "Emily Rodriguez",
      avatar: null,
      initials: "ER",
    },
    content:
      "I had a great experience at Wellness Central. The wait time was minimal and the doctor was knowledgeable and attentive. The parking situation is a bit challenging, but otherwise, everything was excellent.",
  },
  {
    id: 3,
    user: {
      name: "David Chen",
      avatar: null,
      initials: "DC",
    },
    content:
      "This is my go-to place for all my healthcare needs. The staff is professional, the doctors are excellent, and they always follow up after appointments. The online booking system is also very convenient.",
  },
  {
    id: 4,
    user: {
      name: "You",
      avatar: null,
      initials: "YO",
    },
    content:
      "The medical care was good, but I had some issues with billing and insurance processing. It took several calls to sort everything out. The front desk staff could be more helpful with administrative matters.",
    isOwnComment: true,
  },
];

export default function CabinetDetailsPage() {
  const cabinet = getCabinetData("1");
  const [selectedImage, setSelectedImage] = useState(cabinet.images[0]);
  const [bookingDate, setBookingDate] = useState("");
  const [bookingTime, setBookingTime] = useState("");
  const [bookingName, setBookingName] = useState("");
  const [bookingPhone, setBookingPhone] = useState("");
  const [bookingEmail, setBookingEmail] = useState("");
  const [bookingNotes, setBookingNotes] = useState("");
  const [bookingSuccess, setBookingSuccess] = useState(false);

  // Comments state
  const [comments, setComments] = useState<Comment[]>(COMMENTS_DATA);

  // Comment handlers
  const handleAddComment = (content: string) => {
    const newComment: Comment = {
      id: comments.length + 1,
      user: {
        name: "You",
        avatar: null,
        initials: "YO",
      },
      content,
      isOwnComment: true,
    };

    setComments([newComment, ...comments]);
  };

  const handleUpdateComment = (id: number, content: string) => {
    setComments(
      comments.map((comment) =>
        comment.id === id ? { ...comment, content } : comment
      )
    );
  };

  const handleDeleteComment = (id: number) => {
    setComments(comments.filter((comment) => comment.id !== id));
  };

  const handleBookAppointment = () => {
    // In a real app, this would send the booking data to an API
    console.log("Booking appointment:", {
      date: bookingDate,
      time: bookingTime,
      name: bookingName,
      phone: bookingPhone,
      email: bookingEmail,
      notes: bookingNotes,
    });

    // Show success message
    setBookingSuccess(true);

    // Reset form after 3 seconds
    setTimeout(() => {
      setBookingSuccess(false);
      setBookingDate("");
      setBookingTime("");
      setBookingName("");
      setBookingPhone("");
      setBookingEmail("");
      setBookingNotes("");
    }, 3000);
  };

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
              {cabinet.specialty}
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
          <Dialog>
            <DialogTrigger asChild>
              <Button size="lg" className="bg-[#3b82f6] hover:bg-[#3b82f6]/90">
                Book Appointment
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
              <DialogHeader>
                <DialogTitle>Book an Appointment</DialogTitle>
                <DialogDescription>
                  Fill out the form below to schedule an appointment at{" "}
                  {cabinet.name}.
                </DialogDescription>
              </DialogHeader>

              {bookingSuccess ? (
                <div className="flex flex-col items-center justify-center py-6 text-center">
                  <CheckCircle className="h-16 w-16 text-green-500" />
                  <h3 className="mt-4 text-xl font-semibold text-gray-900">
                    Booking Successful!
                  </h3>
                  <p className="mt-2 text-gray-600">
                    Your appointment has been scheduled. We&apos;ll contact you
                    shortly to confirm.
                  </p>
                </div>
              ) : (
                <>
                  <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="date">Date</Label>
                        <Input
                          id="date"
                          type="date"
                          value={bookingDate}
                          onChange={(e) => setBookingDate(e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="time">Time</Label>
                        <Select
                          value={bookingTime}
                          onValueChange={setBookingTime}
                        >
                          <SelectTrigger id="time">
                            <SelectValue placeholder="Select time" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="09:00">9:00 AM</SelectItem>
                            <SelectItem value="10:00">10:00 AM</SelectItem>
                            <SelectItem value="11:00">11:00 AM</SelectItem>
                            <SelectItem value="13:00">1:00 PM</SelectItem>
                            <SelectItem value="14:00">2:00 PM</SelectItem>
                            <SelectItem value="15:00">3:00 PM</SelectItem>
                            <SelectItem value="16:00">4:00 PM</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="name">Full Name</Label>
                      <Input
                        id="name"
                        value={bookingName}
                        onChange={(e) => setBookingName(e.target.value)}
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="phone">Phone Number</Label>
                        <Input
                          id="phone"
                          type="tel"
                          value={bookingPhone}
                          onChange={(e) => setBookingPhone(e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input
                          id="email"
                          type="email"
                          value={bookingEmail}
                          onChange={(e) => setBookingEmail(e.target.value)}
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="notes">Notes (Optional)</Label>
                      <Textarea
                        id="notes"
                        placeholder="Please share any specific concerns or requirements"
                        value={bookingNotes}
                        onChange={(e) => setBookingNotes(e.target.value)}
                      />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button
                      type="submit"
                      onClick={handleBookAppointment}
                      className="bg-[#3b82f6] hover:bg-[#3b82f6]/90"
                    >
                      Confirm Booking
                    </Button>
                  </DialogFooter>
                </>
              )}
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Main content */}
      <div className="mt-8 grid gap-8 lg:grid-cols-3">
        {/* Image gallery - takes up 2 columns on large screens */}
        <div className="lg:col-span-2">
          <div className="overflow-hidden relative rounded-xl bg-white shadow">
            {/* Main selected image */}
            <div className="aspect-video  overflow-hidden">
              <Image
                fill
                src={selectedImage || DEFAULT_THUMBNAIL}
                alt={cabinet.name}
                className="h-full w-full object-cover"
              />
            </div>

            {/* Thumbnails */}
            <div className="grid grid-cols-3 gap-2 p-4 sm:grid-cols-6">
              {cabinet.images.map((image, index) => (
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
                    src="/cabinetPlacholder.svg"
                    alt={`${cabinet.name} - Image ${index + 1}`}
                    className="aspect-video h-full w-full object-cover"
                  />
                </div>
              ))}
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

            <div className="mt-6 grid gap-6 sm:grid-cols-2">
              <div>
                <h3 className="flex items-center gap-2 font-semibold text-gray-900">
                  <Clock className="h-5 w-5 text-[#3b82f6]" />
                  Working Hours
                </h3>
                <ul className="mt-2 space-y-1 text-sm text-gray-700">
                  <li className="flex justify-between">
                    <span>Monday - Friday:</span>
                    <span>{cabinet.workingHours.weekdays}</span>
                  </li>
                  <li className="flex justify-between">
                    <span>Saturday:</span>
                    <span>{cabinet.workingHours.saturday}</span>
                  </li>
                  <li className="flex justify-between">
                    <span>Sunday:</span>
                    <span>{cabinet.workingHours.sunday}</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar with contact info and stats */}
        <div className="space-y-6">
          {/* Contact information */}
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

          {/* Owner information */}
          <Card>
            <CardHeader>
              <CardTitle>Owner Information</CardTitle>
              <CardDescription>About the cabinet owner</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-start gap-3">
                <User className="mt-0.5 h-5 w-5 flex-shrink-0 text-[#3b82f6]" />
                <div>
                  <p className="text-sm font-medium text-gray-700">Name</p>
                  <p className="text-sm text-gray-600">{cabinet.owner.name}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Mail className="mt-0.5 h-5 w-5 flex-shrink-0 text-[#3b82f6]" />
                <div>
                  <p className="text-sm font-medium text-gray-700">Email</p>
                  <p className="text-sm text-gray-600">{cabinet.owner.email}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Phone className="mt-0.5 h-5 w-5 flex-shrink-0 text-[#3b82f6]" />
                <div>
                  <p className="text-sm font-medium text-gray-700">Phone</p>
                  <p className="text-sm text-gray-600">{cabinet.owner.phone}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Award className="mt-0.5 h-5 w-5 flex-shrink-0 text-[#3b82f6]" />
                <div>
                  <p className="text-sm font-medium text-gray-700">
                    Qualifications
                  </p>
                  <p className="text-sm text-gray-600">
                    {cabinet.owner.qualifications}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Cabinet stats */}
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
                  <p className="text-sm text-gray-600">{cabinet.specialty}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Calendar className="mt-0.5 h-5 w-5 flex-shrink-0 text-[#3b82f6]" />
                <div>
                  <p className="text-sm font-medium text-gray-700">
                    Established
                  </p>
                  <p className="text-sm text-gray-600">
                    {format(cabinet.dateStarted, "MMMM yyyy")}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Users className="mt-0.5 h-5 w-5 flex-shrink-0 text-[#3b82f6]" />
                <div>
                  <p className="text-sm font-medium text-gray-700">
                    Total Appointments
                  </p>
                  <p className="text-sm text-gray-600">
                    {cabinet.totalAppointments.toLocaleString()}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Book appointment button (mobile only) */}
          <div className="lg:hidden">
            <Dialog>
              <DialogTrigger asChild>
                <Button
                  size="lg"
                  className="w-full bg-[#3b82f6] hover:bg-[#3b82f6]/90"
                >
                  Book Appointment
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[500px]">
                {/* Same content as the other dialog */}
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </div>
      {/* Comments Section Component */}
      <CommentsSection
        comments={comments}
        onAddComment={handleAddComment}
        onUpdateComment={handleUpdateComment}
        onDeleteComment={handleDeleteComment}
      />
    </div>
  );
}
