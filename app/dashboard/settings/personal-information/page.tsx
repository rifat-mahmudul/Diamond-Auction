"use client";

import type React from "react";

import { useState, useEffect } from "react";
import Layout from "@/components/dashboard/layout";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useUserProfile, useUpdateUserProfile } from "@/hooks/use-queries";
import Image from "next/image";

// Mock user ID - in a real app, you would get this from auth context
const USER_ID = "6805c5f4ce1d5ee574941f39";

export default function PersonalInformationPage() {
  const { data: profileData, isLoading } = useUserProfile(USER_ID);
  const updateProfileMutation = useUpdateUserProfile();

  const [formData, setFormData] = useState({
    email: "",
    firstName: "",
    lastName: "",
    phone: "",
    bio: "",
    image: null as File | null,
  });
  const [previewUrl, setPreviewUrl] = useState("");

  useEffect(() => {
    if (profileData?.data) {
      const { email, firstName, lastName, phone, bio, image } =
        profileData.data;
      setFormData({
        email: email || "",
        firstName: firstName || "",
        lastName: lastName || "",
        phone: phone || "",
        bio: bio || "",
        image: null,
      });
      setPreviewUrl(image || "");
    }
  }, [profileData]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setFormData((prev) => ({ ...prev, image: file }));

      // Create preview URL
      const reader = new FileReader();
      reader.onload = () => {
        setPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const formDataToSend = new FormData();
    formDataToSend.append("email", formData.email);
    formDataToSend.append("firstName", formData.firstName);
    formDataToSend.append("lastName", formData.lastName);
    formDataToSend.append("phone", formData.phone);
    formDataToSend.append("bio", formData.bio);

    if (formData.image) {
      formDataToSend.append("image", formData.image);
    }

    updateProfileMutation.mutate({ id: USER_ID, data: formDataToSend });
  };

  if (isLoading) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-full">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#6b614f]"></div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">
            Personal Information
          </h1>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Link href="/dashboard" className="hover:underline">
              Dashboard
            </Link>
            <span>→</span>
            <Link href="/settings" className="hover:underline">
              Setting
            </Link>
            <span>→</span>
            <span>Personal Information</span>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8 max-w-2xl">
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="firstName">First Name</Label>
                <Input
                  id="firstName"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleInputChange}
                  placeholder="Enter your first name"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName">Last Name</Label>
                <Input
                  id="lastName"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleInputChange}
                  placeholder="Enter your last name"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="Enter your email"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">Phone</Label>
              <Input
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                placeholder="Enter your phone number"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="bio">Bio</Label>
              <Textarea
                id="bio"
                name="bio"
                value={formData.bio}
                onChange={handleInputChange}
                placeholder="Tell us about yourself"
                rows={4}
              />
            </div>

            <div className="space-y-2">
              <Label>Profile Image</Label>
              <div className="flex items-start gap-4">
                <div className="w-24 h-24 rounded-full overflow-hidden bg-gray-200 flex items-center justify-center">
                  {previewUrl ? (
                    <Image
                      src={previewUrl || "/placeholder.svg"}
                      alt="Profile"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span className="text-gray-500">No Image</span>
                  )}
                </div>
                <div className="space-y-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() =>
                      document.getElementById("profile-image")?.click()
                    }
                  >
                    Change Image
                  </Button>
                  <input
                    id="profile-image"
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleImageChange}
                  />
                  <p className="text-sm text-muted-foreground">
                    Recommended: Square image, at least 300x300px
                  </p>
                </div>
              </div>
            </div>
          </div>

          <Button
            type="submit"
            className="bg-[#6b614f] hover:bg-[#5c5343]"
            disabled={updateProfileMutation.isPending}
          >
            {updateProfileMutation.isPending ? "Saving..." : "Save Changes"}
          </Button>
        </form>
      </div>
    </Layout>
  );
}
