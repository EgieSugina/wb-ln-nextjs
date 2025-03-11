'use client';

import { useState } from 'react';
import { useMutation } from '@apollo/client';
import { DELETE_GENRE } from '@/lib/graphql/mutations';
import { GET_GENRES } from '@/lib/graphql/queries';
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

interface DeleteGenreButtonProps {
  genreId: number;
  genreName: string;
}

export function DeleteGenreButton({ genreId, genreName }: DeleteGenreButtonProps) {
  const [open, setOpen] = useState(false);
  const [deleteGenre] = useMutation(DELETE_GENRE, {
    refetchQueries: [{ query: GET_GENRES }],
  });

  const handleDelete = async () => {
    try {
      await deleteGenre({
        variables: {
          id: genreId,
        },
      });
    } catch (error) {
      console.error('Error deleting genre:', error);
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
            This will permanently delete the genre "{genreName}". This action cannot be undone.
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