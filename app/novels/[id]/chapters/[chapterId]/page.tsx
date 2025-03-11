'use client';

import { useQuery } from '@apollo/client';
import { GET_NOVEL, GET_CHAPTERS } from '@/lib/graphql/queries';
import { NovelData, ChaptersData, Chapter } from '@/lib/graphql/types';
import { useParams, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { EditChapterForm } from '@/components/EditChapterForm';
import { DeleteChapterButton } from '@/components/DeleteChapterButton';

export default function ChapterPage() {
  const params = useParams();
  const router = useRouter();
  const novelId = parseInt(params.id as string);
  const chapterId = parseInt(params.chapterId as string);

  const { loading: novelLoading, error: novelError, data: novelData } = useQuery<NovelData>(GET_NOVEL, {
    variables: { id: novelId },
  });

  const { loading: chaptersLoading, error: chaptersError, data: chaptersData } = useQuery<ChaptersData>(GET_CHAPTERS, {
    variables: { novelId },
  });

  if (novelLoading || chaptersLoading) {
    return (
      <div className="flex justify-center items-center min-h-[50vh]">
        <p className="text-lg">Loading chapter...</p>
      </div>
    );
  }

  if (novelError || chaptersError) {
    return (
      <div className="flex justify-center items-center min-h-[50vh]">
        <p className="text-lg text-red-500">Error loading chapter: {novelError?.message || chaptersError?.message}</p>
      </div>
    );
  }

  const novel = novelData?.novel;
  const chapters = chaptersData?.chapters || [];
  const currentChapter = chapters.find(chapter => chapter.id === chapterId);

  if (!novel || !currentChapter) {
    return (
      <div className="flex justify-center items-center min-h-[50vh]">
        <p className="text-lg text-red-500">Chapter not found</p>
      </div>
    );
  }

  // Find previous and next chapters
  const sortedChapters = [...chapters].sort((a, b) => a.number - b.number);
  const currentIndex = sortedChapters.findIndex(chapter => chapter.id === chapterId);
  const prevChapter = currentIndex > 0 ? sortedChapters[currentIndex - 1] : null;
  const nextChapter = currentIndex < sortedChapters.length - 1 ? sortedChapters[currentIndex + 1] : null;

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">{novel.title}</h1>
        <h2 className="text-xl font-semibold mb-4">
          Chapter {currentChapter.number}: {currentChapter.title}
        </h2>
        <div className="flex items-center gap-2 mb-6">
          <Button
            variant="outline"
            onClick={() => router.push(`/novels/${novelId}`)}
          >
            Back to Novel
          </Button>
          <EditChapterForm chapter={currentChapter as Chapter} />
          <DeleteChapterButton
            chapterId={currentChapter.id}
            chapterTitle={currentChapter.title}
            novelId={novelId}
          />
        </div>
      </div>

      <div className="prose prose-lg max-w-none mb-8">
        <div dangerouslySetInnerHTML={{ __html: currentChapter.content }} />
      </div>

      <div className="flex justify-between mt-8">
        {prevChapter ? (
          <Button
            variant="outline"
            onClick={() => router.push(`/novels/${novelId}/chapters/${prevChapter.id}`)}
          >
            ← Previous Chapter
          </Button>
        ) : (
          <div></div>
        )}
        {nextChapter ? (
          <Button
            variant="outline"
            onClick={() => router.push(`/novels/${novelId}/chapters/${nextChapter.id}`)}
          >
            Next Chapter →
          </Button>
        ) : (
          <div></div>
        )}
      </div>
    </div>
  );
} 