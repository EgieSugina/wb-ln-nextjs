"use client";

import { useState } from "react";
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
import { CREATE_GENRE } from "@/lib/graphql/mutations";
import { GET_GENRES } from "@/lib/graphql/queries";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

const genreFormSchema = z.object({
  name: z.string().min(1, "Genre name is required"),
});

type GenreFormValues = z.infer<typeof genreFormSchema>;

export function AddGenreForm() {
  const [open, setOpen] = useState(false);
  const [createGenre] = useMutation(CREATE_GENRE, {
    refetchQueries: [{ query: GET_GENRES }],
  });

  const form = useForm<GenreFormValues>({
    resolver: zodResolver(genreFormSchema),
    defaultValues: {
      name: "",
    },
  });

  async function onSubmit(data: GenreFormValues) {
    try {
      await createGenre({
        variables: {
          data: {
            name: data.name,
          },
        },
      });
      form.reset();
      setOpen(false);
    } catch (error) {
      console.error("Error creating genre:", error);
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-blue-500 hover:bg-blue-600 text-white">
          Add Genre
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add New Genre</DialogTitle>
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
            <Button type="submit" className="w-full">
              Submit
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
