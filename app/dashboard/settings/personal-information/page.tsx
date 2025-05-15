"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useQuery } from "@tanstack/react-query"
import { useSession } from "next-auth/react"
import { toast } from "sonner"
import Link from "next/link"
import { Pencil } from "lucide-react"
import Layout from "@/components/dashboard/layout"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import EditProfileForm from "./_components/EditProfileForm"
import Image from "next/image"

export default function PersonalInformationPage() {
  const { data: sessionData, status: sessionStatus } = useSession()
  const userId = sessionData?.user?.id
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [activeSection, setActiveSection] = useState<"profile" | "personal">("profile")
  const [profileFormData, setProfileFormData] = useState<{
    email: string
    firstName: string
    lastName: string
    phone: string
    bio: string
    image: File | null
    username: string
  }>({
    email: "",
    firstName: "",
    lastName: "",
    phone: "",
    bio: "",
    image: null,
    username: "",
  })
  const [previewUrl, setPreviewUrl] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const { data: profileData, isLoading } = useQuery({
    queryKey: ["userProfile", userId],
    queryFn: async () => {
      if (!userId) return null
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/profile/get/${userId}`, {
        headers: {
          Authorization: `Bearer ${sessionData?.user?.accessToken}`,
        },
      })
      if (!response.ok) {
        throw new Error("Failed to fetch profile data")
      }
      return await response.json()
    },
    enabled: !!userId,
  })

  useEffect(() => {
    if (profileData?.data) {
      const { data } = profileData
      setProfileFormData({
        email: data.email || "",
        firstName: data.firstName || "",
        lastName: data.lastName || "",
        phone: data.phone || "",
        bio: data.bio || "",
        image: data.image || null,
        username: data.username || "",
      })

      if (data.image) {
        setPreviewUrl(typeof data.image === "string" ? data.image : URL.createObjectURL(data.image))
      }
    }
  }, [profileData])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setProfileFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      const file = e.target.files[0]
      setProfileFormData((prev) => ({ ...prev, image: file }))
      const reader = new FileReader()
      reader.onload = () => setPreviewUrl(reader.result as string)
      reader.readAsDataURL(file)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!userId) return

    setIsSubmitting(true)

    const formDataToSend = new FormData()
    formDataToSend.append("email", profileFormData.email)
    formDataToSend.append("firstName", profileFormData.firstName)
    formDataToSend.append("lastName", profileFormData.lastName)
    formDataToSend.append("phone", profileFormData.phone)
    formDataToSend.append("bio", profileFormData.bio)
    formDataToSend.append("username", profileFormData.username)

    if (profileFormData.image !== null && profileFormData.image instanceof File) {
      formDataToSend.append("image", profileFormData.image)
    }

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/profile/update/${userId}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${sessionData?.user?.accessToken}`,
        },
        body: formDataToSend,
      })

      if (!response.ok) {
        throw new Error("Failed to update profile")
      }

      await response.json()
      toast.success("Profile updated successfully")
      setIsModalOpen(false)
    } catch (error) {
      console.error("Error updating profile:", error)
      toast.error("Failed to update profile")
    } finally {
      setIsSubmitting(false)
    }
  }

  const openEditModal = (section: "profile" | "personal") => {
    setActiveSection(section)
    setIsModalOpen(true)
  }

  if (isLoading || sessionStatus === "loading") {
    return (
      <Layout>
        <div className="flex items-center justify-center h-full">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#B0B0B0]"></div>
        </div>
      </Layout>
    )
  }

  return (
    <Layout>
      <div className="space-y-6 ">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Settings</h1>
          <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
            <Link href="/dashboard" className="hover:underline">
              Dashboard
            </Link>
            <span>›</span>
            <span>Settings</span>
          </div>
        </div>

        {/* Profile Card Section */}
        <div className="bg-white rounded-lg border p-6">
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center gap-4">
              <div className="h-20 w-20 rounded-full overflow-hidden border">
                <Image
                  src={previewUrl || "/placeholder.svg?height=64&width=64&query=avatar"}
                  alt="Profile"
                  width={1000}
                  height={1000}
                  className="h-full w-full object-cover"
                />
              </div>
              <div>
                <h2 className="text-lg font-medium">
                  {profileFormData.firstName} {profileFormData.lastName}
                </h2>
                <p className="text-sm text-muted-foreground">@{profileFormData.username}</p>
              </div>
            </div>
            <Button variant="outline" size="sm" className="h-8 px-3 text-xs" onClick={() => openEditModal("profile")}>
              <Pencil className="h-3 w-3 mr-1" /> Edit
            </Button>
          </div>
        </div>

        {/* Personal Information Section */}
        <div className="bg-white rounded-lg border">
          <div className="flex justify-between items-center p-6 pb-4">
            <h2 className="text-lg font-medium">Personal Information</h2>
            <Button variant="outline" size="sm" className="h-8 px-3 text-xs" onClick={() => openEditModal("personal")}>
              <Pencil className="h-3 w-3 mr-1" /> Edit
            </Button>
          </div>
          <Separator />
          <div className="p-6 grid gap-6">
            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className="text-sm font-medium block mb-2">First Name</label>
                <div className="border rounded-md p-2.5 bg-gray-50">{profileFormData.firstName}</div>
              </div>
              <div>
                <label className="text-sm font-medium block mb-2">Last Name</label>
                <div className="border rounded-md p-2.5 bg-gray-50">{profileFormData.lastName}</div>
              </div>
            </div>
            <div>
              <label className="text-sm font-medium block mb-2">Email Address</label>
              <div className="border rounded-md p-2.5 bg-gray-50">{profileFormData.email}</div>
            </div>
            <div>
              <label className="text-sm font-medium block mb-2">Phone</label>
              <div className="border rounded-md p-2.5 bg-gray-50">{profileFormData.phone}</div>
            </div>
            <div>
              <label className="text-sm font-medium block mb-2">Bio</label>
              <div className="border rounded-md p-2.5 bg-gray-50 min-h-[100px] whitespace-pre-wrap">
                {profileFormData.bio}
              </div>
            </div>
          </div>
        </div>

        {/* Edit Modal */}
        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
          <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Edit {activeSection === "profile" ? "Profile" : "Personal Information"}</DialogTitle>
            </DialogHeader>
            <EditProfileForm
              formData={profileFormData}
              previewUrl={previewUrl}
              isSubmitting={isSubmitting}
              onInputChange={handleInputChange}
              onImageChange={handleImageChange}
              onSubmit={handleSubmit}
              onCancel={() => setIsModalOpen(false)}
            />
          </DialogContent>
        </Dialog>
      </div>
    </Layout>
  )
}
