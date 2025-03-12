"use client";
import Image from "next/image";
import Link from "next/link";
import { Card, CardHeader, CardTitle, CardContent } from "./ui/card";
import { Novel } from "@/lib/graphql/types";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export default function NovelCard({ novel }: { novel: Novel }) {
  const router = useRouter();

  return (
    <div>
      <Card
        className="h-full hover:shadow-md transition-shadow relative overflow-hidden cursor-pointer"
        onClick={() => router.push(`/novels/${novel.id}`)}
      >
        <div className="absolute inset-0 -z-10">
          {/* {novel.coverImage && (
            <Image
              src={novel.coverImage}
              alt=""
              fill
              className="object-cover blur-md opacity-30"
            />
          )} */}
        </div>
        <div className="">
          <div className="relative aspect-[2/3] w-full overflow-hidden rounded-t-sm mb-4">
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
          <div className="px-2 pb-2">
            <CardHeader className="p-0">
              <CardTitle className="text-sm ">{novel.title}</CardTitle>
            </CardHeader>
            <CardContent className="py-2 px-0">
              {/* <p className="text-gray-600 mb-2">Author: {novel.author}</p>
                  <p className="text-gray-600 mb-2">Status: {novel.status}</p> */}

              {novel.chapters.length > 0 && (
                <div
                  className="text-gray-600 text-xs mb-2 w-full h-full bg-secondary rounded-md flex justify-between items-center"
                  onClick={(e) => {
                    e.stopPropagation();
                    router.push(
                      `/novels/${novel.id}/chapters/${
                        novel.chapters[novel.chapters.length - 1].id
                      }`
                    );
                  }}
                >
                  <div className="items-center flex h-full w-full">
                    <div className="">
                      {novel.chapters[novel.chapters.length - 1].number} -{" "}
                      {novel.chapters[novel.chapters.length - 1].title}
                    </div>
                  </div>

                  <span className="text-xs text-gray-500 shrink-0 ml-2">
                    {(() => {
                      const chapterDate = new Date(
                        Number(
                          novel.chapters[novel.chapters.length - 1].createdAt
                        )
                      );
                      const today = new Date();

                      if (chapterDate.toDateString() === today.toDateString()) {
                        return (
                          <span className="text-green-500 font-bold animate-pulse text-sm">
                            Latest
                          </span>
                        );
                      }

                      return chapterDate.toLocaleDateString("id-ID", {
                        day: "2-digit",
                        month: "2-digit",
                        year: "numeric",
                      });
                    })()}
                  </span>
                </div>
              )}
              <div className="flex flex-wrap gap-2">
                {novel.genres.map((genre) => (
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
        </div>
      </Card>
    </div>
  );
}
