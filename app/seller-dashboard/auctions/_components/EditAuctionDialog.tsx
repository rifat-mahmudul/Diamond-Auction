"use client";

import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { format } from "date-fns";
import { CalendarIcon, X, Upload } from "lucide-react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import Image from "next/image";
import QuillEditor from "@/app/dashboard/blogs/_components/QuillEditor";

const baseURL = process.env.NEXT_PUBLIC_API_URL || "https://your-api-url.com";

const formSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  categoryId: z.string().min(1, "Category is required"),
  caratWeight: z.coerce.number().min(0.1, "Carat weight must be at least 0.1"),
  startingBid: z.coerce.number().min(1, "Starting bid must be at least 1"),
  currentBid: z.coerce.number().optional(),
  bidIncrement: z.coerce.number().min(1, "Bid increment must be at least 1"),
  reservePrice: z.coerce.number().min(1, "Reserve price must be at least 1"),
  startTime: z.date(),
  endTime: z.date(),
});

interface Seller {
  _id: string;
  displayName: string;
  username: string;
  images?: (string | { url: string; _id?: string })[];
}

interface Category {
  _id: string;
  name: string;
}

interface CategoriesResponse {
  data: Category[];
}

interface AuctionImage {
  url: string;
  _id?: string;
}


interface Auction {
    _id: string;
    title: string;
    category: string | Category;
    sku?: string;
    seller: Seller;
    startTime: string;
    endTime: string;
    currentBid?: number;
    bidCount?: number;
    status: 'live' | 'pending' | 'scheduled' | 'completed' | 'end';
    description?: string;
    caratWeight?: number;
    startingBid?: number;
    bidIncrement?: number;
    reservePrice?: number;
    images?: (string | AuctionImage)[];
  }
  
  
interface EditAuctionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  token: string | undefined;
  auctionData: Auction;
}

