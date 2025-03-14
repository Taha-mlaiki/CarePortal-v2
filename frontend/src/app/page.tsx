"use client";
import React, { useState } from "react";
import {
  Search,
  Calendar,
  Bell,
  Clock,
  Hospital,
  ChevronDown,
  ChevronRight,
  Facebook,
  Twitter,
  Linkedin,
} from "lucide-react";
import { Hero } from "./_components/Hero";

const LandingPage = () => {
  const [openFaq, setOpenFaq] = useState<null | number>(null);
  const [currentTestimonial, setCurrentTestimonial] = useState(0);

  const testimonials = [
    {
      name: "Sarah Johnson",
      role: "Patient",
      text: "CarePortal made it incredibly easy to find and book an appointment with a specialist. The interface is intuitive, and I received instant confirmation!",
    },
    {
      name: "Dr. Michael Chen",
      role: "Family Physician",
      text: "As a healthcare provider, CarePortal has streamlined our booking process significantly. Our patients love the convenience it offers.",
    },
    {
      name: "Emily Rodriguez",
      role: "Patient",
      text: "The real-time availability feature saved me so much time. No more calling multiple clinics to find an available slot!",
    },
  ];

  const faqs = [
    {
      question: "How do I book an appointment?",
      answer:
        "Simply search for a clinic or doctor, select your preferred time slot, and confirm your booking. You'll receive an instant confirmation via email.",
    },
    {
      question: "Can I cancel or reschedule my appointment?",
      answer:
        "Yes, you can modify or cancel your appointment up to 24 hours before the scheduled time through your CarePortal account.",
    },
    {
      question: "Are my medical details secure?",
      answer:
        "Absolutely. We follow strict HIPAA guidelines and use industry-standard encryption to protect your personal and medical information.",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <Hero />

      {/* How It Works Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            How It Works
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: <Search className="w-8 h-8" />,
                title: "Search a Clinic",
                description: "Find trusted healthcare providers in your area",
              },
              {
                icon: <Calendar className="w-8 h-8" />,
                title: "Choose a Doctor",
                description: "Select your preferred doctor and time slot",
              },
              {
                icon: <Bell className="w-8 h-8" />,
                title: "Book & Get Notified",
                description: "Receive instant confirmation and reminders",
              },
            ].map((step, index) => (
              <div
                key={index}
                className="text-center p-6 bg-gray-50 rounded-xl"
              >
                <div className="inline-block p-4 bg-blue-100 rounded-full text-blue-600 mb-4">
                  {step.icon}
                </div>
                <h3 className="text-xl font-semibold mb-2">{step.title}</h3>
                <p className="text-gray-600">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Key Features Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            Key Features
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2  gap-8">
            {[
              {
                icon: <Calendar className="w-6 h-6" />,
                title: "Instant Booking",
                description: "Schedule appointments with just a few clicks",
              },
              {
                icon: <Clock className="w-6 h-6" />,
                title: "Real-time Availability",
                description: "See available time slots instantly",
              },
              {
                icon: <Bell className="w-6 h-6" />,
                title: "Email And in-app Notifications",
                description: "Get timely updates about your appointments",
              },
              {
                icon: <Hospital className="w-6 h-6" />,
                title: "Cabinet Management",
                description: "Efficient scheduling for healthcare providers",
              },
            ].map((feature, index) => (
              <div
                key={index}
                className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition"
              >
                <div className="text-blue-600 mb-4">{feature.icon}</div>
                <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            What Our Users Say
          </h2>
          <div className="relative">
            <div className="flex overflow-hidden">
              {testimonials.map((testimonial, index) => (
                <div
                  key={index}
                  className={`w-full flex-shrink-0 transition-transform duration-500 transform ${
                    index === currentTestimonial
                      ? "translate-x-0"
                      : "translate-x-full"
                  }`}
                >
                  <div className="bg-gray-50 p-8 rounded-xl max-w-2xl mx-auto">
                    <p className="text-gray-600 italic mb-4">
                      {testimonial.text}
                    </p>
                    <div className="font-semibold">{testimonial.name}</div>
                    <div className="text-gray-500 text-sm">
                      {testimonial.role}
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="flex justify-center mt-8 space-x-2">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  className={`w-3 h-3 rounded-full ${
                    index === currentTestimonial ? "bg-blue-600" : "bg-gray-300"
                  }`}
                  onClick={() => setCurrentTestimonial(index)}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* FAQs Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            Frequently Asked Questions
          </h2>
          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <div key={index} className="bg-white rounded-lg shadow-sm">
                <button
                  className="w-full px-6 py-4 flex justify-between items-center"
                  onClick={() => setOpenFaq(openFaq === index ? null : index)}
                >
                  <span className="font-semibold text-left">
                    {faq.question}
                  </span>
                  {openFaq === index ? (
                    <ChevronDown className="w-5 h-5" />
                  ) : (
                    <ChevronRight className="w-5 h-5" />
                  )}
                </button>
                {openFaq === index && (
                  <div className="px-6 pb-4">
                    <p className="text-gray-600">{faq.answer}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>


      {/* Footer */}
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
