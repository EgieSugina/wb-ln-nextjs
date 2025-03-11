'use client';

import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { useMutation } from "@apollo/client";
import { DELETE_CHAPTER } from "@/lib/graphql/mutations";
import { GET_NOVEL } from "@/lib/graphql/queries";
import { useRouter } from 'next/navigation';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

interface DeleteChapterButtonProps {
  chapterId: number;
  chapterTitle: string;
  novelId: number;
}

export function DeleteChapterButton({ chapterId, chapterTitle, novelId }: DeleteChapterButtonProps) {
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const [deleteChapter] = useMutation(DELETE_CHAPTER, {
    refetchQueries: [{ query: GET_NOVEL, variables: { id: novelId } }],
  });

  const handleDelete = async () => {
    try {
      await deleteChapter({
        variables: { id: chapterId },
      });
      setOpen(false);
      router.push(`/novels/${novelId}`);
    } catch (error) {
      console.error("Error deleting chapter:", error);
    }
  };

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>
        <Button variant="destructive" size="sm">
          Delete
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you sure?</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to delete &quot;{chapterTitle}&quot;? This action cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={handleDelete} className="bg-red-600 hover:bg-red-700">
            Delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
} 