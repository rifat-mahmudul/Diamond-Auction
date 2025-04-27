"use client";

import type React from "react";

import { useState, useEffect } from "react";
import Layout from "@/components/dashboard/layout";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Pencil } from "lucide-react";
import {
  useAboutUs,
  useUpdateAboutUs,
  useCreateAboutUs,
} from "@/hooks/use-queries";
import Image from "next/image";

export default function AboutUsPage() {
  const { data: aboutUsData, isLoading } = useAboutUs();
  const updateAboutUsMutation = useUpdateAboutUs();
  const createAboutUsMutation = useCreateAboutUs();

  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    text: "",
    missionText: "",
    visionText: "",
    missionImage: null as File | null,
    visionImage: null as File | null,
  });
  const [missionImagePreview, setMissionImagePreview] = useState("");
  const [visionImagePreview, setVisionImagePreview] = useState("");

  useEffect(() => {
    if (aboutUsData?.data) {
      // In a real app, you would parse the data from the API
      // This is a simplified example
      setFormData({
        text: aboutUsData.data.text || "Let us help you sell your assets",
        missionText:
          aboutUsData.data.missionText ||
          "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed eget euismod velit. Ut dapibus est urna. Suspendisse dictum facilisis ullamcorper. Maecenas vitae efficitur tortor, in placerat dui. Morbi condimentum porttitor turpis sed ultrices. Suspendisse auctor faucibus magna, imperdiet maximus orci ultricies a. Cras placerat elit a sagittis tristique. Etiam imperdiet pulvinar nisi in pellentesque. Sed ante orci, egestas id quam nec, eleifend varius magna. Fusce massa nisi, aliquam at cursus eu.",
        visionText:
          aboutUsData.data.visionText ||
          "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed eget euismod velit. Ut dapibus est urna. Suspendisse dictum facilisis ullamcorper. Maecenas vitae efficitur tortor, in placerat dui. Morbi condimentum porttitor turpis sed ultrices. Suspendisse auctor faucibus magna, imperdiet maximus orci ultricies a. Cras placerat elit a sagittis tristique. Etiam imperdiet pulvinar nisi in pellentesque. Sed ante orci, egestas id quam nec, eleifend varius magna. Fusce massa nisi, aliquam at cursus eu.",
        missionImage: null,
        visionImage: null,
      });
      setMissionImagePreview(aboutUsData.data.missionImage || "");
      setVisionImagePreview(aboutUsData.data.visionImage || "");
    }
  }, [aboutUsData]);


  
  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    imageType: "missionImage" | "visionImage"
  ) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setFormData((prev) => ({ ...prev, [imageType]: file }));

      // Create preview URL
      const reader = new FileReader();
      reader.onload = () => {
        if (imageType === "missionImage") {
          setMissionImagePreview(reader.result as string);
        } else {
          setVisionImagePreview(reader.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const formDataToSend = new FormData();
    formDataToSend.append("text", formData.text);
    formDataToSend.append("missionText", formData.missionText);
    formDataToSend.append("visionText", formData.visionText);

    if (formData.missionImage) {
      formDataToSend.append("missionImage", formData.missionImage);
    }

    if (formData.visionImage) {
      formDataToSend.append("visionImage", formData.visionImage);
    }

    if (aboutUsData?.data?._id) {
      // Update existing about us
      updateAboutUsMutation.mutate(
        {
          id: aboutUsData.data._id,
          data: formDataToSend,
        },
        {
          onSuccess: () => {
            setIsEditing(false);
          },
        }
      );
    } else {
      // Create new about us
      createAboutUsMutation.mutate(formDataToSend, {
        onSuccess: () => {
          setIsEditing(false);
        },
      });
    }
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
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">About Us</h1>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Link href="/dashboard" className="hover:underline">
                Dashboard
              </Link>
              <span>→</span>
              <Link href="/settings" className="hover:underline">
                Setting
              </Link>
              <span>→</span>
              <span>About Us</span>
            </div>
          </div>
          <Button
            onClick={() => setIsEditing(!isEditing)}
            className="bg-[#6b614f] hover:bg-[#5c5343]"
          >
            <Pencil className="h-4 w-4 mr-2" /> Edit About
          </Button>
        </div>

        {isEditing ? (
          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="text">Main Heading</Label>
                <Textarea
                  id="text"
                  name="text"
                  value={formData.text}
                  onChange={handleTextChange}
                  placeholder="Enter main heading"
                  rows={2}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="missionText">Our Mission</Label>
                <Textarea
                  id="missionText"
                  name="missionText"
                  value={formData.missionText}
                  onChange={handleTextChange}
                  placeholder="Enter mission text"
                  rows={6}
                />
              </div>

              <div className="space-y-2">
                <Label>Mission Image</Label>
                <div className="border rounded-md p-4">
                  {missionImagePreview ? (
                    <div className="flex flex-col items-center gap-4">
                      <Image
                        src={missionImagePreview || "/placeholder.svg"}
                        alt="Mission"
                        className="max-h-40 object-contain"
                      />
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() =>
                          document.getElementById("mission-image")?.click()
                        }
                      >
                        Change Image
                      </Button>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center gap-2">
                      <div className="h-20 w-20 rounded-full bg-gray-200 flex items-center justify-center">
                        <Image
                          src="/placeholder.svg?height=40&width=40"
                          alt="Upload"
                        />
                      </div>
                      <p className="text-sm text-center text-muted-foreground">
                        Drag and drop image here, or click add image
                      </p>
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() =>
                          document.getElementById("mission-image")?.click()
                        }
                      >
                        Add Image
                      </Button>
                    </div>
                  )}
                  <input
                    id="mission-image"
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => handleImageChange(e, "missionImage")}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="visionText">Our Vision</Label>
                <Textarea
                  id="visionText"
                  name="visionText"
                  value={formData.visionText}
                  onChange={handleTextChange}
                  placeholder="Enter vision text"
                  rows={6}
                />
              </div>

              <div className="space-y-2">
                <Label>Vision Image</Label>
                <div className="border rounded-md p-4">
                  {visionImagePreview ? (
                    <div className="flex flex-col items-center gap-4">
                      <Image
                        src={visionImagePreview || "/placeholder.svg"}
                        alt="Vision"
                        className="max-h-40 object-contain"
                      />
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() =>
                          document.getElementById("vision-image")?.click()
                        }
                      >
                        Change Image
                      </Button>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center gap-2">
                      <div className="h-20 w-20 rounded-full bg-gray-200 flex items-center justify-center">
                        <Image
                          src="/placeholder.svg?height=40&width=40"
                          alt="Upload"
                        />
                      </div>
                      <p className="text-sm text-center text-muted-foreground">
                        Drag and drop image here, or click add image
                      </p>
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() =>
                          document.getElementById("vision-image")?.click()
                        }
                      >
                        Add Image
                      </Button>
                    </div>
                  )}
                  <input
                    id="vision-image"
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => handleImageChange(e, "visionImage")}
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-end">
              <Button
                type="submit"
                className="bg-[#6b614f] hover:bg-[#5c5343]"
                disabled={
                  updateAboutUsMutation.isPending ||
                  createAboutUsMutation.isPending
                }
              >
                {updateAboutUsMutation.isPending ||
                createAboutUsMutation.isPending
                  ? "Updating..."
                  : "Update"}
              </Button>
            </div>
          </form>
        ) : (
          <div className="space-y-8">
            <h2 className="text-3xl font-bold">{formData.text}</h2>

            <div className="space-y-4">
              <h3 className="text-xl font-semibold">Our Mission</h3>
              <p className="text-gray-700">{formData.missionText}</p>

              {missionImagePreview && (
                <div className="border rounded-md p-4 flex justify-center">
                  <Image
                    src={missionImagePreview || "/placeholder.svg"}
                    alt="Mission"
                    className="max-h-60 object-contain"
                  />
                </div>
              )}
            </div>

            <div className="space-y-4">
              <h3 className="text-xl font-semibold">Our Vision</h3>
              <p className="text-gray-700">{formData.visionText}</p>

              {visionImagePreview && (
                <div className="border rounded-md p-4 flex justify-center">
                  <Image
                    src={visionImagePreview || "/placeholder.svg"}
                    alt="Vision"
                    className="max-h-60 object-contain"
                  />
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}
