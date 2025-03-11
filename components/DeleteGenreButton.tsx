'use client';

import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { useMutation } from "@apollo/client";
import { DELETE_GENRE } from "@/lib/graphql/mutations";
import { GET_GENRES } from "@/lib/graphql/queries";
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

interface DeleteGenreButtonProps {
  genreId: number;
  genreName: string;
}

export function DeleteGenreButton({ genreId, genreName }: DeleteGenreButtonProps) {
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const [deleteGenre] = useMutation(DELETE_GENRE, {
    refetchQueries: [{ query: GET_GENRES }],
  });

  const handleDelete = async () => {
    try {
      await deleteGenre({
        variables: { id: genreId },
      });
      setOpen(false);
      router.push('/genres');
    } catch (error) {
      console.error("Error deleting genre:", error);
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
            Are you sure you want to delete &quot;{genreName}&quot;? This action cannot be undone.
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