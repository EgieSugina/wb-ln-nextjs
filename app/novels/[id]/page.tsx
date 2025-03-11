'use client';

import { useQuery } from '@apollo/client';
import { GET_NOVEL, GET_CHAPTERS } from '@/lib/graphql/queries';
import { NovelData, ChaptersData } from '@/lib/graphql/types';
import { useParams, useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { EditNovelForm } from '@/components/EditNovelForm';
import { DeleteNovelButton } from '@/components/DeleteNovelButton';
import { AddChapterForm } from '@/components/AddChapterForm';

export default function NovelPage() {
  const params = useParams();
  const router = useRouter();
  const novelId = parseInt(params.id as string);

  const { loading: novelLoading, error: novelError, data: novelData } = useQuery<NovelData>(GET_NOVEL, {
    variables: { id: novelId },
  });

  const { loading: chaptersLoading, error: chaptersError, data: chaptersData } = useQuery<ChaptersData>(GET_CHAPTERS, {
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
        <p className="text-lg text-red-500">Error loading novel: {novelError?.message || chaptersError?.message}</p>
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

  // Sort chapters by number
  const sortedChapters = [...chapters].sort((a, b) => a.number - b.number);

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="mb-6">
        <Button
          variant="outline"
          onClick={() => router.push('/novels')}
          className="mb-4"
        >
          Back to Novels
        </Button>
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold mb-2">{novel.title}</h1>
            <p className="text-gray-600 mb-2">Author: {novel.author}</p>
            <p className="text-gray-600 mb-2">Status: {novel.status}</p>
            <div className="flex flex-wrap gap-2 mb-4">
              {novel.genres.map(genre => (
                <span
                  key={genre.id}
                  className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded"
                >
                  {genre.name}
                </span>
              ))}
            </div>
          </div>
          <div className="flex gap-2">
            <EditNovelForm novel={novel} />
            <DeleteNovelButton novelId={novel.id} novelTitle={novel.title} />
          </div>
        </div>
        <div className="mt-4">
          <h2 className="text-xl font-semibold mb-2">Description</h2>
          <p className="text-gray-700">{novel.description}</p>
        </div>
      </div>

      <div className="mt-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-semibold">Chapters</h2>
          <AddChapterForm novelId={novel.id} />
        </div>
        {sortedChapters.length === 0 ? (
          <p className="text-gray-500">No chapters available yet.</p>
        ) : (
          <div className="grid gap-4">
            {sortedChapters.map(chapter => (
              <Card key={chapter.id} className="hover:shadow-md transition-shadow">
                <CardHeader className="p-4">
                  <CardTitle className="text-lg">
                    Chapter {chapter.number}: {chapter.title}
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-4 pt-0">
                  <div className="flex justify-between items-center">
                    <Button
                      variant="outline"
                      onClick={() => router.push(`/novels/${novel.id}/chapters/${chapter.id}`)}
                    >
                      Read Chapter
                    </Button>
                    <div className="flex gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => router.push(`/novels/${novel.id}/chapters/${chapter.id}`)}
                      >
                        Edit
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
} 