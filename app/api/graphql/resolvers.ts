import { PrismaClient } from '@prisma/client';
import { moveImageToDeletedFolder } from '@/lib/storage-utils';

const prisma = new PrismaClient();

interface NovelInput {
  title: string;
  description?: string;
  coverImage?: string;
  author: string;
  status?: string;
  genreIds?: number[];
}

interface ChapterInput {
  number: number;
  title: string;
  content: string;
  novelId: number;
}

interface GenreInput {
  name: string;
}

interface UserInput {
  email: string;
  password: string;
  name?: string;
  role?: string;
}

// Define resolver context and parent types
// type Context = {};
type Parent = unknown;

export const resolvers = {
  Query: {
    novels: async () => {
      return prisma.novel.findMany({
        include: {
          chapters: true,
          genres: true,
        },
      });
    },
    novel: async (_parent: Parent, { id }: { id: number }) => {
      return prisma.novel.findUnique({
        where: { id },
        include: {
          chapters: true,
          genres: true,
        },
      });
    },
    chapters: async (_parent: Parent, { novelId }: { novelId: number }) => {
      return prisma.chapter.findMany({
        where: { novelId },
        orderBy: { number: 'asc' },
      });
    },
    chapter: async (_parent: Parent, { id }: { id: number }) => {
      return prisma.chapter.findUnique({
        where: { id },
        include: { novel: true },
      });
    },
    genres: async () => {
      return prisma.genre.findMany({
        include: { novels: true },
      });
    },
    users: async () => {
      return prisma.user.findMany();
    },
    user: async (_parent: Parent, { id }: { id: number }) => {
      return prisma.user.findUnique({
        where: { id },
      });
    },
  },
  Mutation: {
    createNovel: async (_parent: Parent, { data }: { data: NovelInput }) => {
      const { genreIds, ...novelData } = data;
      
      return prisma.novel.create({
        data: {
          ...novelData,
          genres: genreIds ? {
            connect: genreIds.map(id => ({ id })),
          } : undefined,
        },
        include: {
          chapters: true,
          genres: true,
        },
      });
    },
    updateNovel: async (_parent: Parent, { id, data }: { id: number; data: NovelInput }) => {
      const { genreIds, ...novelData } = data;
      
      // Get the current novel to check if the cover image has changed
      const currentNovel = await prisma.novel.findUnique({
        where: { id },
        select: { coverImage: true },
      });
      
      // If the cover image has changed and there was a previous image, move it to the deleted folder
      if (currentNovel?.coverImage && 
          novelData.coverImage && 
          currentNovel.coverImage !== novelData.coverImage) {
        try {
          await moveImageToDeletedFolder(currentNovel.coverImage);
          console.log(`Previous cover image moved to deleted folder: ${currentNovel.coverImage}`);
        } catch (error) {
          console.error('Error moving previous cover image to deleted folder:', error);
        }
      }
      
      // First, disconnect all genres
      await prisma.novel.update({
        where: { id },
        data: {
          genres: {
            set: [],
          },
        },
      });
      
      // Then update with new data and connect new genres
      return prisma.novel.update({
        where: { id },
        data: {
          ...novelData,
          genres: genreIds ? {
            set: genreIds.map(id => ({ id })),
          } : undefined,
        },
        include: {
          chapters: true,
          genres: true,
        },
      });
    },
    deleteNovel: async (_parent: Parent, { id }: { id: number }) => {
      // Get the novel to be deleted
      const novel = await prisma.novel.findUnique({
        where: { id },
        include: {
          chapters: true,
          genres: true,
        },
      });
      
      if (!novel) {
        throw new Error(`Novel with ID ${id} not found`);
      }
      
      // Move the cover image to the deleted folder if it exists
      if (novel.coverImage) {
        try {
          await moveImageToDeletedFolder(novel.coverImage);
          console.log(`Cover image moved to deleted folder: ${novel.coverImage}`);
        } catch (error) {
          console.error('Error moving cover image to deleted folder:', error);
        }
      }
      
      // Delete the novel
      return prisma.novel.delete({
        where: { id },
        include: {
          chapters: true,
          genres: true,
        },
      });
    },
    createChapter: async (_parent: Parent, { data }: { data: ChapterInput }) => {
      return prisma.chapter.create({
        data,
        include: { novel: true },
      });
    },
    updateChapter: async (_parent: Parent, { id, data }: { id: number; data: ChapterInput }) => {
      return prisma.chapter.update({
        where: { id },
        data,
        include: { novel: true },
      });
    },
    deleteChapter: async (_parent: Parent, { id }: { id: number }) => {
      return prisma.chapter.delete({
        where: { id },
        include: { novel: true },
      });
    },
    createGenre: async (_parent: Parent, { data }: { data: GenreInput }) => {
      return prisma.genre.create({
        data,
        include: { novels: true },
      });
    },
    updateGenre: async (_parent: Parent, { id, data }: { id: number; data: GenreInput }) => {
      return prisma.genre.update({
        where: { id },
        data,
        include: { novels: true },
      });
    },
    deleteGenre: async (_parent: Parent, { id }: { id: number }) => {
      return prisma.genre.delete({
        where: { id },
        include: { novels: true },
      });
    },
    createUser: async (_parent: Parent, { data }: { data: UserInput }) => {
      // In a real app, you would hash the password here
      return prisma.user.create({
        data,
      });
    },
    updateUser: async (_parent: Parent, { id, data }: { id: number; data: UserInput }) => {
      // In a real app, you would hash the password here if it's being updated
      return prisma.user.update({
        where: { id },
        data,
      });
    },
    deleteUser: async (_parent: Parent, { id }: { id: number }) => {
      return prisma.user.delete({
        where: { id },
      });
    },
  },
  Novel: {
    chapters: async (parent: { id: number }) => {
      return prisma.chapter.findMany({
        where: { novelId: parent.id },
      });
    },
    genres: async (parent: { id: number }) => {
      const novel = await prisma.novel.findUnique({
        where: { id: parent.id },
        include: { genres: true },
      });
      return novel?.genres || [];
    },
  },
  Chapter: {
    novel: async (parent: { novelId: number }) => {
      return prisma.novel.findUnique({
        where: { id: parent.novelId },
      });
    },
  },
  Genre: {
    novels: async (parent: { id: number }) => {
      const genre = await prisma.genre.findUnique({
        where: { id: parent.id },
        include: { novels: true },
      });
      return genre?.novels || [];
    },
  },
}; 