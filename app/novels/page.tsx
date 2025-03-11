'use client';

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useQuery } from "@apollo/client";
import { GET_NOVELS } from "@/lib/graphql/queries";
import { Novel, NovelsData } from "@/lib/graphql/types";
import { AddNovelForm } from "@/components/AddNovelForm";
import Link from "next/link";
import Image from "next/image";

export default function NovelsPage() {
  const { loading, error, data } = useQuery<NovelsData>(GET_NOVELS);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[50vh]">
        <p className="text-lg">Loading novels...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-[50vh]">
        <p className="text-lg text-red-500">Error loading novels: {error.message}</p>
      </div>
    );
  }

  const novels = data?.novels || [];

  return (
    <div className="container mx-auto py-8 px-4 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Light Novels</h1>
        <AddNovelForm />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {novels.map((novel: Novel) => (
          <Link href={`/novels/${novel.id}`} key={novel.id} className="block">
            <Card className="h-full hover:shadow-md transition-shadow">
              <div className="p-4">
                <div className="relative aspect-[2/3] w-full overflow-hidden rounded-lg mb-4">
                  {novel.coverImage ? (
                    <Image
                      src={novel.coverImage}
                      alt={`${novel.title} cover`}
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 33vw, 25vw"
                      className="object-cover"
                    />
                  ) : (
                    <div className="absolute inset-0 bg-gray-200 flex items-center justify-center">
                      <p className="text-gray-500">No cover image</p>
                    </div>
                  )}
                </div>
                <CardHeader className="p-0 pb-2">
                  <CardTitle>{novel.title}</CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                  <p className="text-gray-600 mb-2">Author: {novel.author}</p>
                  <p className="text-gray-600 mb-2">Status: {novel.status}</p>
                  <div className="flex flex-wrap gap-2">
                    {novel.genres.map(genre => (
                      <span
                        key={genre.id}
                        className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded"
                      >
                        {genre.name}
                      </span>
                    ))}
                  </div>
                </CardContent>
              </div>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}