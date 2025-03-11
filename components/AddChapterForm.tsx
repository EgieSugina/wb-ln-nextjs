'use client';

import { useState } from 'react';
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
import { CREATE_CHAPTER } from "@/lib/graphql/mutations";
import { GET_CHAPTERS } from "@/lib/graphql/queries";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { RichTextEditor } from "@/components/ui/rich-text-editor";

const chapterFormSchema = z.object({
  number: z.number().min(1, "Chapter number is required"),
  title: z.string().min(1, "Chapter title is required"),
  content: z.string().min(1, "Chapter content is required"),
});

type ChapterFormValues = z.infer<typeof chapterFormSchema>;

interface AddChapterFormProps {
  novelId: number;
  trigger?: React.ReactNode;
}

export function AddChapterForm({ novelId, trigger }: AddChapterFormProps) {
  const [open, setOpen] = useState(false);
  const [createChapter] = useMutation(CREATE_CHAPTER, {
    refetchQueries: [{ query: GET_CHAPTERS, variables: { novelId } }],
  });

  const form = useForm<ChapterFormValues>({
    resolver: zodResolver(chapterFormSchema),
    defaultValues: {
      number: 1,
      title: "",
      content: "",
    },
  });

  async function onSubmit(data: ChapterFormValues) {
    try {
      await createChapter({
        variables: {
          data: {
            novelId,
            number: data.number,
            title: data.title,
            content: data.content,
          },
        },
      });
      form.reset();
      setOpen(false);
    } catch (error) {
      console.error("Error creating chapter:", error);
    }
  }

  // Prevent form submission when clicking editor buttons
  const handleFormClick = (e: React.MouseEvent) => {
    if ((e.target as HTMLElement).tagName === 'BUTTON' && 
        !(e.target as HTMLElement).hasAttribute('type')) {
      e.preventDefault();
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button className="bg-blue-500 hover:bg-blue-600 text-white">
            Add Chapter
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add New Chapter</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4" onClick={handleFormClick}>
            <div className="flex gap-4">
              <FormField
                control={form.control}
                name="number"
                render={({ field }) => (
                  <FormItem className="w-1/4">
                    <FormLabel>Number</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        placeholder="1" 
                        {...field}
                        onChange={(e) => field.onChange(parseInt(e.target.value))}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem className="w-3/4">
                    <FormLabel>Title</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter chapter title" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <FormField
              control={form.control}
              name="content"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Content</FormLabel>
                  <FormControl>
                    <RichTextEditor 
                      content={field.value}
                      onChange={field.onChange}
                      placeholder="Write your chapter content here..."
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full">Submit</Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
} 