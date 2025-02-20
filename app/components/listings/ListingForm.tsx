"use client";

import React, { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import LocationSelector from "@/components/ui/location-input";
import {
  MultiSelector,
  MultiSelectorContent,
  MultiSelectorInput,
  MultiSelectorItem,
  MultiSelectorList,
  MultiSelectorTrigger,
} from "@/components/ui/multi-select";
import { UploadDropzone } from "@/utils/uploadthing";
import { createListingAction } from "@/app/actions/listings";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

const AVAILABLE_FRAMEWORKS = [
  "React",
  "Vue",
  "Svelte",
  "Angular",
  "Next.js",
] as const;

const MAX_FILE_COUNT = 6;
const MAX_FILE_SIZE = "4MB";

const formSchema = z.object({
  title: z
    .string()
    .min(3, "Title must be at least 3 characters")
    .max(100, "Title must not exceed 100 characters"),
  description: z
    .string()
    .min(10, "Description must be at least 10 characters")
    .max(500, "Description must not exceed 500 characters"),
  price: z
    .string()
    .optional()
    .transform((val) => (val === "" ? "0" : val)) // Transform empty string to "0"
    .refine((val) => !isNaN(Number(val)), "Must be a valid number")
    .refine(
      (val) => Number(val) >= 0,
      "Price must be greater than or equal to 0"
    ),
  status: z.enum(["active", "sold", "archived"]).default("active"),
  location: z.object({
    country: z.string().min(1, "Country is required"),
    state: z.string().optional().default(""), // Make state optional
  }),
  tags: z
    .array(z.enum(AVAILABLE_FRAMEWORKS))
    .min(1, "Select at least one framework")
    .max(3, "Maximum 3 frameworks allowed"),
  images: z
    .array(z.string())
    .min(1, "At least one image is required")
    .max(6, "Maximum 6 images allowed"),
});

type FormValues = z.infer<typeof formSchema>;

interface CreateListingFormProps {
  onSubmitSuccess?: () => void;
  onDismiss?: () => void;
}

export default function CreateListingForm({
  onSubmitSuccess,
  onDismiss,
}: CreateListingFormProps) {
  const [isPending, startTransition] = useTransition();
  const [isUploading, setIsUploading] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      description: "",
      price: "",
      status: "active",
      location: {
        country: "",
        state: "",
      },
      tags: ["React"],
      images: [],
    },
  });

  const handleSubmit = async (values: FormValues) => {
    const formData = new FormData();
    formData.append("title", values.title);
    formData.append("description", values.description);
    formData.append("location.country", values.location.country);
    formData.append("location.state", values.location.state);
    values.tags.forEach((tag) => formData.append("tags", tag));
    values.images.forEach((image) => formData.append("images", image));

    if (values.price) {
      formData.append("price", values.price.toString());
    }

    startTransition(async () => {
      const result = await createListingAction(formData);

      if (result.success) {
        toast.success("Listing created successfully!");
        onSubmitSuccess?.();
        form.reset();
      } else {
        if (typeof result.error === "string") {
          toast.error(result.error);
        } else if (result.error) {
          // Handle field-specific errors
          Object.entries(result.error).forEach(([field, errors]) => {
            if (errors?.[0]) {
              form.setError(field as any, { message: errors[0] });
            }
          });
        } else {
          toast.error("Failed to create listing");
        }
      }
    });
  };

  const handleDismiss = () => {
    if (form.formState.isDirty) {
      const confirmed = window.confirm(
        "You have unsaved changes. Are you sure you want to close?"
      );
      if (!confirmed) return;
    }
    onDismiss?.();
  };

  return (
    <div className="max-h-screen overflow-y-auto bg-white dark:bg-gray-900">
      <Form {...form}>
        <form
          className="mx-auto max-w-6xl space-y-6 px-6 py-8"
          onSubmit={form.handleSubmit(handleSubmit)}
        >
          {/* Title Field */}
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Title</FormLabel>
                <FormControl>
                  <Input
                    placeholder="E.g. Wilson Blade"
                    {...field}
                    className="w-full"
                  />
                </FormControl>
                <FormDescription>
                  Give your listing a clear, descriptive title (
                  {field.value.length}/100)
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Description Field */}
          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Description</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Describe your item in detail..."
                    className="min-h-32 resize-none"
                    {...field}
                  />
                </FormControl>
                <FormDescription>
                  Include condition, features, and any relevant details (
                  {field.value.length}/500)
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Price Field */}
          <FormField
            control={form.control}
            name="price"
            render={({ field: { onChange, ...fieldProps } }) => (
              <FormItem>
                <FormLabel>Price (Optional)</FormLabel>
                <FormControl>
                  <div className="relative">
                    <span className="absolute left-3 top-2 text-gray-500">
                      $
                    </span>
                    <Input
                      type="number"
                      step="0.01"
                      min="0"
                      placeholder="0.00"
                      className="pl-8"
                      {...fieldProps}
                      onChange={(e) => {
                        // Remove leading zeros and convert to string
                        const value = e.target.value.replace(/^0+(?=\d)/, "");
                        onChange(value);
                      }}
                    />
                  </div>
                </FormControl>
                <FormDescription>
                  Enter a price or leave empty for listings not for sale
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Location Field */}
          <FormField
            control={form.control}
            name="location"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Location</FormLabel>
                <FormControl>
                  <LocationSelector
                    value={field.value}
                    onCountryChange={(location) => {
                      field.onChange(location);
                      form.clearErrors("location");
                    }}
                    onStateChange={(location) => {
                      field.onChange(location);
                    }}
                  />
                </FormControl>
                <FormMessage>
                  {form.formState.errors.location?.country?.message}
                </FormMessage>
              </FormItem>
            )}
          />

          {/* Tags Field */}
          <FormField
            control={form.control}
            name="tags"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Tags</FormLabel>
                <FormControl>
                  <MultiSelector
                    values={field.value}
                    onValuesChange={field.onChange}
                    loop
                    className="max-w-xs"
                  >
                    <MultiSelectorTrigger>
                      <MultiSelectorInput placeholder="Select tags (max 3)" />
                    </MultiSelectorTrigger>
                    <MultiSelectorContent>
                      <MultiSelectorList>
                        {AVAILABLE_FRAMEWORKS.map((framework) => (
                          <MultiSelectorItem key={framework} value={framework}>
                            {framework}
                          </MultiSelectorItem>
                        ))}
                      </MultiSelectorList>
                    </MultiSelectorContent>
                  </MultiSelector>
                </FormControl>
                <FormDescription>Select up to 3 tags</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Image Upload Field */}
          <FormField
            control={form.control}
            name="images"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Images</FormLabel>
                <FormControl>
                  <div className="space-y-4">
                    <UploadDropzone
                      endpoint="imageUploader"
                      onUploadBegin={(files) => {
                        const fileArray: File[] =
                          typeof files === "string"
                            ? [new File([], files, { type: "image/jpeg" })]
                            : Array.isArray(files)
                            ? files
                            : Object.values(files);

                        // Check file count
                        if (
                          fileArray.length + field.value.length >
                          MAX_FILE_COUNT
                        ) {
                          toast.error(
                            `You can only upload up to ${MAX_FILE_COUNT} images`
                          );
                          return false;
                        }

                        // Validate file types
                        const invalidFiles = fileArray.filter(
                          (file) => !file.type.startsWith("image/")
                        );
                        if (invalidFiles.length > 0) {
                          toast.error("Please upload only image files");
                          return false;
                        }

                        setIsUploading(true);
                        return true;
                      }}
                      onClientUploadComplete={(res) => {
                        if (res) {
                          const uploadedUrls = res.map((file) => file.ufsUrl);
                          if (
                            uploadedUrls.length + field.value.length <=
                            MAX_FILE_COUNT
                          ) {
                            field.onChange([...field.value, ...uploadedUrls]);
                            toast.success("Images uploaded successfully");
                          } else {
                            toast.error(
                              `Cannot exceed ${MAX_FILE_COUNT} images`
                            );
                          }
                        }
                        setIsUploading(false);
                      }}
                      onUploadError={(error: Error) => {
                        if (error.message.includes("Unauthorized")) {
                          toast.error("Please sign in to upload images");
                        } else if (error.message.includes("Ratelimited")) {
                          toast.error(
                            "Please wait before uploading more images"
                          );
                        } else {
                          toast.error(
                            "Upload failed. Please ensure your images are valid and try again."
                          );
                        }
                        setIsUploading(false);
                      }}
                    />
                    {/* Rest of your existing image preview code */}
                  </div>
                </FormControl>
                <FormDescription>
                  Upload up to {MAX_FILE_COUNT} images (max {MAX_FILE_SIZE}{" "}
                  each)
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Form Actions */}
          <div className="flex justify-end space-x-4">
            <Button
              type="button"
              variant="outline"
              onClick={handleDismiss}
              disabled={isPending || isUploading}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isPending || isUploading}>
              {isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating...
                </>
              ) : isUploading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Uploading...
                </>
              ) : (
                "Create Listing"
              )}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
