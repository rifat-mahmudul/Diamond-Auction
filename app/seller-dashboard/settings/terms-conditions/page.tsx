"use client";

import React, { useState, useEffect } from "react";
import Layout from "@/components/dashboard/layout";
import { Button } from "@/components/ui/button";
import QuillEditor from "../../blogs/_components/QuillEditor";
import { Label } from "@/components/ui/label";
import { useSession } from "next-auth/react";

interface TermsData {
  _id?: string;
  text?: string;
}

export default function TermsConditionsPage() {
  const { data: session } = useSession();
  const token = session?.user?.accessToken || "";
  const [isEditing, setIsEditing] = useState(false);
  const [content, setContent] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [termsData, setTermsData] = useState<TermsData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch terms data with token in headers
  useEffect(() => {
    const fetchTermsData = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/terms`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        
        if (!response.ok) {
          throw new Error('Failed to fetch terms');
        }
        
        const data = await response.json();
        setTermsData(data.data);
      } catch (error) {
        console.error('Error fetching terms:', error);
      } finally {
        setIsLoading(false);
      }
    };

    if (token) {
      fetchTermsData();
    }
  }, [token]);

  // Update content when terms data changes
  useEffect(() => {
    if (termsData) {
      setContent(termsData.text || "");
    }
  }, [termsData]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    const payload = { text: content };
    const apiUrl = termsData?._id 
      ? `/api/terms/${termsData._id}` 
      : '/api/terms';

    try {
      const method = termsData?._id ? 'PUT' : 'POST';
      const response = await fetch(apiUrl, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        throw new Error('Failed to save terms');
      }

      const result = await response.json();
      if (result.status) {
        setIsEditing(false);
        setTermsData(result.data); // Update local state with new data
      }
    } catch (error) {
      console.error('Error saving terms:', error);
      // Handle error (show toast, etc.)
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-full">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#6b614f]" />
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header and other JSX remains the same */}
        {/* ... */}
        
        {/* Content */}
        {isEditing ? (
          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="space-y-2">
              <Label htmlFor="content">Description</Label>
              <div className="rounded-md border">
                <QuillEditor
                  id="content"
                  value={content}
                  onChange={setContent}
                />
              </div>
            </div>

            <div className="flex justify-end">
              <Button
                type="submit"
                className="bg-[#6b614f] hover:bg-[#5c5343]"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Saving..." : "Save Changes"}
              </Button>
            </div>
          </form>
        ) : (
          <div className="prose max-w-none">
            {content ? (
              <div dangerouslySetInnerHTML={{ __html: content }} />
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