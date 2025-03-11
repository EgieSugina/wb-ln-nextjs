'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useQuery } from "@apollo/client";
import { GET_NOVELS } from "@/lib/graphql/queries";
import { Novel, NovelsData } from "@/lib/graphql/types";
import { AddNovelForm } from "@/components/AddNovelForm";
import Link from "next/link";

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
          <Link href={`/novels/${novel.id}`} key={novel.id}>
            <Card className="transition-transform hover:scale-105 h-full flex flex-col overflow-hidden">
              <div className="relative h-48 w-full">
                {novel.coverImage ? (
                  <img
                    src={novel.coverImage}
                    alt={`${novel.title} cover`}
                    className="object-cover w-full h-full"
                  />
                ) : (
                  <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                    <p className="text-gray-500">No cover image</p>
                  </div>
                )}
              </div>
              <CardHeader>
                <CardTitle>{novel.title}</CardTitle>
                <CardDescription>
                  {novel.genres.map(genre => genre.name).join(", ")}
                </CardDescription>
              </CardHeader>
              <CardContent className="flex-grow">
                <div className="space-y-2">
                  <p className="text-gray-600 line-clamp-3">{novel.description}</p>
                  <div className="flex justify-between text-sm mt-auto">
                    <span>By {novel.author}</span>
                    <span className="text-blue-500">{novel.status}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}