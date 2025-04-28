"use client";

import { useForm } from "react-hook-form";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { useSession } from "next-auth/react";
import Image from "next/image";

const BASE_URL = "http://localhost:5100/api/v1";

const placeholderImg = "data:image/jpeg;base64,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"

interface Address {
  street: string;
  city: string;
  country: string;
  postalCode: string;
  taxId: string;
}

interface UserProfile {
  _id: string;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  phone: string;
  bio: string;
  image: string;
  address: Address;
}

interface FormValues {
  firstName: string;
  lastName: string;
  bio: string;
  address: Address;
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export default function SettingsPage() {
  const session = useSession();

  const userID = session?.data?.user.id;
  const token = session?.data?.user?.accessToken;

  const {
    register,
    handleSubmit,
    reset,
    setError,
    formState: { errors },
  } = useForm<FormValues>();

  const [loading, setLoading] = useState(true);
  const [savingProfile, setSavingProfile] = useState(false);
  const [changingPassword, setChangingPassword] = useState(false);

  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      if (!userID || !token) return;
      try {
        const response = await fetch(`${BASE_URL}/profile/get/${userID}`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await response.json();

        if (data.status) {
          const profile: UserProfile = data.data;
          reset({
            firstName: profile.firstName,
            lastName: profile.lastName,
            bio: profile.bio,
            address: profile.address,
            currentPassword: "",
            newPassword: "",
            confirmPassword: "",
          });
          setPreviewImage(profile.image || null);
        } else {
          console.error("Failed to fetch profile:", data.message);
        }
      } catch (error) {
        console.error("Error fetching profile:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [userID, token, reset]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedImage(file);
      setPreviewImage(URL.createObjectURL(file));
    }
  };

  const handleProfileUpdate = async (data: FormValues) => {
    if (!userID || !token) return;
    setSavingProfile(true);

    try {
      const formData = new FormData();
      formData.append("firstName", data.firstName);
      formData.append("lastName", data.lastName);
      formData.append("bio", data.bio);
      formData.append("address[street]", data.address.street);
      formData.append("address[city]", data.address.city);
      formData.append("address[country]", data.address.country);
      formData.append("address[postalCode]", data.address.postalCode);
      formData.append("address[taxId]", data.address.taxId);

      if (selectedImage) {
        formData.append("image", selectedImage);
      }

      const profileResponse = await fetch(`${BASE_URL}/profile/update/${userID}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      const profileData = await profileResponse.json();

      if (profileData.status === true) {
        toast.success("Profile updated successfully!");
      } else {
        toast.error(profileData.message || "Failed to update profile");
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error("Something went wrong");
    } finally {
      setSavingProfile(false);
    }
  };

  const handleChangePassword = async (data: FormValues) => {
    if (!userID || !token) return;

    if (data.newPassword !== data.confirmPassword) {
      setError("confirmPassword", { message: "New passwords do not match" });
      return;
    }

    setChangingPassword(true);

    try {
      const passwordResponse = await fetch(`${BASE_URL}/profile/password/${userID}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          currentPassword: data.currentPassword,
          newPassword: data.newPassword,
          confirmPassword: data.confirmPassword,
        }),
      });

      const passwordData = await passwordResponse.json();

      if (passwordData.status) {
        toast.success("Password updated successfully!");
      } else {
        toast.error(passwordData.message || "Failed to update password");
      }
    } catch (error) {
      console.error("Error changing password:", error);
      toast.error("Something went wrong");
    } finally {
      setChangingPassword(false);
    }
  };

  if (loading) {
    return <div className="flex justify-center p-8">Loading profile...</div>;
  }

  return (
    <form>
      <div className="space-y-8 text-[#645949]">
        {/* Personal Information */}
        <Card className="bg-[#eee5da] p-5">
          <CardHeader>
            <CardTitle className="text-xl font-bold mb-5">Edit Personal Information</CardTitle>
          </CardHeader>
          <div className="flex items-center space-x-4 mb-6">
            <div className="relative">
              <Image
                src={previewImage || placeholderImg}
                alt="Profile"
                width={96}
                height={96}
                className="h-24 w-24 border-2 border-[#645949] rounded-full"
              />
              <label
                htmlFor="profileImage"
                className="absolute bottom-0 right-0 bg-[#645949] p-1 rounded-full cursor-pointer"
                title="Change Photo"
              >
                ✏️
              </label>
              <input
                id="profileImage"
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleImageChange}
              />
            </div>
          </div>

          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="firstName">First Name</Label>
                <Input
                  id="firstName"
                  {...register("firstName", { required: true })}
                  className="p-3"
                />
                {errors.firstName && (
                  <p className="text-red-500 text-sm">First name is required</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName">Last Name</Label>
                <Input
                  id="lastName"
                  {...register("lastName", { required: true })}
                />
                {errors.lastName && (
                  <p className="text-red-500 text-sm">Last name is required</p>
                )}
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="bio">Bio</Label>
              <Textarea
                id="bio"
                {...register("bio")}
                className="min-h-[100px]"
              />
            </div>
          </CardContent>
        </Card>

        {/* Address */}
        <Card className="bg-[#eee5da] p-5">
          <CardHeader>
            <CardTitle className="text-xl font-bold mb-5">Edit Address</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="address.country">Country</Label>
              <Input id="address.country" {...register("address.country")} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="address.city">City/State</Label>
              <Input id="address.city" {...register("address.city")} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="address.street">Road/Area</Label>
              <Input id="address.street" {...register("address.street")} />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="address.postalCode">Postal Code</Label>
                <Input id="address.postalCode" {...register("address.postalCode")} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="address.taxId">TAX ID</Label>
                <Input id="address.taxId" {...register("address.taxId")} />
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end">
          <Button
            type="button"
            onClick={handleSubmit(handleProfileUpdate)}
            disabled={savingProfile}
            className="bg-[#645949] px-10"
          >
            {savingProfile ? "Saving..." : "Save Profile"}
          </Button>
        </div>

        {/* Change Password */}
        <Card className="bg-[#eee5da] p-5">
          <CardHeader>
            <CardTitle className="text-xl font-bold mb-5">Change Password</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="currentPassword">Current Password</Label>
              <Input
                id="currentPassword"
                type="password"
                {...register("currentPassword")}
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="newPassword">New Password</Label>
                <Input
                  id="newPassword"
                  type="password"
                  {...register("newPassword")}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm New Password</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  {...register("confirmPassword")}
                />
                {errors.confirmPassword && (
                  <p className="text-red-500 text-sm">
                    {errors.confirmPassword.message}
                  </p>
                )}
              </div>
            </div>
            <div className="flex justify-end">
              <Button
                type="button"
                onClick={handleSubmit(handleChangePassword)}
                disabled={changingPassword}
                className="bg-[#645949] px-10"
              >
                {changingPassword ? "Changing..." : "Change Password"}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </form>
  );
}

