"use client"

import { useState, useEffect } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { ArrowRight, Edit2 } from "lucide-react"
import Link from "next/link"
// import { useRouter } from "next/navigation"
import { useSession } from "next-auth/react"

// Static user ID for now
const BASE_URL = "http://localhost:5100/api/v1"

interface UserProfile {
  _id: string
  username: string
  email: string
  firstName: string
  lastName: string
  phone: string
  bio: string
  image: string
  sellerId: string
  address: {
    street: string
    city: string
    country: string
    postalCode: string
    taxId: string
  }
}

export default function ProfilePage() {
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(true)
  // const router = useRouter();
  const session = useSession();
  
  const userID = session?.data?.user.id;
  const token = session

  console.log(token)
  console.log(userID)

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await fetch(`${BASE_URL}/profile/get/${userID}`, {
          method : "GET",
          headers : {
            Authorization : `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2ODBjNjNkOGRlMTczNTI3NjI5NzQ2MGIiLCJpYXQiOjE3NDU2NjQ5MjUsImV4cCI6MTc0NjI2OTcyNX0.CqH9So7JTspw-P3l-W91lNMTn1gUTFRMkQm8siZIf2s`
          }
        })
        const data = await response.json()

        console.log(data)

        if (data.status) {
          setProfile(data.data)
        } else {
          console.error("Failed to fetch profile:", data.message)
        }
      } catch (error) {
        console.error("Error fetching profile:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchProfile()
  }, [userID])

  if (loading) {
    return <div className="flex justify-center p-8">Loading profile...</div>
  }

  if (!profile) {
    return <div className="flex justify-center p-8">Failed to load profile</div>
  }

  return (
    <>
      <Card className="mb-8 bg-[#eee5da] text-[#645949]">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-6 items-center md:items-start">
            <Avatar className="h-24 w-24 border-2 border-amber-200">
              <AvatarImage src={profile.image || "/placeholder.svg"} alt={profile.username} />
              <AvatarFallback>
                {profile.firstName?.charAt(0)}
                {profile.lastName?.charAt(0)}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 text-center md:text-left">
              <h2 className="text-2xl font-semibold">
                {profile.firstName} {profile.lastName}
              </h2>
              <p className="text-muted-foreground">@{profile.username}</p>
              <p className="mt-1">
                {profile.address?.street}, {profile.address?.city}, {profile.address?.country}{" "}
                {profile.address?.postalCode}
              </p>
              <Button variant="secondary" size="sm" className="mt-4" asChild>
                <Link href="/dashboard">
                  <span className="flex items-center">
                    Go To Dashboard <ArrowRight className="ml-2 h-4 w-4" />
                  </span>
                </Link>
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="mb-8 bg-[#eee5da] p-8 text-[#645949]">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <h3 className="text-xl font-bold mb-5">Personal Information</h3>
          <Button variant="outline" size="sm" asChild>
            <Link href="/accounts/settings">
              <Edit2 className="h-4 w-4 mr-2" /> Edit
            </Link>
          </Button>
        </CardHeader>
        <CardContent className="grid gap-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="firstName">First Name</Label>
              <Input id="firstName" value={profile.firstName} readOnly />
            </div>
            <div>
              <Label htmlFor="lastName">Last Name</Label>
              <Input id="lastName" value={profile.lastName} readOnly />
            </div>
          </div>
          <div>
            <Label htmlFor="email">Email Address</Label>
            <Input id="email" value={profile.email} readOnly />
          </div>
          <div>
            <Label htmlFor="phone">Phone</Label>
            <Input id="phone" value={profile.phone} readOnly />
          </div>
          <div>
            <Label htmlFor="bio">Bio</Label>
            <Textarea id="bio" value={profile.bio} readOnly className="min-h-[100px]" />
          </div>
        </CardContent>
      </Card>

      <Card className="bg-[#eee5da] p-8 text-[#645949]">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <h3 className="text-xl font-bold mb-5">Address</h3>
          <Button variant="outline" size="sm" asChild>
            <Link href="/accounts/settings">
              <Edit2 className="h-4 w-4 mr-2" /> Edit
            </Link>
          </Button>
        </CardHeader>
        <CardContent className="grid gap-6">
          <div>
            <Label htmlFor="country">Country</Label>
            <Input id="country" value={profile.address?.country} readOnly />
          </div>
          <div>
            <Label htmlFor="city">City/State</Label>
            <Input id="city" value={profile.address?.city} readOnly />
          </div>
          <div>
            <Label htmlFor="street">Road/Area</Label>
            <Input id="street" value={profile.address?.street} readOnly />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="postalCode">Postal Code</Label>
              <Input id="postalCode" value={profile.address?.postalCode} readOnly />
            </div>
            <div>
              <Label htmlFor="taxId">TAX ID</Label>
              <Input id="taxId" value={profile.address?.taxId} readOnly />
            </div>
          </div>
        </CardContent>
      </Card>
    </>
  )
}
