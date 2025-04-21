"use client";
import React from "react";
import {
  Search,
  Bell,
  Facebook,
  Twitter,
  Linkedin,
  Star,
  CalendarCheck,
  Shield,
  BarChart3,
  ArrowRight,
} from "lucide-react";
import { Hero } from "./_components/Hero";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";

const LandingPage = () => {

  return (
    <div className="flex min-h-screen flex-col">
      <Hero />
      <main className="flex-1">
        {/* Hero Section */}
        <section className="w-full py-12 md:py-24 lg:py-32 bg-gradient-to-b from-background to-muted">
          <div className="container px-4 md:px-6">
            <div className="grid gap-6 lg:grid-cols-2 lg:gap-12 items-center">
              <div className="flex flex-col justify-center space-y-4">
                <span className="inline-flex items-center rounded-lg bg-brand/10 px-3 py-1 text-sm font-semibold text-brand">
                  <ArrowRight className="h-4 w-4 mr-1" />
                  Simplifying Medical Appointments
                </span>
                <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl">
                  Medical Appointments Made Simple
                </h1>
                <p className="max-w-[600px] text-muted-foreground md:text-xl">
                  CarePortal connects patients with medical offices,
                  streamlining the appointment booking process for everyone.
                </p>
                <div className="flex flex-col gap-2 min-[400px]:flex-row">
                  <Button variant="brand" size="lg" asChild>
                    <Link href="/register">Sign Up Now</Link>
                  </Button>
                  <Button size="lg" variant="outline" asChild>
                    <Link href="#features">Learn More</Link>
                  </Button>
                </div>
              </div>
              <div className="flex justify-center">
                <Image
                  src="/call-patient-doctor.jpg"
                  alt="CarePortal Dashboard Preview"
                  width={500}
                  height={500}
                  className="rounded-lg object-cover"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="w-full py-12 md:py-24 bg-background">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <div className="inline-block rounded-lg bg-brand/10 px-3 py-1 text-sm text-brand">
                  Key Features
                </div>
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                  Why Choose CarePortal?
                </h2>
                <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Our platform offers a comprehensive solution for both patients
                  and medical office managers.
                </p>
              </div>
            </div>
            <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 mt-12">
              <div className="flex flex-col items-center space-y-2 rounded-lg border p-6 shadow-sm">
                <div className="rounded-full bg-brand/10 p-3">
                  <Search className="h-6 w-6 text-brand" />
                </div>
                <h3 className="text-xl font-bold">Easy Search</h3>
                <p className="text-center text-muted-foreground">
                  Find nearby medical offices by name or address with our
                  intuitive search.
                </p>
              </div>
              <div className="flex flex-col items-center space-y-2 rounded-lg border p-6 shadow-sm">
                <div className="rounded-full bg-brand/10 p-3">
                  <CalendarCheck className="h-6 w-6 text-brand" />
                </div>
                <h3 className="text-xl font-bold">Simple Booking</h3>
                <p className="text-center text-muted-foreground">
                  Book appointments based on real-time availability with just a
                  few clicks.
                </p>
              </div>
              <div className="flex flex-col items-center space-y-2 rounded-lg border p-6 shadow-sm">
                <div className="rounded-full bg-brand/10 p-3">
                  <Bell className="h-6 w-6 text-brand" />
                </div>
                <h3 className="text-xl font-bold">Smart Notifications</h3>
                <p className="text-center text-muted-foreground">
                  Receive timely updates about your appointments via email.
                </p>
              </div>
              <div className="flex flex-col items-center space-y-2 rounded-lg border p-6 shadow-sm">
                <div className="rounded-full bg-brand/10 p-3">
                  <Star className="h-6 w-6 text-brand" />
                </div>
                <h3 className="text-xl font-bold">Favorites & Reviews</h3>
                <p className="text-center text-muted-foreground">
                  Save your favorite medical offices and share your experience
                  after consultations.
                </p>
              </div>
              <div className="flex flex-col items-center space-y-2 rounded-lg border p-6 shadow-sm">
                <div className="rounded-full bg-brand/10 p-3">
                  <BarChart3 className="h-6 w-6 text-brand" />
                </div>
                <h3 className="text-xl font-bold">Powerful Dashboard</h3>
                <p className="text-center text-muted-foreground">
                  Manage appointments and view statistics with our comprehensive
                  dashboard.
                </p>
              </div>
              <div className="flex flex-col items-center space-y-2 rounded-lg border p-6 shadow-sm">
                <div className="rounded-full bg-brand/10 p-3">
                  <Shield className="h-6 w-6 text-brand" />
                </div>
                <h3 className="text-xl font-bold">Secure & Private</h3>
                <p className="text-center text-muted-foreground">
                  Your data is protected with industry-standard security and
                  GDPR compliance.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* For Patients Section */}
        <section id="patients" className="w-full py-12 md:py-24 bg-muted">
          <div className="container px-4 md:px-6">
            <div className="grid gap-6 lg:grid-cols-2 lg:gap-12 items-center">
              <div className="flex justify-center">
                <Image
                  src="/patient-image.jpg"
                  alt="Patient using CarePortal"
                  width={500}
                  height={400}
                  className="rounded-lg object-cover"
                />
              </div>
              <div className="flex flex-col justify-center space-y-4">
                <span className="inline-flex items-center rounded-lg bg-brand/10 px-3 py-1 text-sm font-semibold text-brand">
                  <ArrowRight className="h-4 w-4 mr-1" />
                  For Patients
                </span>
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl">
                  Find Care When You Need It
                </h2>
                <p className="text-muted-foreground md:text-xl">
                  CarePortal makes it easy to find and book appointments with
                  medical professionals in your area.
                </p>
                <ul className="space-y-2">
                  <li className="flex items-center gap-2">
                    <div className="rounded-full bg-brand/10 p-1">
                      <CalendarCheck className="h-4 w-4 text-brand" />
                    </div>
                    <span>Search for nearby medical offices</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="rounded-full bg-brand/10 p-1">
                      <CalendarCheck className="h-4 w-4 text-brand" />
                    </div>
                    <span>
                      Book appointments based on real-time availability
                    </span>
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="rounded-full bg-brand/10 p-1">
                      <CalendarCheck className="h-4 w-4 text-brand" />
                    </div>
                    <span>Manage and track your appointments</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="rounded-full bg-brand/10 p-1">
                      <CalendarCheck className="h-4 w-4 text-brand" />
                    </div>
                    <span>Save favorite medical offices</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="rounded-full bg-brand/10 p-1">
                      <CalendarCheck className="h-4 w-4 text-brand" />
                    </div>
                    <span>Share your experience with reviews</span>
                  </li>
                </ul>
                <Button variant="brand" asChild>
                  <Link href="/auth">Register as a Patient</Link>
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* For Managers Section */}
        <section id="managers" className="w-full py-12 md:py-24 bg-background">
          <div className="container px-4 md:px-6">
            <div className="grid gap-6 lg:grid-cols-2 lg:gap-12 items-center">
              <div className="flex flex-col justify-center space-y-4 order-2 lg:order-1">
                <span className="inline-flex items-center rounded-lg bg-brand/10 px-3 py-1 text-sm font-semibold text-brand">
                  <ArrowRight className="h-4 w-4 mr-1" />
                  For Medical Office Managers
                </span>
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl">
                  Streamline Your Practice
                </h2>
                <p className="text-muted-foreground md:text-xl">
                  CarePortal gives you the tools to efficiently manage your
                  medical office and appointments.
                </p>
                <ul className="space-y-2">
                  <li className="flex items-center gap-2">
                    <div className="rounded-full bg-brand/10 p-1">
                      <CalendarCheck className="h-4 w-4 text-brand" />
                    </div>
                    <span>Create and manage your medical office profile</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="rounded-full bg-brand/10 p-1">
                      <CalendarCheck className="h-4 w-4 text-brand" />
                    </div>
                    <span>View comprehensive appointment statistics</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="rounded-full bg-brand/10 p-1">
                      <CalendarCheck className="h-4 w-4 text-brand" />
                    </div>
                    <span>Filter and manage appointments efficiently</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="rounded-full bg-brand/10 p-1">
                      <CalendarCheck className="h-4 w-4 text-brand" />
                    </div>
                    <span>Receive notifications for new appointments</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="rounded-full bg-brand/10 p-1">
                      <CalendarCheck className="h-4 w-4 text-brand" />
                    </div>
                    <span>Set availability and manage closed days</span>
                  </li>
                </ul>
                <Button variant="brand" asChild>
                  <Link href="/auth">Register as a Manager</Link>
                </Button>
              </div>
              <div className="flex justify-center order-1 lg:order-2">
                <Image
                  src="/manager-image.jpg"
                  alt="Medical office manager using CarePortal"
                  width={500}
                  height={400}
                  className="rounded-lg object-cover"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Testimonials Section */}
        <section id="testimonials" className="w-full py-12 md:py-24 bg-muted">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                  What Our Users Say
                </h2>
                <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Hear from patients and medical office managers who use
                  CarePortal.
                </p>
              </div>
            </div>
            <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 mt-12">
              <div className="flex flex-col justify-between space-y-4 rounded-lg border p-6 shadow-sm">
                <div className="space-y-2">
                  <div className="flex space-x-0.5">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className="h-5 w-5 fill-yellow-500 text-yellow-500"
                      />
                    ))}
                  </div>
                  <p className="text-muted-foreground">
                    &quot;CarePortal has made finding and booking medical
                    appointments so much easier. I love being able to see
                    availability in real-time!&quot;
                  </p>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="rounded-full w-10 flex items-center justify-center h-10 bg-muted-foreground/10 p-1">
                    <span className="text-xl font-bold">S</span>
                  </div>
                  <div>
                    <p className="text-sm font-medium">Sarah L.</p>
                    <p className="text-xs text-muted-foreground">Patient</p>
                  </div>
                </div>
              </div>
              <div className="flex flex-col justify-between space-y-4 rounded-lg border p-6 shadow-sm">
                <div className="space-y-2">
                  <div className="flex space-x-0.5">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className="h-5 w-5 fill-yellow-500 text-yellow-500"
                      />
                    ))}
                  </div>
                  <p className="text-muted-foreground">
                    &quot;As a medical office manager, CarePortal has
                    streamlined our appointment process and reduced no-shows
                    with its notification system.&quot;
                  </p>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="rounded-full bg-muted-foreground/10 p-1">
                    <span className="text-xl w-10 flex items-center justify-center h-10 font-bold">
                      D
                    </span>
                  </div>
                  <div>
                    <p className="text-sm font-medium">Dr. Michael T.</p>
                    <p className="text-xs text-muted-foreground">
                      Office Manager
                    </p>
                  </div>
                </div>
              </div>
              <div className="flex flex-col justify-between space-y-4 rounded-lg border p-6 shadow-sm">
                <div className="space-y-2">
                  <div className="flex space-x-0.5">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className="h-5 w-5 fill-yellow-500 text-yellow-500"
                      />
                    ))}
                  </div>
                  <p className="text-muted-foreground">
                    &quot;The dashboard analytics have helped us optimize our
                    scheduling and improve patient satisfaction. Great
                    platform!&quot;
                  </p>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="rounded-full bg-muted-foreground/10 p-1">
                    <span className="text-xl w-10 flex items-center justify-center h-10 font-bold">
                      J
                    </span>
                  </div>
                  <div>
                    <p className="text-sm font-medium">Jessica R.</p>
                    <p className="text-xs text-muted-foreground">
                      Clinic Administrator
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="w-full  py-12 md:py-24 lg:py-32 bg-brand text-brand-foreground">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold text-white tracking-tighter sm:text-4xl md:text-5xl">
                  Ready to Simplify Medical Appointments?
                </h2>
                <p className="max-w-[900px] text-white md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Join CarePortal today and experience a better way to manage
                  medical appointments.
                </p>
              </div>
              <div className="flex flex-col gap-2 min-[400px]:flex-row">
                <Button size="lg" variant="secondary" asChild>
                  <Link href="/auth">Sign Up Now</Link>
                </Button>
                <Button
                  size="lg"
                  variant="ghost"
                  className="bg-transparent"
                  asChild
                >
                  <Link href="#features">Learn More</Link>
                </Button>
              </div>
            </div>
          </div>
        </section>
      </main>
      <footer className="bg-gray-900 text-gray-300 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-lg font-semibold mb-4">CarePortal</h3>
              <p className="text-sm">
                Making healthcare accessible to everyone.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
              <ul className="space-y-2">
                <li>
                  <a href="#" className="hover:text-white transition">
                    About Us
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition">
                    Find Doctors
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition">
                    For Clinics
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Legal</h3>
              <ul className="space-y-2">
                <li>
                  <a href="#" className="hover:text-white transition">
                    Privacy Policy
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition">
                    Terms of Service
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition">
                    Contact Us
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Follow Us</h3>
              <div className="flex space-x-4">
                <a href="#" className="hover:text-white transition">
                  <Facebook className="w-6 h-6" />
                </a>
                <a href="#" className="hover:text-white transition">
                  <Twitter className="w-6 h-6" />
                </a>
                <a href="#" className="hover:text-white transition">
                  <Linkedin className="w-6 h-6" />
                </a>
              </div>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-gray-800 text-center text-sm">
            © {new Date().getFullYear()} CarePortal. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
