"use client";

import { motion } from "framer-motion";
import Image from "next/image";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import dynamic from "next/dynamic";
const LoginForm = dynamic(() =>
  import("./_components/Login").then((m) => m.LoginForm)
);
const RegisterForm = dynamic(() =>
  import("./_components/register").then((m) => m.RegisterForm)
);

export default function AuthPage() {
  return (
    <div className="flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-5xl"
      >
        <Card className="bg-white/90 backdrop-blur-md min-h-[80vh] shadow-xl border border-gray-100 overflow-hidden grid md:grid-cols-2">
          {/* Left Side: Login/Register Forms */}
          <div className="p-6 md:p-8 order-2 md:order-1">
            <Tabs defaultValue="login" className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-6">
                <TabsTrigger
                  value="login"
                  className="text-blue-600 data-[state=active]:bg-blue-100"
                >
                  Login
                </TabsTrigger>
                <TabsTrigger
                  value="register"
                  className="text-blue-600 data-[state=active]:bg-blue-100"
                >
                  Register
                </TabsTrigger>
              </TabsList>

              {/* Login Tab */}
              <TabsContent value="login">
                <CardHeader className="p-0 mb-6">
                  <CardTitle className="text-2xl font-bold text-gray-800">
                    Welcome Back
                  </CardTitle>
                  <p className="text-gray-600">
                    Sign in to manage your cabinet
                  </p>
                </CardHeader>
                <CardContent className="p-0">
                  <LoginForm />
                </CardContent>
              </TabsContent>

              {/* Register Tab */}
              <TabsContent value="register">
                <CardHeader className="p-0 mb-6">
                  <CardTitle className="text-2xl font-bold text-gray-800">
                    Create Account
                  </CardTitle>
                  <p className="text-gray-600">
                    Join us to streamline your practice
                  </p>
                </CardHeader>
                <CardContent className="p-0">
                  <RegisterForm />
                </CardContent>
              </TabsContent>
            </Tabs>
          </div>

          {/* Right Side: Image and Text */}
          <div className="relative w-full h-full min-h-[50vh] md:min-h-0 overflow-hidden order-1 md:order-2">
            <div className="absolute inset-0 bg-black/40 z-10" />
            <Image
              alt="Healthcare professional"
              fill
              src="/patient2.jpg"
              className="object-cover rounded-r-lg"
              priority
            />
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="absolute bottom-6 left-6 z-20 text-white"
            >
              <h1 className="text-3xl md:text-4xl font-bold mb-3 leading-tight">
                Book and Manage <br /> with Ease
              </h1>
              <p className="text-sm md:text-base max-w-xs opacity-90">
                &quot;Health is not valued until sickness comes.&quot; <br /> —
                Thomas Fuller
              </p>
            </motion.div>
          </div>
        </Card>
      </motion.div>
    </div>
  );
}
