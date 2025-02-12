"use client";

import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { CloudUpload, Paperclip } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
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

interface FormValues {
  title: string;
  description: string;
  price?: number;
  location: string[];
  tags: string[];
  image_upload_input?: File[];
}

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
const ACCEPTED_FILE_TYPES = [".jpg", ".jpeg", ".png", ".gif", ".svg"];

export default function CreateListingForm() {
  const [isUploading, setIsUploading] = useState(false);
  const [files, setFiles] = useState<File[] | null>(null);
  const [location, setLocation] = useState({ country: "", state: "" });

  const form = useForm<FormValues>({
    defaultValues: {
      title: "",
      description: "",
      price: undefined,
      location: [],
      tags: ["React"],
      image_upload_input: undefined,
    },
  });

  useEffect(() => {
    if (files) {
      form.setValue("image_upload_input", files, { shouldValidate: true });
    }
  }, [files, form]);

  const validateFiles = (newFiles: File[]): boolean => {
    const totalSize = newFiles.reduce(
      (acc: number, file: File) => acc + file.size,
      0
    );
    if (totalSize > MAX_FILE_SIZE) {
      toast.error("Total file size exceeds 10MB");
      return false;
    }
    return true;
  };

  const dropZoneConfig = {
    maxFiles: 5,
    maxSize: MAX_FILE_SIZE,
    accept: { "image/*": ACCEPTED_FILE_TYPES },
    multiple: true,
  };

  const handleSubmit = async (formData: FormValues) => {
    try {
      setIsUploading(true);
      // Add your form submission logic here
      toast.success("Form submitted successfully!");
      handleSubmitSuccess();
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error("An unknown error occurred");
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
  };

  return (
    <div className="max-h-screen overflow-y-auto">
      <Form {...form}>
        <form
          className="mx-auto max-w-6xl space-y-4 px-4 py-4"
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
                  <Input placeholder="E.g. Wilson Blade" {...field} />
                </FormControl>
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
                    placeholder="Description"
                    className="resize-none"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Price Field */}
          <FormField
            control={form.control}
            name="price"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Price</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    placeholder="E.g. $100.00"
                    {...field}
                    onChange={(e) => {
                      const value = e.target.valueAsNumber;
                      field.onChange(isNaN(value) ? undefined : value);
                    }}
                  />
                </FormControl>
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
                <FormLabel>Select Location</FormLabel>
                <FormControl>
                  <LocationSelector
                    onCountryChange={(country) => {
                      const newCountry = country?.name || "";
                      setLocation({ ...location, country: newCountry });
                      field.onChange([newCountry]);
                    }}
                    onStateChange={(state) => {
                      const newState = state?.name || "";
                      setLocation({ ...location, state: newState });
                      field.onChange(
                        [location.country, newState].filter(Boolean)
                      );
                    }}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Tags Field */}
          <FormField
            control={form.control}
            name="tags"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Select your framework</FormLabel>
                <FormControl>
                  <MultiSelector
                    values={field.value || []}
                    onValuesChange={field.onChange}
                    loop
                    className="max-w-xs"
                  >
                    <MultiSelectorTrigger>
                      <MultiSelectorInput placeholder="Select languages" />
                    </MultiSelectorTrigger>
                    <MultiSelectorContent>
                      <MultiSelectorList>
                        <MultiSelectorItem value="React">
                          React
                        </MultiSelectorItem>
                        <MultiSelectorItem value="Vue">Vue</MultiSelectorItem>
                        <MultiSelectorItem value="Svelte">
                          Svelte
                        </MultiSelectorItem>
                      </MultiSelectorList>
                    </MultiSelectorContent>
                  </MultiSelector>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Image Upload Field */}
          <FormField
            control={form.control}
            name="image_upload_input"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Upload image</FormLabel>
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
                    className="relative rounded-lg bg-background p-2"
                  >
                    <FileInput
                      id="fileInput"
                      className="outline-dashed outline-1 outline-slate-500"
                    >
                      <div className="flex w-full flex-col items-center justify-center p-8">
                        <CloudUpload className="h-10 w-10 text-gray-500" />
                        <p className="mb-1 text-sm text-gray-500 dark:text-gray-400">
                          <span className="font-semibold">Click to upload</span>
                          &nbsp; or drag and drop
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          SVG, PNG, JPG or GIF (max 10MB)
                        </p>
                      </div>
                    </FileInput>
                    <FileUploaderContent>
                      {files?.map((file: File, i: number) => (
                        <FileUploaderItem key={i} index={i}>
                          <Paperclip className="h-4 w-4 stroke-current" />
                          <span>{file.name}</span>
                        </FileUploaderItem>
                      ))}
                    </FileUploaderContent>
                  </FileUploader>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button type="submit" disabled={isUploading}>
            {isUploading ? "Uploading..." : "Submit"}
          </Button>
        </form>
      </Form>
    </div>
  );
}
