'use client';

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useQuery } from "@apollo/client";
import { GET_GENRES } from "@/lib/graphql/queries";
import { Genre, GenresData } from "@/lib/graphql/types";
import { AddGenreForm } from "@/components/AddGenreForm";

export default function GenresPage() {
  const { loading, error, data } = useQuery<GenresData>(GET_GENRES);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[50vh]">
        <p className="text-lg">Loading genres...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-[50vh]">
        <p className="text-lg text-red-500">Error loading genres: {error.message}</p>
      </div>
    );
  }

  const genres = data?.genres || [];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Genres</h1>
        <AddGenreForm />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {genres.map((genre: Genre) => (
          <Card key={genre.id}>
            <CardHeader>
              <CardTitle>{genre.name}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <p className="text-sm text-gray-600">
                  {genre.novels.length} novels in this genre
                </p>
                <ul className="text-sm space-y-1">
                  {genre.novels.map(novel => (
                    <li key={novel.id} className="text-blue-500 hover:underline cursor-pointer">
                      {novel.title}
                    </li>
                  ))}
                </ul>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
} 