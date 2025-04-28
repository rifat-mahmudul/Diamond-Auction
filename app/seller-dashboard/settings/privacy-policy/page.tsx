"use client";

import type React from "react";

import { useState, useEffect } from "react";
import Layout from "@/components/dashboard/layout";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Pencil } from "lucide-react";
import {
  usePolicy,
  useUpdatePolicy,
  useCreatePolicy,
} from "@/hooks/use-queries";

export default function PrivacyPolicyPage() {
  const { data: policyData, isLoading } = usePolicy();
  const updatePolicyMutation = useUpdatePolicy();
  const createPolicyMutation = useCreatePolicy();

  const [isEditing, setIsEditing] = useState(false);
  const [text, setText] = useState("");

  useEffect(() => {
    if (policyData?.data) {
      setText(policyData.data.text || "");
    }
  }, [policyData]);

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setText(e.target.value);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const data = { text };

    if (policyData?.data?._id) {
      // Update existing policy
      updatePolicyMutation.mutate(
        {
          id: policyData.data._id,
          data,
        },
        {
          onSuccess: () => {
            setIsEditing(false);
          },
        }
      );
    } else {
      // Create new policy
      createPolicyMutation.mutate(data, {
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
            <h1 className="text-2xl font-bold tracking-tight">
              Privacy Policy
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
              <span>Privacy Policy</span>
            </div>
          </div>
          <Button
            onClick={() => setIsEditing(!isEditing)}
            className="bg-[#6b614f] hover:bg-[#5c5343]"
          >
            <Pencil className="h-4 w-4 mr-2" /> Policy
          </Button>
        </div>

        <h2 className="text-2xl font-bold">Privacy Policy</h2>

        {isEditing ? (
          <form onSubmit={handleSubmit} className="space-y-8">
            <Textarea
              value={text}
              onChange={handleTextChange}
              placeholder="Enter privacy policy"
              rows={20}
              className="font-mono text-sm"
            />

            <div className="flex justify-end">
              <Button
                type="submit"
                className="bg-[#6b614f] hover:bg-[#5c5343]"
                disabled={
                  updatePolicyMutation.isPending ||
                  createPolicyMutation.isPending
                }
              >
                {updatePolicyMutation.isPending ||
                createPolicyMutation.isPending
                  ? "Updating..."
                  : "Update"}
              </Button>
            </div>
          </form>
        ) : (
          <div className="prose max-w-none">
            {text ? (
              <div
                dangerouslySetInnerHTML={{
                  __html: text.replace(/\n/g, "<br />"),
                }}
              />
            ) : (
              <p className="text-muted-foreground">
                No privacy policy has been added yet.
              </p>
            )}
          </div>
        )}
      </div>
    </Layout>
  );
}
