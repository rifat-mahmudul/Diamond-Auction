"use client";

import type React from "react";

import { useState, useEffect } from "react";
import Layout from "@/components/dashboard/layout";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Pencil } from "lucide-react";
import { useTerms, useUpdateTerms, useCreateTerms } from "@/hooks/use-queries";

export default function TermsConditionsPage() {
  const { data: termsData, isLoading } = useTerms();
  const updateTermsMutation = useUpdateTerms();
  const createTermsMutation = useCreateTerms();

  const [isEditing, setIsEditing] = useState(false);
  const [text, setText] = useState("");

  useEffect(() => {
    if (termsData?.data) {
      setText(termsData.data.text || "");
    }
  }, [termsData]);

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setText(e.target.value);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const data = { text };

    if (termsData?.data?._id) {
      // Update existing terms
      updateTermsMutation.mutate(
        {
          id: termsData.data._id,
          data,
        },
        {
          onSuccess: () => {
            setIsEditing(false);
          },
        }
      );
    } else {
      // Create new terms
      createTermsMutation.mutate(data, {
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
              Terms & Conditions
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
              <span>Terms & Conditions</span>
            </div>
          </div>
          <Button
            onClick={() => setIsEditing(!isEditing)}
            className="bg-[#6b614f] hover:bg-[#5c5343]"
          >
            <Pencil className="h-4 w-4 mr-2" /> Conditions
          </Button>
        </div>

        <h2 className="text-2xl font-bold">Terms & Conditions</h2>

        {isEditing ? (
          <form onSubmit={handleSubmit} className="space-y-8">
            <Textarea
              value={text}
              onChange={handleTextChange}
              placeholder="Enter terms and conditions"
              rows={20}
              className="font-mono text-sm"
            />

            <div className="flex justify-end">
              <Button
                type="submit"
                className="bg-[#6b614f] hover:bg-[#5c5343]"
                disabled={
                  updateTermsMutation.isPending || createTermsMutation.isPending
                }
              >
                {updateTermsMutation.isPending || createTermsMutation.isPending
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
                No terms and conditions have been added yet.
              </p>
            )}
          </div>
        )}
      </div>
    </Layout>
  );
}
