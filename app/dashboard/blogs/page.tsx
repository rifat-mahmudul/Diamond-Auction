"use client";

import type React from "react";

import { useState, useEffect } from "react";
import Layout from "@/components/dashboard/layout";
import { Button } from "@/components/ui/button";
import { Plus, Pencil, Trash2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Pagination } from "@/components/dashboard/pagination";
import {
  AlertDialog,
  AlertDialogAction, 
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useAllBlogs, useCreateBlog, useDeleteBlog } from "@/hooks/use-queries";
import Image from "next/image";

interface Blog {
  _id: string;
  title: string;
  content: string;
  image: string;
  createdAt: string;
  commentCount: number;
}

export default function BlogsPage() {
  const { data: blogsData, isLoading } = useAllBlogs();
  const createBlogMutation = useCreateBlog();
  const deleteBlogMutation = useDeleteBlog();

  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [newBlog, setNewBlog] = useState({
    title: "",
    content: "",
    image: null as File | null,
  });
  const [previewUrl, setPreviewUrl] = useState("");

  useEffect(() => {
    if (blogsData?.data) {
      setBlogs(blogsData.data as Blog[]);
      setTotalPages(blogsData.totalPages || 1);
    }
  }, [blogsData]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setNewBlog({ ...newBlog, image: file });

      // Create preview URL
      const reader = new FileReader();
      reader.onload = () => {
        setPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddBlog = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!newBlog.title || !newBlog.content || !newBlog.image) {
      return;
    }

    const formData = new FormData();
    formData.append("title", newBlog.title);
    formData.append("content", newBlog.content);
    formData.append("image", newBlog.image);

    createBlogMutation.mutate(formData, {
      onSuccess: () => {
        setIsAddDialogOpen(false);
        setNewBlog({ title: "", content: "", image: null });
        setPreviewUrl("");
      },
    });
  };

  const handleDeleteBlog = async (id: string) => {
    deleteBlogMutation.mutate(id);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return `${date.getDate()} ${date.toLocaleString("default", {
      month: "short",
    })}, ${date.getFullYear()}`;
  };

  return (
    <Layout>
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">
              Blogs Management
            </h1>
            <p className="text-muted-foreground">Manage your Blogs</p>
          </div>
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-[#6b614f] hover:bg-[#5c5343]">
                <Plus className="mr-2 h-4 w-4" /> Add Blog
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px]">
              <DialogHeader>
                <DialogTitle>Add Blog</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleAddBlog} className="space-y-4 pt-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Blog Title</Label>
                  <Input
                    id="title"
                    value={newBlog.title}
                    onChange={(e) =>
                      setNewBlog({ ...newBlog, title: e.target.value })
                    }
                    placeholder="Type Blog Title here..."
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="content">Description</Label>
                  <Textarea
                    id="content"
                    value={newBlog.content}
                    onChange={(e) =>
                      setNewBlog({
                        ...newBlog,
                        content: e.target.value,
                      })
                    }
                    placeholder="Type Blog description here..."
                    className="min-h-[200px]"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="image">Thumbnail</Label>
                  <div className="border rounded-md p-4">
                    {previewUrl ? (
                      <div className="flex flex-col items-center gap-4">
                        <Image
                          src={previewUrl || "/placeholder.svg"}
                          alt="Preview"
                          className="max-h-40 object-contain"
                        />
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => {
                            setPreviewUrl("");
                            setNewBlog({ ...newBlog, image: null });
                          }}
                        >
                          Remove
                        </Button>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center gap-2">
                        <div className="h-20 w-20 rounded-full bg-gray-200 flex items-center justify-center">
                          <Image
                            src="/placeholder.svg?height=40&width=40"
                            alt="Upload"
                            width={40}
                            height={40}
                          />
                        </div>
                        <p className="text-sm text-center text-muted-foreground">
                          Drag and drop image here, or click add image
                        </p>
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() =>
                            document
                              .getElementById("blog-image-upload")
                              ?.click()
                          }
                        >
                          Add Image
                        </Button>
                        <input
                          id="blog-image-upload"
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={handleImageChange}
                        />
                      </div>
                    )}
                  </div>
                </div>
                <div className="flex justify-end">
                  <Button
                    type="submit"
                    className="bg-[#6b614f] hover:bg-[#5c5343]"
                    disabled={createBlogMutation.isPending}
                  >
                    {createBlogMutation.isPending ? "Saving..." : "Save"}
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        <div className="rounded-md border">
          {isLoading ? (
            <div className="p-8 flex justify-center">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#6b614f]"></div>
            </div>
          ) : (
            <table className="w-full">
              <thead className="bg-muted/50">
                <tr>
                  <th className="text-left p-4">Blog Name</th>
                  <th className="text-left p-4">Added</th>
                  <th className="text-left p-4">Comments</th>
                  <th className="text-left p-4">Actions</th>
                </tr>
              </thead>
              <tbody>
                {blogs.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="text-center py-4">
                      No blogs found
                    </td>
                  </tr>
                ) : (
                  blogs.map((blog) => (
                    <tr key={blog._id} className="border-t">
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <Image
                            src={blog.image || "/placeholder.svg"}
                            alt={blog.title}
                            className="w-16 h-12 object-cover rounded"
                            width={40}
                            height={40}
                          />
                          <div>
                            <h4 className="font-medium">{blog.title}</h4>
                            <p className="text-sm text-muted-foreground line-clamp-2">
                              {blog.content}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="p-4">{formatDate(blog.createdAt)}</td>
                      <td className="p-4">{blog.commentCount || 150}</td>
                      <td className="p-4">
                        <div className="flex gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="text-blue-500 hover:text-blue-700"
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="text-red-500 hover:text-red-700"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>
                                  Are you sure?
                                </AlertDialogTitle>
                                <AlertDialogDescription>
                                  This action cannot be undone. This will
                                  permanently delete the blog post.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction
                                  onClick={() => handleDeleteBlog(blog._id)}
                                  className="bg-red-500 hover:bg-red-700"
                                >
                                  Delete
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          )}
        </div>

        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      </div>
    </Layout>
  );
}
