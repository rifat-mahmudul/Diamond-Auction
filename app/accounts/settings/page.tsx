"use client";

import { useState, useEffect, type FormEvent } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { useSession } from "next-auth/react";

// Static user ID for now
const BASE_URL = "http://localhost:5100/api/v1";

interface UserProfile {
  _id: string;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  phone: string;
  bio: string;
  image: string;
  address: {
    street: string;
    city: string;
    country: string;
    postalCode: string;
    taxId: string;
  };
}

export default function SettingsPage() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");

  const session = useSession();
  const userID = session?.data?.user.id;

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await fetch(`${BASE_URL}/profile/get/${userID}`, {
          method: "GET",
          headers: {
            Authorization: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2ODBjNjNkOGRlMTczNTI3NjI5NzQ2MGIiLCJpYXQiOjE3NDU2NjQ5MjUsImV4cCI6MTc0NjI2OTcyNX0.CqH9So7JTspw-P3l-W91lNMTn1gUTFRMkQm8siZIf2s`,
          },
        });
        const data = await response.json();

        if (data.status) {
          setProfile(data.data);
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
  }, [userID]);

  const handleProfileUpdate = async (e: FormEvent) => {
    e.preventDefault();
    if (!profile) return;

    setSaving(true);
    try {
      const formData = new FormData();

      // Add all profile fields to formData
      formData.append("email", profile.email);
      formData.append("firstName", profile.firstName);
      formData.append("lastName", profile.lastName);
      formData.append("phone", profile.phone);
      formData.append("bio", profile.bio);
      formData.append("address[street]", profile.address.street);
      formData.append("address[city]", profile.address.city);
      formData.append("address[country]", profile.address.country);
      formData.append("address[postalCode]", profile.address.postalCode);
      formData.append("address[taxId]", profile.address.taxId);

      // If there's an image file to upload, add it
      // Note: This would need to be handled with a file input in a real implementation

      const response = await fetch(`${BASE_URL}/profile/update/${userID}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2ODBjNjNkOGRlMTczNTI3NjI5NzQ2MGIiLCJpYXQiOjE3NDU2NjQ5MjUsImV4cCI6MTc0NjI2OTcyNX0.CqH9So7JTspw-P3l-W91lNMTn1gUTFRMkQm8siZIf2s`,
        },
        body: formData,
      });

      const data = await response.json();

      if (data.status) {
        toast("Your profile has been updated successfully.");
      } else {
        toast("Failed to update profile");
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      toast("An error occurred while updating your profile");
    } finally {
      setSaving(false);
    }

    setPasswordError("");

    if (newPassword !== confirmPassword) {
      setPasswordError("New passwords do not match");
      return;
    }

    setSaving(true);
    try {
      const response = await fetch(`${BASE_URL}/profile/password/${userID}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2ODBjNjNkOGRlMTczNTI3NjI5NzQ2MGIiLCJpYXQiOjE3NDU2NjQ5MjUsImV4cCI6MTc0NjI2OTcyNX0.CqH9So7JTspw-P3l-W91lNMTn1gUTFRMkQm8siZIf2s`,
        },
        body: JSON.stringify({
          currentPassword,
          newPassword,
          confirmPassword,
        }),
      });

      const data = await response.json();

      if (data.status) {
        toast("Your password has been changed successfully.");
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
      } else {
        setPasswordError(data.message || "Failed to update password");
        toast("Failed to update password.");
      }
    } catch (error) {
      console.error("Error changing password:", error);
      toast("An error occurred while updating your password");
    } finally {
      setSaving(false);
    }
  };

  // const handlePasswordChange = async (e: FormEvent) => {
  //   e.preventDefault();
    
  // };

  if (loading) {
    return <div className="flex justify-center p-8">Loading profile...</div>;
  }

  if (!profile) {
    return (
      <div className="flex justify-center p-8">Failed to load profile</div>
    );
  }

  return (
    <form onSubmit={handleProfileUpdate}>
      <div className="space-y-8 text-[#645949]">
          <Card className="bg-[#eee5da] p-5">
            <CardHeader>
              <CardTitle className="text-xl font-bold mb-5">
                Edit Personal Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName">First Name</Label>
                  <Input
                    id="firstName"
                    value={profile?.firstName || "First Name"}
                    onChange={(e) =>
                      setProfile({ ...profile, firstName: e.target.value })
                    }
                    className="p-3"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">Last Name</Label>
                  <Input
                    id="lastName"
                    value={profile.lastName || "Last Name"}
                    onChange={(e) =>
                      setProfile({ ...profile, lastName: e.target.value })
                    }
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="bio">Bio</Label>
                <Textarea
                  id="bio"
                  value={profile.bio || "Write about yourself."}
                  onChange={(e) =>
                    setProfile({ ...profile, bio: e.target.value })
                  }
                  className="min-h-[100px]"
                />
              </div>
            </CardContent>
          </Card>

          <Card className="mt-6 bg-[#eee5da] p-5">
            <CardHeader>
              <CardTitle className="text-xl font-bold mb-5">
                Edit Address
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="country">Country</Label>
                <Input
                  id="country"
                  value={profile?.address?.country || "Country"}
                  onChange={(e) =>
                    setProfile({
                      ...profile,
                      address: { ...profile.address, country: e.target.value },
                    })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="city">City/State</Label>
                <Input
                  id="city"
                  value={profile?.address?.city || "City"}
                  onChange={(e) =>
                    setProfile({
                      ...profile,
                      address: { ...profile.address, city: e.target.value },
                    })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="street">Road/Area</Label>
                <Input
                  id="street"
                  value={profile?.address?.street || "Country"}
                  onChange={(e) =>
                    setProfile({
                      ...profile,
                      address: { ...profile.address, street: e.target.value },
                    })
                  }
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="postalCode">Postal Code</Label>
                  <Input
                    id="postalCode"
                    value={profile?.address?.postalCode || "*****"}
                    onChange={(e) =>
                      setProfile({
                        ...profile,
                        address: {
                          ...profile.address,
                          postalCode: e.target.value,
                        },
                      })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="taxId">TAX ID</Label>
                  <Input
                    id="taxId"
                    value={profile?.address?.taxId || "xxxxxxxx"}
                    onChange={(e) =>
                      setProfile({
                        ...profile,
                        address: { ...profile.address, taxId: e.target.value },
                      })
                    }
                  />
                </div>
              </div>
              <div className="flex justify-end">
                <Button type="submit" disabled={saving}>
                  {saving ? "Saving..." : "Save"}
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card className="mt-6 bg-[#eee5da] p-5">
            <CardHeader>
              <CardTitle className="text-xl font-bold mb-5">
                Change password
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {passwordError && (
                <div className="bg-red-50 text-red-600 p-3 rounded-md text-sm">
                  {passwordError}
                </div>
              )}
              <div className="space-y-2">
                <Label htmlFor="currentPassword">Current Password</Label>
                <Input
                  id="currentPassword"
                  type="password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  required
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="newPassword">New Password</Label>
                  <Input
                    id="newPassword"
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirm New Password</Label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                  />
                </div>
              </div>
            </CardContent>
          </Card>

        <div className="flex justify-end">
          <Button type="submit" disabled={saving} className="bg-[#645949] px-10">
            {saving ? "Saving..." : "Save"}
          </Button>
        </div>
      </div>
    </form>
  );
}
