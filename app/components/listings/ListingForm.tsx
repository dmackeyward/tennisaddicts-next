"use client";

import React, { useEffect, useState, useCallback } from "react";
import { useForm } from "react-hook-form";
import { CloudUpload, Paperclip, Loader2 } from "lucide-react";
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
import {
  FileInput,
  FileUploader,
  FileUploaderContent,
  FileUploaderItem,
} from "@/components/ui/file-upload";
import LocationSelector from "@/components/ui/location-input";
import {
  MultiSelector,
  MultiSelectorContent,
  MultiSelectorInput,
  MultiSelectorItem,
  MultiSelectorList,
  MultiSelectorTrigger,
} from "@/components/ui/multi-select";
import { ListingFormValues } from "@/types/listings";
import { z } from "zod";

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
const ACCEPTED_FILE_TYPES = [".jpg", ".jpeg", ".png", ".gif", ".svg"];
const AVAILABLE_FRAMEWORKS = [
  "React",
  "Vue",
  "Svelte",
  "Angular",
  "Next.js",
] as const;

const listingSchema = z.object({
  title: z
    .string()
    .min(3, "Title must be at least 3 characters")
    .max(100, "Title must not exceed 100 characters"),
  description: z
    .string()
    .min(10, "Description must be at least 10 characters")
    .max(1000, "Description must not exceed 1000 characters"),
  price: z
    .number()
    .min(0, "Price must be positive")
    .transform((val) => Number(val.toFixed(2))),
  location: z.object({
    country: z.string().min(1, "Country is required"),
    state: z.string().min(1, "State is required"),
  }),
  tags: z
    .array(z.enum(AVAILABLE_FRAMEWORKS))
    .min(1, "Select at least one framework")
    .max(3, "Maximum 3 frameworks allowed"),
  image_upload_input: z
    .array(z.instanceof(File))
    .min(1, "At least one image is required")
    .max(5, "Maximum 5 images allowed")
    .optional(),
});

interface CreateListingFormProps {
  onSubmitSuccess?: () => void;
  onDismiss?: () => void;
  initialValues?: Partial<ListingFormValues>;
}

