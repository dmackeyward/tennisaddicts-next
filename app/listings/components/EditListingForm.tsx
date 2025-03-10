"use client";

import React, { useEffect, useState, useTransition, useMemo } from "react";
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
import { updateListingAction } from "@/app/actions/listings";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  LocationErrorType,
  Listing,
  AVAILABLE_TAGS,
  AvailableTags,
} from "@/types/listings";
import { useRouter } from "next/navigation";
import Image from "next/image";
import isEqual from "lodash/isEqual";
import prompts from "@/prompts/prompts";

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
        required_error: "City must be selected",
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

interface EditListingFormProps {
  listing: Listing;
}

export default function EditListingForm({ listing }: EditListingFormProps) {
  const [isPending, startTransition] = useTransition();
  const [isUploading, setIsUploading] = useState(false);
  const [hasFormChanged, setHasFormChanged] = useState(false);
  const router = useRouter();

  // Determine if form should be disabled
  const isFormDisabled = isPending || isUploading;

  // Memoize defaultValues to prevent recreation on every render
  const defaultValues = useMemo<FormValues>(
    () => ({
      title: listing.title,
      description: listing.description,
      price: listing.price.toString(),
      status: (listing.status as "active" | "sold" | "archived") || "active",
      location: {
        city: listing.location.city || listing.location.formatted || "",
        club: listing.location.club || "",
      },
      tags: listing.tags.filter((tag): tag is AvailableTags =>
        AVAILABLE_TAGS.includes(tag as AvailableTags)
      ) || ["Other"],
      images: listing.images.map((img) => img.url),
    }),
    [listing]
  ); // Only depend on the listing object

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues,
  });

  // Add this useEffect to check for form changes
  useEffect(() => {
    const subscription = form.watch(() => {
      // Get current form values
      const currentValues = form.getValues();

      // Deep comparison of current values with default values
      const changed = !isEqual(currentValues, defaultValues);
      setHasFormChanged(changed);
    });

    // Clean up subscription
    return () => subscription.unsubscribe();
  }, [form, defaultValues]);

  const handleSubmit = async (values: FormValues) => {
    const formData = new FormData();
    formData.append("title", values.title);
    formData.append("description", values.description);
    formData.append("location.city", values.location.city);
    formData.append("location.club", values.location.club || "");
    values.tags.forEach((tag) => formData.append("tags", tag));
    values.images.forEach((image) => formData.append("images", image));
    formData.append("status", values.status);

    if (values.price) {
      formData.append("price", values.price.toString());
    }

    startTransition(async () => {
      const result = await updateListingAction(listing.id, formData);
      console.log("Server action complete result:", result);

      if (result.success) {
        // Set the skipModal flag in sessionStorage
        sessionStorage.setItem("skipModal", "true");

        // Store a success message in sessionStorage to show after navigation
        sessionStorage.setItem("listingUpdateSuccess", "true");

        // Reset form to avoid unsaved changes warnings
        form.reset(form.getValues());

        // Use a slight delay and then perform a hard navigation
        setTimeout(() => {
          // Use window.location for a hard navigation instead of router.push
          window.location.href = `/listings/view/${listing.id}`;
        }, 100);
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
                <FormLabel>
                  {prompts.listings.listingForms.titleLabel}
                </FormLabel>
                <FormControl>
                  <Input
                    placeholder={prompts.listings.listingForms.titlePlaceholder}
                    {...field}
                    className="w-full"
                    disabled={isFormDisabled}
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
                <FormLabel>
                  {prompts.listings.listingForms.descriptionLabel}
                </FormLabel>
                <FormControl>
                  <Textarea
                    placeholder={
                      prompts.listings.listingForms.descriptionPlaceholder
                    }
                    className="min-h-32 resize-none"
                    {...field}
                    disabled={isFormDisabled}
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
                <FormLabel>
                  {prompts.listings.listingForms.priceLabel}
                </FormLabel>
                <FormControl>
                  <div className="relative">
                    <span className="absolute left-3 top-2 text-gray-500">
                      $
                    </span>
                    <Input
                      type="number"
                      step="0.01"
                      min="0"
                      placeholder={
                        prompts.listings.listingForms.pricePlaceholder
                      }
                      className="pl-8"
                      {...fieldProps}
                      onChange={(e) => {
                        // Remove leading zeros and convert to string
                        const value = e.target.value.replace(/^0+(?=\d)/, "");
                        onChange(value);
                      }}
                      disabled={isFormDisabled}
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
                  <FormLabel>
                    {prompts.listings.listingForms.locationLabel}
                  </FormLabel>
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
                      disabled={isFormDisabled}
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
                <FormLabel>
                  {prompts.listings.listingForms.categoryLabel}
                </FormLabel>
                <FormControl>
                  <MultiSelector
                    values={field.value}
                    onValuesChange={field.onChange}
                    loop
                    className="max-w-xs"
                    disabled={isFormDisabled}
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
                <FormLabel>
                  {prompts.listings.listingForms.photosLabel}
                </FormLabel>
                <FormControl>
                  <div className="space-y-4">
                    {/* Display uploaded images first */}
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
                              disabled={isFormDisabled}
                            >
                              ×
                            </button>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Use the native disabled prop */}
                    <UploadDropzone
                      endpoint="imageUploader"
                      disabled={isFormDisabled}
                      onUploadBegin={(files) => {
                        if (isFormDisabled) {
                          return false;
                        }

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
                          toast.error(prompts.toast.incorrectFileType);
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
                            toast.success(prompts.toast.success);
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
                          toast.error(prompts.toast.signInRequired);
                        } else if (error.message.includes("Ratelimited")) {
                          toast.error(prompts.toast.rateLimited);
                        } else {
                          toast.error(prompts.toast.error);
                        }
                        setIsUploading(false);
                      }}
                    />
                  </div>
                </FormControl>
                <FormDescription>
                  {prompts.listings.listingForms.maxPhotos} {MAX_FILE_SIZE} each
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
              disabled={isFormDisabled}
            >
              {prompts.common.buttons.cancel}
            </Button>
            <Button type="submit" disabled={isFormDisabled || !hasFormChanged}>
              {isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : isUploading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Uploading...
                </>
              ) : (
                prompts.listings.listingForms.updateButton
              )}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
