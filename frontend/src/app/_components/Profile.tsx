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

import { Check, Eye, EyeOff, Loader, Pencil, User2, X } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useUserState } from "@/store/userStore";
import axios from "@/lib/axios";
import { toast } from "sonner";
import ProfileImage from "./ProfileImage";
import { UserType } from "@/types";

export default function ProfileModal() {
  const [open, setOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordError, setPasswordError] = useState("");
  const [loading, setLoading] = useState(false);
  const [loadingPass, setLoadingPass] = useState(false);
  const { user, setUser } = useUserState();

  const [editedProfile, setEditedProfile] = useState<
    Partial<UserType> & { image?: string | File }
  >({
    ...user,
  });
  const [passwords, setPasswords] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  if (!user) {
    return (
      <DialogTrigger asChild>
        <div className="px-2 flex items-center gap-x-2 rounded-sm cursor-pointer text-neutral-800 py-1 hover:bg-gray-100">
          <User2 className="w-4 h-4" />
          Loading...
        </div>
      </DialogTrigger>
    );
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setEditedProfile((prev) => ({ ...prev, [name]: value }));
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPasswords((prev) => ({ ...prev, [name]: value }));
    if (passwordError) setPasswordError("");
  };

  const handleSaveProfile = async () => {
    try {
      setLoading(true);
      const { username, email, phone, image } = editedProfile;

      // Validation
      if (!username || !email || !phone) {
        toast.error("All fields are required!");
        setLoading(false);
        return;
      }
      if (!/^\S+@\S+\.\S+$/.test(email)) {
        toast.error("Invalid email format!");
        setLoading(false);
        return;
      }

      // Prepare FormData
      const formData = new FormData();
      formData.append("username", username);
      formData.append("email", email);
      formData.append("phone", phone);
      if (image) {
        formData.append("image", image);
      }

      // Send the request with FormData directly
      const res = await axios.post("/user/profile", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (res.status === 200) {
        toast.success("Profile updated successfully!");
        setUser(res.data.user);
        setIsEditing(false);
      }

      //@ts-expect-error to many types
    } catch (error: AxiosError) {
      console.log("Error:", error.response?.data);
      const message =
        error.response?.data?.error ||
        error.response?.data?.errors?.[0] ||
        "Failed to update profile";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };
  const handleResetPassword = async () => {
    if (passwords.newPassword !== passwords.confirmPassword) {
      setPasswordError("New passwords don't match");
      return;
    }
    if (passwords.newPassword.length < 8) {
      setPasswordError("Password must be at least 8 characters");
      return;
    }
    try {
      setLoadingPass(true);
      const res = await axios.put("/user/password", {
        old_password: passwords.oldPassword,
        new_password: passwords.newPassword,
      });
      if (res.status === 200) {
        toast.success("Password updated successfully!");
        setPasswords({ oldPassword: "", newPassword: "", confirmPassword: "" });
        setPasswordError("");
      }
      //@ts-expect-error it's hard to explecitly define the response
    } catch (error: AxiosError) {
      setPasswordError(
        error.response?.data?.error || "Failed to reset password"
      );
    } finally {
      setLoadingPass(false);
    }
  };

  const handleCancel = () => {
    setEditedProfile({ ...user });
    setIsEditing(false);
    setPasswords({ oldPassword: "", newPassword: "", confirmPassword: "" });
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
      {user && (
        <DialogContent className="sm:max-w-[550px]  overflow-hidden">
          <div className="px-6 py-10 relative">
            <div className="flex justify-center items-start mt-[-40px]">
              <ProfileImage
                editedProfile={editedProfile}
                setEditedProfile={setEditedProfile}
                user={user}
                isEditing={isEditing}
              />
            </div>
            <DialogHeader className="mt-4">
              <DialogTitle className="text-2xl font-bold text-center">
                {user.username}
              </DialogTitle>
              <DialogDescription className="text-sm text-center">
                @{user.username}
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
                  <Button variant="brand" size="sm" onClick={handleSaveProfile}>
                    {loading ? (
                      <Loader className="w-4 h-4 animate-spin mr-1" />
                    ) : (
                      <Check className="h-4 w-4 mr-1" />
                    )}
                    {loading ? "Loading" : "Save"}
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
                          <Label className="text-sm font-medium">
                            Username
                          </Label>
                          <span className="col-span-3 text-sm">
                            {user.username}
                          </span>
                        </div>
                        <div className="grid grid-cols-4 items-center">
                          <Label className="text-sm font-medium">Email</Label>
                          <span className="col-span-3 text-sm">
                            {user.email}
                          </span>
                        </div>
                        <div className="grid grid-cols-4 items-center">
                          <Label className="text-sm font-medium">Phone</Label>
                          <span className="col-span-3 text-sm">
                            {user.phone}
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
                      Change your password here. After saving, you&apos;ll be
                      logged out.
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
                      <Button
                        variant="brand"
                        disabled={loadingPass}
                        onClick={handleResetPassword}
                      >
                        {loadingPass && (
                          <Loader className="w-4 h-4 animate-spin mr-1" />
                        )}
                        {loadingPass ? "Loading..." : "Reset Password"}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </DialogContent>
      )}
    </Dialog>
  );
}
