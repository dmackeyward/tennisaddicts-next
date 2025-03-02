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
import { AVAILABLE_TAGS, LocationErrorType } from "@/types/listings";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useAuth } from "@clerk/nextjs";

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
    city: z
      .string({
        required_error: "City must be selected", // This is the message that will be shown
        invalid_type_error: "City must be selected",
      })
      .min(1, "City must be selected"),
    club: z.string().optional().default(""),
  }),
  tags: z
    .array(z.enum(AVAILABLE_TAGS))
    .min(1, "Select at least one tag")
    .max(3, "Maximum 3 tags allowed"),
  images: z
    .array(z.string())
    .min(1, "At least one image is required")
    .max(6, "Maximum 6 images allowed"),
});

type FormValues = z.infer<typeof formSchema>;

type FieldName = keyof FormValues | `location.${keyof FormValues["location"]}`;

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
  const router = useRouter();
  const { isSignedIn, isLoaded } = useAuth();

  const defaultValues: FormValues = {
    title: "",
    description: "",
    price: "",
    status: "active" as const, // explicitly type as const to match the enum
    location: {
      city: "",
      club: "",
    },
    tags: ["Other" as const], // explicitly type as const to match the enum array
    images: [],
  };

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues,
  });

  const handleSubmit = async (values: FormValues) => {
    const formData = new FormData();
    formData.append("title", values.title);
    formData.append("description", values.description);
    formData.append("location.city", values.location.city);
    formData.append("location.club", values.location.club || "");
    values.tags.forEach((tag) => formData.append("tags", tag));
    values.images.forEach((image) => formData.append("images", image));

    if (values.price) {
      formData.append("price", values.price.toString());
    }

    startTransition(async () => {
      const result = await createListingAction(formData);
      console.log("Server action complete result:", result);

      if (result.success) {
        toast.success("Listing created successfully!");
        form.reset(defaultValues);
        onSubmitSuccess?.();
        router.push("/listings");
        router.refresh(); // Refresh the page to show the latest data
      } else {
        console.log("Submission failed, processing errors");
        if (typeof result.error === "string") {
          console.log("String error received:", result.error);
          toast.error(result.error);
        } else if (result.error) {
          console.log("Error object received:", result.error);
          Object.entries(result.error).forEach(([field, errors]) => {
            console.log(`Processing field: ${field}`, errors);

            if (field === "location") {
              console.log("Location error structure:", errors);
              const locationError = errors as LocationErrorType;
              console.log("Parsed location error:", locationError);

              if (locationError.city) {
                console.log("Setting city error:", locationError.city[0]);
                form.setError("location.city" as FieldName, {
                  type: "server",
                  message: locationError.city[0] || "City must be selected",
                });
              }
            } else if (Array.isArray(errors) && errors.length > 0) {
              console.log(`Setting error for field ${field}:`, errors[0]);
              form.setError(field as FieldName, {
                type: "server",
                message: errors[0],
              });
            }
          });

          // Log form state after setting errors
          console.log("Form state after setting errors:", {
            errors: form.formState.errors,
            locationError: form.formState.errors.location?.city?.message,
            dirtyFields: form.formState.dirtyFields,
            isDirty: form.formState.isDirty,
          });
        }
      }
    });
  };

  return (
    <div className="bg-white dark:bg-gray-900">
      <Form {...form}>
        <form
          className="mx-auto max-w-6xl space-y-6"
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
            render={({ field }) => {
              const errorMessage =
                form.formState.errors.location?.city?.message;

              return (
                <FormItem>
                  <FormLabel>Location</FormLabel>
                  <FormControl>
                    <LocationSelector
                      value={field.value}
                      onCityChange={(location) => {
                        console.log("City changed to:", location);
                        field.onChange(location);
                        form.clearErrors("location.city");
                      }}
                      onClubChange={(location) => {
                        console.log("Club changed to:", location);
                        field.onChange(location);
                      }}
                    />
                  </FormControl>
                  {errorMessage && (
                    <div className="text-sm font-medium text-destructive">
                      {errorMessage}
                    </div>
                  )}
                </FormItem>
              );
            }}
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
                        {AVAILABLE_TAGS.map((tag) => (
                          <MultiSelectorItem key={tag} value={tag}>
                            {tag}
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
                    {/* Display uploaded images first, matching EditListingForm pattern */}
                    {field.value.length > 0 && (
                      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-4">
                        {field.value.map((url, index) => (
                          <div key={index} className="relative group">
                            <Image
                              src={url}
                              alt={`Uploaded image ${index + 1}`}
                              width={300}
                              height={200}
                              className="w-full h-32 object-cover rounded-lg"
                            />
                            <button
                              type="button"
                              onClick={() => {
                                const newImages = [...field.value];
                                newImages.splice(index, 1);
                                field.onChange(newImages);
                              }}
                              className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                              ×
                            </button>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Upload dropzone after displaying images */}
                    <UploadDropzone
                      endpoint="imageUploader"
                      onUploadBegin={(files) => {
                        const fileArray: File[] =
                          typeof files === "string"
                            ? [new File([], files, { type: "image/jpeg" })]
                            : Array.isArray(files)
                            ? files
                            : Object.values(files);

                        if (
                          fileArray.length + field.value.length >
                          MAX_FILE_COUNT
                        ) {
                          toast.error(
                            `You can only upload up to ${MAX_FILE_COUNT} images`
                          );
                          return false;
                        }

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
              onClick={() => router.back()}
              disabled={isPending || isUploading}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isPending || isUploading}
              onClick={(e) => {
                if (!isSignedIn && isLoaded) {
                  e.preventDefault();
                  toast.error("Please sign in to create a listing");
                  router.push("/sign-in"); // Or your Clerk sign-in page
                }
              }}
            >
              {!isSignedIn && isLoaded ? (
                "Sign in to Create"
              ) : isPending ? (
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
