"use client";

import type React from "react";

import { useState, useEffect } from "react";
import Layout from "@/components/dashboard/layout";
import { apiService } from "@/lib/api-service";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
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
import { CategoryCard } from "@/components/category-card";
import { toast } from "sonner";
import Image from "next/image";

interface Category {
  _id: string;
  name: string;
  description: string;
  image: string;
}

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [newCategory, setNewCategory] = useState({
    name: "",
    description: "",
    image: null as File | null,
  });
  const [previewUrl, setPreviewUrl] = useState("");

  const fetchCategories = async () => {
    setIsLoading(true);
    try {
      const response = await apiService.getAllCategories();
      if (response.status === true && response.data) {
        setCategories(response.data as Category[]);
      }
    } catch (error) {
      console.error("Error fetching categories:", error);
      toast.error("Failed to fetch categories");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setNewCategory({ ...newCategory, image: file });

      // Create preview URL
      const reader = new FileReader();
      reader.onload = () => {
        setPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddCategory = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!newCategory.name || !newCategory.description || !newCategory.image) {
      toast.error("Please fill all fields and upload an image");
      return;
    }

    const formData = new FormData();
    formData.append("name", newCategory.name);
    formData.append("description", newCategory.description);
    formData.append("image", newCategory.image);

    try {
      const response = await apiService.createCategory(formData);
      if (response.status === true) {
        toast.success("Category added successfully");
        setIsAddDialogOpen(false);
        setNewCategory({ name: "", description: "", image: null });
        setPreviewUrl("");
        fetchCategories();
      }
    } catch (error) {
      console.error("Error adding category:", error);
      toast.error("Failed to add category");
    }
  };

  const handleDeleteCategory = async (id: string) => {
    try {
      const response = await apiService.deleteCategory(id);
      if (response.status === true) {
        toast.success("Category deleted successfully");
        fetchCategories();
      }
    } catch (error) {
      console.error("Error deleting category:", error);
      toast.error("Failed to delete category");
    }
  };

  return (
    <Layout>
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Categories</h1>
            <p className="text-muted-foreground">Manage your categories</p>
          </div>
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-[#6b614f] hover:bg-[#5c5343]">
                <Plus className="mr-2 h-4 w-4" /> Add Category
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Add Category</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleAddCategory} className="space-y-4 pt-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Category Name</Label>
                  <Input
                    id="name"
                    value={newCategory.name}
                    onChange={(e) =>
                      setNewCategory({ ...newCategory, name: e.target.value })
                    }
                    placeholder="Type category name here..."
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={newCategory.description}
                    onChange={(e) =>
                      setNewCategory({
                        ...newCategory,
                        description: e.target.value,
                      })
                    }
                    placeholder="Type category description here..."
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
                          fill
                        />
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => {
                            setPreviewUrl("");
                            setNewCategory({ ...newCategory, image: null });
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
                          />
                        </div>
                        <p className="text-sm text-center text-muted-foreground">
                          Drag and drop image here, or click add image
                        </p>
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() =>
                            document.getElementById("image-upload")?.click()
                          }
                        >
                          Add Image
                        </Button>
                        <input
                          id="image-upload"
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
                  >
                    Save
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {categories.map((category) => (
            <CategoryCard
              key={category._id}
              category={category}
              onDelete={handleDeleteCategory}
              onUpdate={fetchCategories}
              icon="default-icon" // Replace with appropriate icon value
              title={category.name}
              href={`/categories/${category._id}`} // Replace with appropriate URL structure
            />
          ))}
        </div>
      </div>
    </Layout>
  );
}
