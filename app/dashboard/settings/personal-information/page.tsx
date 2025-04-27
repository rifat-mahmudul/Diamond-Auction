"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { useSession } from "next-auth/react"
import { useQuery } from "@tanstack/react-query"
import { Pencil } from "lucide-react"
import Layout from "@/components/dashboard/layout"
import { toast } from "sonner"
import Image from "next/image"

export default function PersonalInformationPage() {
  const session = useSession()
  const userId = session.data?.user?.id
  console.log(userId);
  

  const { data: profileData, isLoading } = useQuery({
    queryKey: ["userProfile"],
    queryFn: async () => {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/profile/get/${userId}`, {
        headers: {
          Authorization: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2ODBjYjE2ZjM2ZDU4NzY2ODkyZWMyZWMiLCJpYXQiOjE3NDU2NjM2MDksImV4cCI6MTc0NjI2ODQwOX0.2hYcotZ8XfgRlj1H2i534IzlPWcO-iuhDZDUbntCeaQ`,
        },
      })
      if (!response.ok) {
        throw new Error("Failed to fetch profile data")
      }
      const data = await response.json()
      return data
    },
  })

  const [formData, setFormData] = useState({
    email: "",
    firstName: "",
    lastName: "",
    phone: "",
    bio: "",
    image: null as File | null | string,
    username: "",
  })
  const [previewUrl, setPreviewUrl] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    if (profileData?.data) {
      setFormData({
        email: profileData.data.email || "",
        firstName: profileData.data.firstName || "",
        lastName: profileData.data.lastName || "",
        phone: profileData.data.phone || "",
        bio: profileData.data.bio || "",
        image: profileData.data.image || null,
        username: profileData.data.username || "",
      })

      if (profileData.data.image) {
        setPreviewUrl(
          typeof profileData.data.image === "string"
            ? profileData.data.image
            : URL.createObjectURL(profileData.data.image as Blob),
        )
      }
    }
  }, [profileData])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]
      setFormData((prev) => ({ ...prev, image: file }))

      // Create preview URL
      const reader = new FileReader()
      reader.onload = () => {
        setPreviewUrl(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    const formDataToSend = new FormData()
    formDataToSend.append("email", formData.email || "")
    formDataToSend.append("firstName", formData.firstName || "")
    formDataToSend.append("lastName", formData.lastName || "")
    formDataToSend.append("phone", formData.phone || "")
    formDataToSend.append("bio", formData.bio || "")

    if (formData.image instanceof File) {
      formDataToSend.append("image", formData.image)
    }

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/profile/update/${userId}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2ODBjYjE2ZjM2ZDU4NzY2ODkyZWMyZWMiLCJpYXQiOjE3NDU2NjM2MDksImV4cCI6MTc0NjI2ODQwOX0.2hYcotZ8XfgRlj1H2i534IzlPWcO-iuhDZDUbntCeaQ`,
        },
        body: formDataToSend,
      })

      if (!response.ok) {
        throw new Error("Failed to update profile")
      }

      const result = await response.json()
      console.log("Profile updated successfully:", result)
    } catch (error) {
      console.error("Error updating profile:", error)
    } finally {
      setIsSubmitting(false)
      toast.success("Profile updated successfully",{ position: "top-right" })
    }
  }

  if (isLoading) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-full">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#6b614f]"></div>
        </div>
      </Layout>
    )
  }

  return (
    <Layout>
      <div className="space-y-6   ">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Settings</h1>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Link href="/dashboard" className="hover:underline">
              Dashboard
            </Link>
            <span>›</span>
            <span>Settings</span>
          </div>
        </div>

        {/* Profile Card */}
        <div className="border rounded-lg p-6 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-20 h-20 rounded-full overflow-hidden bg-gray-200">
              <Image
                src={previewUrl || "/placeholder.svg?height=80&width=80"}
                alt="Profile"
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <h2 className="text-xl font-bold">
                {formData.firstName} {formData.lastName}
              </h2>
              <p className="text-muted-foreground">@{formData.username || "username"}</p>
            </div>
          </div>
          <Button
            variant="outline"
            className="bg-[#6b614f] hover:bg-[#5c5343] text-white"
            onClick={() => document.getElementById("profile-image")?.click()}
          >
            <Pencil className="h-4 w-4 mr-2" /> Edit
          </Button>
          <input id="profile-image" type="file" accept="image/*" className="hidden" onChange={handleImageChange} />
        </div>

        {/* Personal Information Form */}
        <div className="border rounded-lg">
          <div className="p-6 flex items-center justify-between border-b">
            <h2 className="text-xl font-bold">Personal Information</h2>
            <Button
              variant="outline"
              className="bg-[#6b614f] hover:bg-[#5c5343] text-white"
              onClick={() => document.getElementById("submit-form")?.click()}
            >
              <Pencil className="h-4 w-4 mr-2" /> Edit
            </Button>
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label htmlFor="firstName" className="block text-sm font-medium">
                  First Name
                </label>
                <Input
                  id="firstName"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleInputChange}
                  placeholder="Enter your first name"
                  className="w-full"
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="lastName" className="block text-sm font-medium">
                  Last Name
                </label>
                <Input
                  id="lastName"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleInputChange}
                  placeholder="Enter your last name"
                  className="w-full"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label htmlFor="email" className="block text-sm font-medium">
                  Email Address
                </label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="Enter your email"
                  className="w-full"
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="phone" className="block text-sm font-medium">
                  Phone
                </label>
                <Input
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  placeholder="Enter your phone number"
                  className="w-full"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label htmlFor="bio" className="block text-sm font-medium">
                Bio
              </label>
              <Textarea
                id="bio"
                name="bio"
                value={formData.bio}
                onChange={handleInputChange}
                placeholder="Tell us about yourself"
                rows={6}
                className="w-full"
              />
            </div>

            <div className="flex items-center gap-4">
        
              <Button
                id="submit-form"
                type="submit"
                className="bg-[#6b614f] hover:bg-[#5c5343] text-white"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Saving..." : "Save Changes"}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </Layout>
  )
}