export function EditAuctionDialog({
  open,
  onOpenChange,
  token,
  auctionData,
}: EditAuctionDialogProps) {
  const [images, setImages] = useState<File[]>([]);
  const [imagePreviewUrls, setImagePreviewUrls] = useState<string[]>([]);
  const [existingImages, setExistingImages] = useState<AuctionImage[]>([]);

  const queryClient = useQueryClient();
  const headers = {
    Authorization: `Bearer ${token}`,
  };

  // Fetch categories
  const { data: categoriesData } = useQuery<CategoriesResponse>({
    queryKey: ["categories"],
    queryFn: async () => {
      const response = await axios.get(`${baseURL}/admin/categories/all`, { headers });
      return response.data;
    },
    enabled: !!token,
  });

  const categories = categoriesData?.data || [];

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      description: "",
      categoryId: "",
      caratWeight: 1,
      startingBid: 1000,
      bidIncrement: 100,
      reservePrice: 5000,
      startTime: new Date(),
      endTime: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    },
  });

  // Update mutation
  const updateAuction = useMutation({
    mutationFn: async (data: FormData) => {
      const response = await axios.put(
        `${baseURL}/auctions/update-auction/${auctionData._id}`,
        data,
        {
          headers: {
            ...headers,
            "Content-Type": "multipart/form-data",
          },
        }
      );
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["auctions"] });
      toast.success("Auction updated successfully");
      onOpenChange(false);
    },
    onError: (error: { response?: { data?: { message?: string } } }) => {
      toast.error(error.response?.data?.message || "Failed to update auction");
    },
  });

  // Reset form when auctionData changes
  useEffect(() => {
    if (open && auctionData) {
      form.reset({
        title: auctionData.title,
        description: auctionData.description,
        categoryId: typeof auctionData.category === "string" ? auctionData.category : auctionData.category?._id,
        caratWeight: auctionData.caratWeight,
        startingBid: auctionData.startingBid,
        bidIncrement: auctionData.bidIncrement,
        reservePrice: auctionData.reservePrice,
        startTime: new Date(auctionData.startTime),
        endTime: new Date(auctionData.endTime),
      });

      const formattedImages: AuctionImage[] = Array.isArray(auctionData.images) 
        ? auctionData.images.map((img) => {
          if (typeof img === 'string') {
            return { url: img };
          }
          return img;
        })
        : [];
      
      setExistingImages(formattedImages);
      setImages([]);
      setImagePreviewUrls([]);
    }
  }, [open, auctionData, form]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const newFiles = Array.from(e.target.files);
      const totalImages = [...images, ...newFiles].slice(0, 4 - existingImages.length);
      setImages(totalImages);

      const newPreviewUrls = totalImages.map((file) => URL.createObjectURL(file));
      setImagePreviewUrls(newPreviewUrls);
    }
  };

  const removeImage = (index: number) => {
    const updatedImages = [...images];
    updatedImages.splice(index, 1);
    setImages(updatedImages);

    const updatedPreviewUrls = [...imagePreviewUrls];
    URL.revokeObjectURL(updatedPreviewUrls[index]);
    updatedPreviewUrls.splice(index, 1);
    setImagePreviewUrls(updatedPreviewUrls);
  };

  const removeExistingImage = (index: number) => {
    const updatedImages = [...existingImages];
    updatedImages.splice(index, 1);
    setExistingImages(updatedImages);
  };

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    if (existingImages.length === 0 && images.length === 0) {
      form.setError("root", {
        message: "At least one image is required",
      });
      return;
    }

    const formData = new FormData();

    Object.entries(values).forEach(([key, value]) => {
      if (value instanceof Date) {
        formData.append(key, value.toISOString());
      } else if (value !== undefined) {
        formData.append(key, String(value));
      }
    });

    images.forEach((image) => {
      formData.append("images", image);
    });

    existingImages.forEach((image) => {
      if (image._id) {
        formData.append("existingImages", image._id);
      } else if (image.url) {
        formData.append("existingImages", image.url);
      }
    });

    updateAuction.mutate(formData);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Auction</DialogTitle>
          <DialogDescription>
            Update your auction listing. Modify the details as needed.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Auction Title</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter auction title" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <QuillEditor
                      id="description-editor"
                      value={field.value}
                      onChange={(value) => field.onChange(value)}
                    />
                  </FormControl>
                  {form.formState.errors.description && (
                    <p className="text-sm font-medium text-destructive">
                      {form.formState.errors.description.message}
                    </p>
                  )}
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="categoryId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Category</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      value={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a category" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {categories.map((category: Category) => (
                          <SelectItem key={category._id} value={category._id}>
                            {category.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="caratWeight"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Carat Weight</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        step="0.01"
                        placeholder="Enter carat weight"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="startingBid"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Starting Bid ($)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="Enter starting bid"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="bidIncrement"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Bid Increment ($)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="Enter bid increment"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="reservePrice"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Reserve Price ($)</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="Enter reserve price"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="startTime"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Start Time</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={"outline"}
                            className={cn(
                              "w-full pl-3 text-left font-normal",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            {field.value ? (
                              format(field.value, "PPP HH:mm")
                            ) : (
                              <span>Pick a date</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="endTime"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>End Time</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={"outline"}
                            className={cn(
                              "w-full pl-3 text-left font-normal",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            {field.value ? (
                              format(field.value, "PPP HH:mm")
                            ) : (
                              <span>Pick a date</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div>
              <FormLabel>Images (Max 4)</FormLabel>
              <div className="mt-2 border-2 border-dashed rounded-md p-6 flex flex-col items-center">
                <div className="flex flex-wrap gap-4 mb-4">
                  {existingImages.map((image, index) => (
                    <div key={`existing-${index}`} className="relative w-24 h-24">
                      <Image
                        src={typeof image === 'string' ? image : image.url}
                        alt={`Existing ${index + 1}`}
                        className="w-full h-full object-cover rounded-md"
                        width={100}
                        height={100}
                      />
                      <button
                        type="button"
                        onClick={() => removeExistingImage(index)}
                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  ))}

                  {imagePreviewUrls.map((url, index) => (
                    <div key={`new-${index}`} className="relative w-24 h-24">
                      <Image
                        src={url}
                        alt={`Preview ${index + 1}`}
                        className="w-full h-full object-cover rounded-md"
                        width={100}
                        height={100}
                      />
                      <button
                        type="button"
                        onClick={() => removeImage(index)}
                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                </div>

                {(existingImages.length + images.length) < 4 && (
                  <div className="flex flex-col items-center">
                    <Upload className="h-10 w-10 text-gray-400 mb-2" />
                    <p className="text-sm text-gray-500 mb-2">
                      Drag and drop image here, or click to select
                    </p>
                    <Input
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={handleImageChange}
                      className="hidden"
                      id="image-upload"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() =>
                        document.getElementById("image-upload")?.click()
                      }
                    >
                      Add Image
                    </Button>
                  </div>
                )}
              </div>
              {form.formState.errors.root && (
                <p className="text-sm font-medium text-destructive mt-2">
                  {form.formState.errors.root.message}
                </p>
              )}
            </div>

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="bg-[#6b614f] hover:bg-[#5a5142]"
                disabled={updateAuction.isPending}
              >
                {updateAuction.isPending ? "Updating..." : "Update Auction"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}