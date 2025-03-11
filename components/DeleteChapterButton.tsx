'use client';

import { useState } from 'react';
import { useMutation } from '@apollo/client';
import { DELETE_CHAPTER } from '@/lib/graphql/mutations';
import { GET_CHAPTERS } from '@/lib/graphql/queries';
import { Button } from '@/components/ui/button';
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
} from '@/components/ui/alert-dialog';

interface DeleteChapterButtonProps {
  chapterId: number;
  chapterTitle: string;
  novelId: number;
}

export function DeleteChapterButton({ chapterId, chapterTitle, novelId }: DeleteChapterButtonProps) {
  const [open, setOpen] = useState(false);
  const [deleteChapter] = useMutation(DELETE_CHAPTER, {
    refetchQueries: [{ query: GET_CHAPTERS, variables: { novelId } }],
  });

  const handleDelete = async () => {
    try {
      await deleteChapter({
        variables: {
          id: chapterId,
        },
      });
    } catch (error) {
      console.error('Error deleting chapter:', error);
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
            This will permanently delete the chapter "{chapterTitle}". This action cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={handleDelete}>Delete</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
} 