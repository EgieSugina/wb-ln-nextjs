'use client';

import { useState } from 'react';
import { useMutation } from '@apollo/client';
import { DELETE_NOVEL } from '@/lib/graphql/mutations';
import { GET_NOVELS } from '@/lib/graphql/queries';
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

interface DeleteNovelButtonProps {
  novelId: number;
  novelTitle: string;
}

export function DeleteNovelButton({ novelId, novelTitle }: DeleteNovelButtonProps) {
  const [open, setOpen] = useState(false);
  const [deleteNovel] = useMutation(DELETE_NOVEL, {
    refetchQueries: [{ query: GET_NOVELS }],
  });

  const handleDelete = async () => {
    try {
      await deleteNovel({
        variables: {
          id: novelId,
        },
      });
    } catch (error) {
      console.error('Error deleting novel:', error);
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
            This will permanently delete the novel "{novelTitle}" and all its chapters. This action cannot be undone.
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