"use client";

import type React from "react";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Camera, Check, Eye, EyeOff, Pencil, User2, X } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function ProfileModal() {
  const [open, setOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordError, setPasswordError] = useState("");

  const [profile, setProfile] = useState({
    name: "Sarah Johnson",
    username: "sarahj",
    email: "sarah.johnson@example.com",
    phone: "+1 (555) 123-4567",
    avatar: "/placeholder.svg?height=100&width=100",
    coverImage: "/placeholder.svg?height=200&width=600",
  });

  const [editedProfile, setEditedProfile] = useState({ ...profile });

  const [passwords, setPasswords] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setEditedProfile((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPasswords((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear error when typing
    if (passwordError) setPasswordError("");
  };

  const handleSaveProfile = () => {
    setProfile({ ...editedProfile });
    setIsEditing(false);
  };

  const handleResetPassword = () => {
    if (passwords.newPassword !== passwords.confirmPassword) {
      setPasswordError("New passwords don't match");
      return;
    }

    if (passwords.newPassword.length < 8) {
      setPasswordError("Password must be at least 8 characters");
      return;
    }

    // Here you would typically call an API to update the password
    console.log("Password reset successful");

    // Reset form
    setPasswords({
      oldPassword: "",
      newPassword: "",
      confirmPassword: "",
    });

    setPasswordError("Password updated successfully!");
  };

  const handleCancel = () => {
    setEditedProfile({ ...profile });
    setIsEditing(false);
    setPasswords({
      oldPassword: "",
      newPassword: "",
      confirmPassword: "",
    });
    setPasswordError("");
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <div className="px-2 flex items-center gap-x-2 rounded-sm cursor-pointer text-neutral-800 py-1 hover:bg-gray-100">
          <User2 className="w-4 h-4" />
          Profile
        </div>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[550px]  overflow-hidden">
        <div className="px-6 py-10 relative">
          <div className="flex justify-center items-start mt-[-40px]">
            <div className="relative ">
              <Avatar className="h-32 w-32 border-4 border-background">
                <AvatarImage src={profile.avatar} alt={profile.name} />
                <AvatarFallback>{profile.name.substring(0, 2)}</AvatarFallback>
              </Avatar>
              {isEditing && (
                <Button
                  size="icon"
                  variant="secondary"
                  className="absolute bottom-3 right-3 h-6 w-6 rounded-full"
                >
                  <Camera className="h-3 w-3" />
                </Button>
              )}
            </div>
          </div>
          <DialogHeader className="mt-4">
            <DialogTitle className="text-2xl font-bold text-center">
              {profile.name}
            </DialogTitle>
            <DialogDescription className="text-sm text-center">
              @{profile.username}
            </DialogDescription>
          </DialogHeader>
          <div className="flex items-center justify-end">
            {!isEditing ? (
              <Button
                size="sm"
                variant="ghost"
                className="mt-10"
                onClick={() => setIsEditing(true)}
              >
                <Pencil className="h-4 w-4 mr-1" />
                Edit
              </Button>
            ) : (
              <div className="flex gap-2 mt-10">
                <Button size="sm" variant="ghost" onClick={handleCancel}>
                  <X className="h-4 w-4 mr-1" />
                  Cancel
                </Button>
                <Button size="sm" onClick={handleSaveProfile}>
                  <Check className="h-4 w-4 mr-1" />
                  Save
                </Button>
              </div>
            )}
          </div>

          <Tabs defaultValue="profile" className="mt-6">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="profile">Profile</TabsTrigger>
              <TabsTrigger value="password">Password</TabsTrigger>
            </TabsList>

            <TabsContent value="profile">
              <Card>
                <CardHeader>
                  <CardTitle>Profile Information</CardTitle>
                  <CardDescription>
                    View and update your profile details
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {!isEditing ? (
                    <>
                      <div className="grid grid-cols-4 items-center">
                        <Label className="text-sm font-medium">Username</Label>
                        <span className="col-span-3 text-sm">
                          {profile.username}
                        </span>
                      </div>
                      <div className="grid grid-cols-4 items-center">
                        <Label className="text-sm font-medium">Email</Label>
                        <span className="col-span-3 text-sm">
                          {profile.email}
                        </span>
                      </div>
                      <div className="grid grid-cols-4 items-center">
                        <Label className="text-sm font-medium">Phone</Label>
                        <span className="col-span-3 text-sm">
                          {profile.phone}
                        </span>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="username" className="text-right">
                          Username
                        </Label>
                        <Input
                          id="username"
                          name="username"
                          value={editedProfile.username}
                          onChange={handleInputChange}
                          className="col-span-3"
                        />
                      </div>
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="email" className="text-right">
                          Email
                        </Label>
                        <Input
                          id="email"
                          name="email"
                          type="email"
                          value={editedProfile.email}
                          onChange={handleInputChange}
                          className="col-span-3"
                        />
                      </div>
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="phone" className="text-right">
                          Phone
                        </Label>
                        <Input
                          id="phone"
                          name="phone"
                          type="tel"
                          value={editedProfile.phone}
                          onChange={handleInputChange}
                          className="col-span-3"
                        />
                      </div>
                    </>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="password">
              <Card>
                <CardHeader>
                  <CardTitle>Reset Password</CardTitle>
                  <CardDescription>
                    Change your password here. After saving, you'll be logged
                    out.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="oldPassword" className="text-right">
                      Current Password
                    </Label>
                    <div className="relative col-span-3">
                      <Input
                        id="oldPassword"
                        name="oldPassword"
                        type={showOldPassword ? "text" : "password"}
                        value={passwords.oldPassword}
                        onChange={handlePasswordChange}
                        className="pr-10"
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="absolute right-0 top-0 h-full px-3"
                        onClick={() => setShowOldPassword(!showOldPassword)}
                      >
                        {showOldPassword ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                  </div>

                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="newPassword" className="text-right">
                      New Password
                    </Label>
                    <div className="relative col-span-3">
                      <Input
                        id="newPassword"
                        name="newPassword"
                        type={showNewPassword ? "text" : "password"}
                        value={passwords.newPassword}
                        onChange={handlePasswordChange}
                        className="pr-10"
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="absolute right-0 top-0 h-full px-3"
                        onClick={() => setShowNewPassword(!showNewPassword)}
                      >
                        {showNewPassword ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                  </div>

                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="confirmPassword" className="text-right">
                      Confirm Password
                    </Label>
                    <div className="relative col-span-3">
                      <Input
                        id="confirmPassword"
                        name="confirmPassword"
                        type={showConfirmPassword ? "text" : "password"}
                        value={passwords.confirmPassword}
                        onChange={handlePasswordChange}
                        className="pr-10"
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="absolute right-0 top-0 h-full px-3"
                        onClick={() =>
                          setShowConfirmPassword(!showConfirmPassword)
                        }
                      >
                        {showConfirmPassword ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                  </div>

                  {passwordError && (
                    <div
                      className={`text-sm ${
                        passwordError.includes("successful")
                          ? "text-green-500"
                          : "text-destructive"
                      } mt-2`}
                    >
                      {passwordError}
                    </div>
                  )}

                  <div className="flex justify-end mt-4">
                    <Button onClick={handleResetPassword}>
                      Reset Password
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </DialogContent>
    </Dialog>
  );
}