export default function CreateListingForm({
  onSubmitSuccess,
  onDismiss,
  initialValues,
}: CreateListingFormProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [files, setFiles] = useState<File[] | null>(null);
  const [location, setLocation] = useState({ country: "", state: "" });

  const form = useForm<ListingFormValues>({
    defaultValues: {
      title: initialValues?.title ?? "",
      description: initialValues?.description ?? "",
      price: initialValues?.price,
      location: initialValues?.location ?? {
        country: "",
        state: "",
      },
      tags: initialValues?.tags ?? ["React"],
      image_upload_input: undefined,
    },
  });

  const validateFiles = useCallback((newFiles: File[]): boolean => {
    const totalSize = newFiles.reduce((acc, file) => acc + file.size, 0);
    if (totalSize > MAX_FILE_SIZE) {
      toast.error("Total file size exceeds 10MB");
      return false;
    }

    const invalidFiles = newFiles.filter(
      (file) =>
        !ACCEPTED_FILE_TYPES.some((type) =>
          file.name.toLowerCase().endsWith(type)
        )
    );
    if (invalidFiles.length > 0) {
      toast.error(
        `Invalid file type(s): ${invalidFiles.map((f) => f.name).join(", ")}`
      );
      return false;
    }

    return true;
  }, []);

  useEffect(() => {
    if (files) {
      form.setValue("image_upload_input", files, { shouldValidate: true });
    }
  }, [files, form]);

  const dropZoneConfig = {
    maxFiles: 5,
    maxSize: MAX_FILE_SIZE,
    accept: { "image/*": ACCEPTED_FILE_TYPES },
    multiple: true,
  };

  const handleSubmit = async (formData: ListingFormValues) => {
    try {
      setIsUploading(true);
      // Parse and validate the form data
      const validated = listingSchema.parse(formData);

      if (validated.image_upload_input?.length) {
        const uploadPromises = validated.image_upload_input.map(
          async (file) => {
            const formData = new FormData();
            formData.append("file", file);
            // TODO: Implement your upload logic here
            // const response = await uploadImage(formData);
            // return response.imageUrl;
          }
        );

        try {
          await Promise.all(uploadPromises);
          // Call success handlers
          onSubmitSuccess?.();
          handleSubmitSuccess();
        } catch {
          toast.error("Failed to upload images. Please try again.");
        }
      }
    } catch (error) {
      if (error instanceof z.ZodError) {
        error.errors.forEach((err) => {
          toast.error(`${err.path.join(".")}: ${err.message}`);
        });
      } else if (error instanceof Error) {
        toast.error(error.message);
      }
    } finally {
      setIsUploading(false);
    }
  };

  const handleSubmitSuccess = () => {
    form.reset();
    setFiles(null);
    setLocation({ country: "", state: "" });
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
                  Give your listing a clear, descriptive title
                </FormDescription>
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
                  <Textarea
                    placeholder="Describe your item in detail..."
                    className="min-h-32 resize-none"
                    {...field}
                  />
                </FormControl>
                <FormDescription>
                  Include condition, features, and any relevant details
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="price"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Price</FormLabel>
                <FormControl>
                  <div className="relative">
                    <span className="absolute left-3 top-2 text-gray-500">
                      $
                    </span>
                    <Input
                      type="number"
                      placeholder="0.00"
                      className="pl-8"
                      {...field}
                      onChange={(e) => {
                        const value = e.target.valueAsNumber;
                        field.onChange(isNaN(value) ? undefined : value);
                      }}
                    />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="location"
            render={({ field }) => (
              <FormItem className="space-y-4">
                <FormLabel>Location</FormLabel>
                <FormControl>
                  <LocationSelector
                    onCountryChange={(country) => {
                      const newCountry = country?.name || "";
                      setLocation({ ...location, country: newCountry });
                      field.onChange({
                        ...field.value,
                        country: newCountry,
                      });
                    }}
                    onStateChange={(state) => {
                      const newState = state?.name || "";
                      setLocation({ ...location, state: newState });
                      field.onChange({
                        ...field.value,
                        state: newState,
                      });
                    }}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="tags"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Frameworks</FormLabel>
                <FormControl>
                  <MultiSelector
                    values={field.value || []}
                    onValuesChange={field.onChange}
                    loop
                    className="max-w-xs"
                  >
                    <MultiSelectorTrigger>
                      <MultiSelectorInput placeholder="Select frameworks (max 3)" />
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
                <FormDescription>Select up to 3 frameworks</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="image_upload_input"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Images</FormLabel>
                <FormControl>
                  <FileUploader
                    value={files}
                    onValueChange={(newFiles: File[] | null) => {
                      if (newFiles && validateFiles(newFiles)) {
                        setFiles(newFiles);
                        field.onChange(newFiles);
                      }
                    }}
                    dropzoneOptions={dropZoneConfig}
                    className="rounded-lg bg-gray-50 p-2 dark:bg-gray-800"
                  >
                    <FileInput
                      id="fileInput"
                      className="outline-dashed outline-1 outline-gray-300 dark:outline-gray-600"
                    >
                      <div className="flex w-full flex-col items-center justify-center p-8">
                        <CloudUpload className="h-12 w-12 text-gray-400" />
                        <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                          <span className="font-semibold">Click to upload</span>
                          &nbsp;or drag and drop
                        </p>
                        <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                          SVG, PNG, JPG or GIF (max 10MB)
                        </p>
                      </div>
                    </FileInput>
                    <FileUploaderContent>
                      {files?.map((file: File, i: number) => (
                        <FileUploaderItem key={i} index={i}>
                          <Paperclip className="h-4 w-4 stroke-current" />
                          <span className="ml-2 text-sm">{file.name}</span>
                        </FileUploaderItem>
                      ))}
                    </FileUploaderContent>
                  </FileUploader>
                </FormControl>
                <FormDescription>
                  Upload up to 5 images of your item
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="flex justify-end space-x-4">
            <Button
              type="button"
              variant="outline"
              onClick={handleDismiss}
              disabled={isUploading}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isUploading}>
              {isUploading ? (
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
