"use client";

import type React from "react";

import { useState } from "react";
import Layout from "@/components/dashboard/layout";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useChangePassword } from "@/hooks/use-queries";
import { toast } from "sonner";
import { z } from "zod";

// Mock user ID - in a real app, you would get this from auth context
const USER_ID = "6805c5f4ce1d5ee574941f39";

const passwordSchema = z
  .object({
    currentPassword: z
      .string()
      .min(6, "Current password must be at least 6 characters"),
    newPassword: z
      .string()
      .min(6, "New password must be at least 6 characters"),
    confirmPassword: z
      .string()
      .min(6, "Confirm password must be at least 6 characters"),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

export default function ChangePasswordPage() {
  const changePasswordMutation = useChangePassword();

  const [formData, setFormData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    // Clear error when user types
    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      // Validate form data
      passwordSchema.parse(formData);

      // Submit form
      changePasswordMutation.mutate(
        {
          id: USER_ID,
          data: formData,
        },
        {
          onSuccess: () => {
            // Clear form on success
            setFormData({
              currentPassword: "",
              newPassword: "",
              confirmPassword: "",
            });
          },
        }
      );
    } catch (error) {
      if (error instanceof z.ZodError) {
        // Convert Zod errors to a more usable format
        const newErrors: Record<string, string> = {};
        error.errors.forEach((err) => {
          if (err.path[0]) {
            newErrors[err.path[0] as string] = err.message;
          }
        });
        setErrors(newErrors);
      } else {
        toast.error("An unexpected error occurred");
      }
    }
  };

  return (
    <Layout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Change Password</h1>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Link href="/dashboard" className="hover:underline">
              Dashboard
            </Link>
            <span>→</span>
            <Link href="/settings" className="hover:underline">
              Setting
            </Link>
            <span>→</span>
            <span>Change Password</span>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8 max-w-md">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="currentPassword">Current Password</Label>
              <Input
                id="currentPassword"
                name="currentPassword"
                type="password"
                value={formData.currentPassword}
                onChange={handleInputChange}
                placeholder="Enter your current password"
              />
              {errors.currentPassword && (
                <p className="text-sm text-red-500">{errors.currentPassword}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="newPassword">New Password</Label>
              <Input
                id="newPassword"
                name="newPassword"
                type="password"
                value={formData.newPassword}
                onChange={handleInputChange}
                placeholder="Enter your new password"
              />
              {errors.newPassword && (
                <p className="text-sm text-red-500">{errors.newPassword}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm New Password</Label>
              <Input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                value={formData.confirmPassword}
                onChange={handleInputChange}
                placeholder="Confirm your new password"
              />
              {errors.confirmPassword && (
                <p className="text-sm text-red-500">{errors.confirmPassword}</p>
              )}
            </div>
          </div>

          <Button
            type="submit"
            className="bg-[#6b614f] hover:bg-[#5c5343]"
            disabled={changePasswordMutation.isPending}
          >
            {changePasswordMutation.isPending
              ? "Changing Password..."
              : "Change Password"}
          </Button>
        </form>
      </div>
    </Layout>
  );
}
