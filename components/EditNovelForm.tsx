'use client';

import { useState, useEffect } from 'react';
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
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Genre, Novel } from "@/lib/graphql/types";

const novelFormSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
  author: z.string().min(1, "Author is required"),
  status: z.string().default("Ongoing"),
  genreIds: z.array(z.number()).optional(),
});

type NovelFormValues = z.infer<typeof novelFormSchema>;

interface EditNovelFormProps {
  novel: Novel;
  trigger?: React.ReactNode;
}

export function EditNovelForm({ novel, trigger }: EditNovelFormProps) {
  const [open, setOpen] = useState(false);
  const { data: genresData } = useQuery(GET_GENRES);
  const [updateNovel] = useMutation(UPDATE_NOVEL, {
    refetchQueries: [{ query: GET_NOVELS }],
  });

  const form = useForm<NovelFormValues>({
    resolver: zodResolver(novelFormSchema),
    defaultValues: {
      title: novel.title,
      description: novel.description || "",
      author: novel.author,
      status: novel.status,
      genreIds: novel.genres.map(genre => genre.id),
    },
  });

  // Update form values when novel changes
  useEffect(() => {
    form.reset({
      title: novel.title,
      description: novel.description || "",
      author: novel.author,
      status: novel.status,
      genreIds: novel.genres.map(genre => genre.id),
    });
  }, [novel, form]);

  async function onSubmit(data: NovelFormValues) {
    try {
      await updateNovel({
        variables: {
          id: novel.id,
          data: {
            title: data.title,
            description: data.description,
            author: data.author,
            status: data.status,
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
          <Button variant="outline" size="sm">
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
                    <select
                      {...field}
                      className="w-full p-2 border rounded-md"
                    >
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
              name="genreIds"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Genres</FormLabel>
                  <FormControl>
                    <select
                      multiple
                      className="w-full p-2 border rounded-md"
                      onChange={(e) => {
                        const selectedOptions = Array.from(e.target.selectedOptions);
                        field.onChange(selectedOptions.map(option => Number(option.value)));
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
            <Button type="submit" className="w-full">Save Changes</Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
} 