"use client";

import { useQuery } from "@apollo/client";
import { GET_NOVEL, GET_CHAPTERS } from "@/lib/graphql/queries";
import { NovelData, ChaptersData } from "@/lib/graphql/types";
import { useParams, useRouter } from "next/navigation";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { EditNovelForm } from "@/components/EditNovelForm";
import { DeleteNovelButton } from "@/components/DeleteNovelButton";
import { AddChapterForm } from "@/components/AddChapterForm";
import Image from "next/image";
import { useState } from "react";
import Link from "next/link";
import { Clock, User } from "lucide-react";

export default function NovelPage() {
  const params = useParams();
  const router = useRouter();
  const novelId = parseInt(params.id as string);
  const [isExpanded, setIsExpanded] = useState(false);

  const {
    loading: novelLoading,
    error: novelError,
    data: novelData,
  } = useQuery<NovelData>(GET_NOVEL, {
    variables: { id: novelId },
  });

  const {
    loading: chaptersLoading,
    error: chaptersError,
    data: chaptersData,
  } = useQuery<ChaptersData>(GET_CHAPTERS, {
    variables: { novelId },
  });

  if (novelLoading || chaptersLoading) {
    return (
      <div className="flex justify-center items-center min-h-[50vh]">
        <p className="text-lg">Loading novel...</p>
      </div>
    );
  }

  if (novelError || chaptersError) {
    return (
      <div className="flex justify-center items-center min-h-[50vh]">
        <p className="text-lg text-red-500">
          Error loading novel: {novelError?.message || chaptersError?.message}
        </p>
      </div>
    );
  }

  const novel = novelData?.novel;
  const chapters = chaptersData?.chapters || [];

  if (!novel) {
    return (
      <div className="flex justify-center items-center min-h-[50vh]">
        <p className="text-lg text-red-500">Novel not found</p>
      </div>
    );
  }
  const limitWords = (text: string, limit: number) => {
    const words = text.split(" ");
    if (words.length > limit) {
      return words.slice(0, limit).join(" ") + "...";
    }
    return text;
  };

  // Sort chapters by number
  const sortedChapters = [...chapters].sort((a, b) => a.number - b.number);

  return (
    <div className="w-full">
      <div
        className="relative"
        style={{
          backgroundImage: novel.coverImage
            ? `linear-gradient(to bottom, rgba(0,0,0,0.8) 60%, black 100%), url(${novel.coverImage})`
            : "none",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          backgroundAttachment: "fixed",
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-transparent dark:to-black to-white"></div>

        <div className="relative container mx-auto px-4 pt-20 pb-10 text-white">
          <div className="flex flex-col md:flex-row gap-8">
            {/* Cover Image */}
            <div className="w-full md:w-1/3 lg:w-1/4">
              {novel.coverImage ? (
                <div className="relative aspect-[2/3] w-full overflow-hidden rounded-lg shadow-lg">
                  <Image
                    src={novel.coverImage}
                    alt={`${novel.title} cover`}
                    fill
                    className="object-cover border-white border"
                  />
                </div>
              ) : (
                <div className="aspect-[2/3] w-full bg-gray-200 rounded-lg flex items-center justify-center shadow-lg">
                  <p className="text-gray-500">No cover image</p>
                </div>
              )}
            </div>

            <div className="flex-1">
              <h1 className="text-3xl font-bold">{novel.title}</h1>

              <div className="flex items-center gap-2 mt-2">
                <EditNovelForm novel={novel} />
                <DeleteNovelButton
                  novelId={novel.id}
                  novelTitle={novel.title}
                />
                <span className="bg-red-700 text-white px-3 py-1 text-sm font-medium rounded-md">
                  {novel.status}
                </span>
                <span className="bg-blue-800 text-white px-3 py-1 text-sm font-medium rounded-md flex items-center gap-1">
                  <Clock size={14} />
                  {novel.updatedAt}
                </span>
              </div>

              {/* Author & Bookmark */}
              <div className="flex items-center gap-3 mt-3">
                <span className="flex items-center gap-2 text-gray-300">
                  <User size={16} />
                  {novel.author}
                </span>
              </div>

              <div className="mt-5 w-full rounded-xl bg-gray-100 p-5 text-black text-justify dark:bg-zinc-900">
                <h2 className="dark:text-white text-xl font-semibold mb-2">
                  {novel.title} Sinopsis:
                </h2>
                <p className="dark:text-white text-justify text-sm">
                  {isExpanded
                    ? novel.description
                    : novel.description.split(" ").slice(0, 20).join(" ") +
                      "..."}
                </p>
                <button
                  className="text-blue-300 hover:underline mt-2"
                  onClick={() => setIsExpanded(!isExpanded)}
                >
                  {isExpanded ? "Show Less" : "Show More"}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="w-full dark:bg-black bg-white text-white mb-7 py-8 rounded-2xl shadow-shadow border-border border-2 dark:border-gray-500">
        <div className="container mx-auto">
          {/* Header Section */}
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-semibold">Chapters</h2>
            <AddChapterForm novelId={novel.id} />
          </div>

          {/* Chapter List */}
          {chapters.length === 0 ? (
            <p className="text-gray-400 text-center">
              No chapters available yet.
            </p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {chapters.map((chapter) => (
                <Card
                  key={chapter.id}
                  className="bg-gray-800/50 hover:bg-gray-700/50 border-0 transition-all cursor-pointer hover:shadow-md p-4 rounded-md"
                  onClick={() =>
                    router.push(`/novels/${novel.id}/chapters/${chapter.id}`)
                  }
                >
                  <CardHeader className="py-3">
                    <CardTitle className="text-lg text-gray-200 flex justify-between">
                      <span>Chapter {chapter.number}</span>
                      {chapter.isNew && (
                        <span className="bg-red-600 text-white px-2 py-1 rounded text-xs">
                          New
                        </span>
                      )}
                    </CardTitle>
                  </CardHeader>
                  <div className="flex items-center gap-2 text-gray-400 text-sm">
                    <Clock size={14} />
                    {chapter.publishedAt}
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
