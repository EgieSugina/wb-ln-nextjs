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
import { useMutation } from "@apollo/client";
import { UPDATE_GENRE } from "@/lib/graphql/mutations";
import { GET_GENRES } from "@/lib/graphql/queries";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Genre } from "@/lib/graphql/types";

const genreFormSchema = z.object({
  name: z.string().min(1, "Genre name is required"),
});

type GenreFormValues = z.infer<typeof genreFormSchema>;

interface EditGenreFormProps {
  genre: Genre;
  trigger?: React.ReactNode;
}

export function EditGenreForm({ genre, trigger }: EditGenreFormProps) {
  const [open, setOpen] = useState(false);
  const [updateGenre] = useMutation(UPDATE_GENRE, {
    refetchQueries: [{ query: GET_GENRES }],
  });

  const form = useForm<GenreFormValues>({
    resolver: zodResolver(genreFormSchema),
    defaultValues: {
      name: genre.name,
    },
  });

  // Update form values when genre changes
  useEffect(() => {
    form.reset({
      name: genre.name,
    });
  }, [genre, form]);

  async function onSubmit(data: GenreFormValues) {
    try {
      await updateGenre({
        variables: {
          id: genre.id,
          data: {
            name: data.name,
          },
        },
      });
      setOpen(false);
    } catch (error) {
      console.error("Error updating genre:", error);
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
          <DialogTitle>Edit Genre</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter genre name" {...field} />
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