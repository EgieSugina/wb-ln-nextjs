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
        className="h-full hover:shadow-md transition-shadow relative overflow-hidden cursor-pointer dark:border dark:border-white"
        onClick={() => router.push(`/novels/${novel.id}`)}
      >
        <div className="relative aspect-[2/3] w-full overflow-hidden rounded-t-sm">
          {/* Status Novel */}
          <p className="absolute top-0 right-0 z-10 bg-secondary m-2 px-2 py-1 rounded-xl text-sm">
            {novel.status === "Ongoing" && (
              <span className="text-green-500">{novel.status}</span>
            )}
            {novel.status === "Completed" && (
              <span className="text-blue-500">{novel.status}</span>
            )}
            {novel.status === "Hiatus" && (
              <span className="text-red-500">{novel.status}</span>
            )}
          </p>

          {/* Cover Image */}
          {novel.coverImage ? (
            <>
              <Image
                src={novel.coverImage}
                alt={`${novel.title} cover`}
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 33vw, 25vw"
                className="object-cover"
              />
              {/* Overlay Gradient */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>
            </>
          ) : (
            <div className="absolute inset-0 bg-gray-200 flex items-center justify-center">
              <p className="text-gray-500">No cover image</p>
            </div>
          )}

          {/* Judul Novel */}
          <CardHeader className="absolute bottom-0 w-full bg-black/80 p-2 text-center">
            <CardTitle className="text-base font-semibold text-white">
              {novel.title}
            </CardTitle>
          </CardHeader>
        </div>

        {/* Informasi Chapter */}
        <div className="px-2 pb-2">
          <CardContent className="py-2 px-0">
            {novel.chapters.length > 0 && (
              <Button variant="noShadow"
                className="text-gray-600 text-xs w-full h-full bg-secondary rounded-md flex justify-between items-center p-2"
                onClick={(e) => {
                  e.stopPropagation();
                  router.push(
                    `/novels/${novel.id}/chapters/${
                      novel.chapters[novel.chapters.length - 1].id
                    }`
                  );
                }}
              >
                {/* Judul & Nomor Chapter */}
                <div className="items-center flex h-full w-full">
                  <span>
                    {novel.chapters[novel.chapters.length - 1].title}
                  </span>
                </div>

                {/* Tanggal atau "Latest" */}
                <span className="text-xs text-gray-500 shrink-0 ml-2">
                  {(() => {
                    const chapterDate = new Date(
                      Number(
                        novel.chapters[novel.chapters.length - 1].createdAt
                      )
                    );
                    const now = new Date();
                    const diffInSeconds = Math.floor(
                      (now.getTime() - chapterDate.getTime()) / 1000
                    );

                    if (diffInSeconds < 60) {
                      return (
                        <span className="text-green-500 font-bold text-sm">
                          Baru saja
                        </span>
                      );
                    }

                    const diffInMinutes = Math.floor(diffInSeconds / 60);
                    if (diffInMinutes < 60) {
                      return <span>{diffInMinutes} menit yang lalu</span>;
                    }

                    const diffInHours = Math.floor(diffInMinutes / 60);
                    if (diffInHours < 24) {
                      return <span>{diffInHours} jam yang lalu</span>;
                    }

                    const diffInDays = Math.floor(diffInHours / 24);
                    if (diffInDays < 7) {
                      return <span>{diffInDays} hari yang lalu</span>;
                    }

                    const diffInWeeks = Math.floor(diffInDays / 7);
                    if (diffInWeeks < 3) {
                      return <span>{diffInWeeks} minggu yang lalu</span>;
                    }

                    return chapterDate.toLocaleDateString("id-ID", {
                      day: "2-digit",
                      month: "2-digit",
                      year: "numeric",
                    });
                  })()}
                </span>
              </Button>
            )}
          </CardContent>
        </div>
      </Card>
    </div>
  );
}
