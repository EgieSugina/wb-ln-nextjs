"use client";

import { useState, useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
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
import { useMutation, useQuery } from "@apollo/client";
import { UPDATE_NOVEL } from "@/lib/graphql/mutations";
import { GET_GENRES, GET_NOVELS } from "@/lib/graphql/queries";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Genre, Novel } from "@/lib/graphql/types";
import { Loader2 } from "lucide-react";
import Image from "next/image";

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ACCEPTED_IMAGE_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
];

// Move schema definition inside component to access window object
const getNovelFormSchema = () =>
  z.object({
    title: z.string().min(1, "Title is required"),
    description: z.string().min(1, "Description is required"),
    author: z.string().min(1, "Author is required"),
    status: z.string().default("Ongoing"),
    genreIds: z.array(z.number()).optional(),
    coverImage:
      typeof window === "undefined"
        ? z.any()
        : z
            .instanceof(FileList)
            .optional()
            .refine(
              (files) => !files || files.length === 0 || files.length === 1,
              "Please upload only one file"
            )
            .refine(
              (files) =>
                !files || files.length === 0 || files[0].size <= MAX_FILE_SIZE,
              `Max file size is 5MB`
            )
            .refine(
              (files) =>
                !files ||
                files.length === 0 ||
                ACCEPTED_IMAGE_TYPES.includes(files[0].type),
              "Only .jpg, .jpeg, .png and .webp formats are supported"
            ),
  });

type NovelFormValues = z.infer<ReturnType<typeof getNovelFormSchema>>;

interface EditNovelFormProps {
  novel: Novel;
  trigger?: React.ReactNode;
}

export function EditNovelForm({ novel, trigger }: EditNovelFormProps) {
  const [open, setOpen] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(
    novel.coverImage || null
  );
  const [uploadedImageUrl, setUploadedImageUrl] = useState<string | null>(
    novel.coverImage || null
  );

  const { data: genresData } = useQuery(GET_GENRES);
  const [updateNovel] = useMutation(UPDATE_NOVEL, {
    refetchQueries: [{ query: GET_NOVELS }],
  });

  const form = useForm<NovelFormValues>({
    resolver: zodResolver(getNovelFormSchema()),
    defaultValues: {
      title: novel.title,
      description: novel.description || "",
      author: novel.author,
      status: novel.status,
      genreIds: novel.genres.map((genre) => genre.id),
    },
  });

  // Update form values when novel changes
  useEffect(() => {
    form.reset({
      title: novel.title,
      description: novel.description || "",
      author: novel.author,
      status: novel.status,
      genreIds: novel.genres.map((genre) => genre.id),
    });
    setImagePreview(novel.coverImage || null);
    setUploadedImageUrl(novel.coverImage || null);
  }, [novel, form]);

  // Handle image preview
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const file = files[0];
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      setImagePreview(novel.coverImage || null);
    }
  };

  // Upload image to Google Cloud Storage
  const uploadImage = async (file: File): Promise<string> => {
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Failed to upload image");
      }

      const data = await response.json();
      return data.url;
    } catch (error) {
      console.error("Error uploading image:", error);
      throw error;
    } finally {
      setUploading(false);
    }
  };

  async function onSubmit(data: NovelFormValues) {
    try {
      let coverImageUrl = uploadedImageUrl;

      // Upload image if provided and not already uploaded
      if (data.coverImage && data.coverImage.length > 0) {
        coverImageUrl = await uploadImage(data.coverImage[0]);
        setUploadedImageUrl(coverImageUrl);
      }

      await updateNovel({
        variables: {
          id: novel.id,
          data: {
            title: data.title,
            description: data.description,
            author: data.author,
            status: data.status,
            coverImage: coverImageUrl,
            genreIds: data.genreIds || [],
          },
        },
      });
      setOpen(false);
    } catch (error) {
      console.error("Error updating novel:", error);
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button variant="outline" size="sm" className="text-black dark:text-white">
            Edit
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit Novel</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter novel title" {...field} />
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
                    <Textarea
                      placeholder="Enter novel description"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="author"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Author</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter author name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="status"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Status</FormLabel>
                  <FormControl>
                    <select {...field} className="w-full p-2 border rounded-md">
                      <option value="Ongoing">Ongoing</option>
                      <option value="Completed">Completed</option>
                      <option value="Hiatus">Hiatus</option>
                    </select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="coverImage"
              render={({ field: { onChange, value, ...fieldProps } }) => (
                <FormItem>
                  <FormLabel>Cover Image</FormLabel>
                  <FormControl>
                    <div className="space-y-2">
                      {imagePreview && (
                        <div className="mb-2">
                          <p className="text-sm text-gray-500 mb-1">
                            Current Image:
                          </p>
                          <div className="relative w-full h-40">
                            <Image
                              src={imagePreview}
                              alt="Cover preview"
                              fill
                              className="object-contain rounded-md"
                            />
                          </div>
                        </div>
                      )}
                      <Input
                        type="file"
                        accept="image/*"
                        onChange={(e) => {
                          onChange(e.target.files);
                          handleImageChange(e);
                        }}
                        {...fieldProps}
                      />
                      <p className="text-xs text-gray-500">
                        Leave empty to keep the current image
                      </p>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="genreIds"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Genres</FormLabel>
                  <FormControl>
                    <select
                      multiple
                      className="w-full p-2 border rounded-md"
                      onChange={(e) => {
                        const selectedOptions = Array.from(
                          e.target.selectedOptions
                        );
                        field.onChange(
                          selectedOptions.map((option) => Number(option.value))
                        );
                      }}
                      value={field.value?.map(String) || []}
                    >
                      {genresData?.genres?.map((genre: Genre) => (
                        <option key={genre.id} value={genre.id}>
                          {genre.name}
                        </option>
                      ))}
                    </select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full" disabled={uploading}>
              {uploading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Uploading...
                </>
              ) : (
                "Save Changes"
              )}
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
