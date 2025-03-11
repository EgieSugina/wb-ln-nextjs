import { PrismaClient } from '@prisma/client';

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
    novel: async (_: any, { id }: { id: number }) => {
      return prisma.novel.findUnique({
        where: { id },
        include: {
          chapters: true,
          genres: true,
        },
      });
    },
    chapters: async (_: any, { novelId }: { novelId: number }) => {
      return prisma.chapter.findMany({
        where: { novelId },
        orderBy: { number: 'asc' },
      });
    },
    chapter: async (_: any, { id }: { id: number }) => {
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
    user: async (_: any, { id }: { id: number }) => {
      return prisma.user.findUnique({
        where: { id },
      });
    },
  },
  Mutation: {
    createNovel: async (_: any, { data }: { data: NovelInput }) => {
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
    updateNovel: async (_: any, { id, data }: { id: number; data: NovelInput }) => {
      const { genreIds, ...novelData } = data;
      
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
    deleteNovel: async (_: any, { id }: { id: number }) => {
      return prisma.novel.delete({
        where: { id },
        include: {
          chapters: true,
          genres: true,
        },
      });
    },
    createChapter: async (_: any, { data }: { data: ChapterInput }) => {
      return prisma.chapter.create({
        data,
        include: { novel: true },
      });
    },
    updateChapter: async (_: any, { id, data }: { id: number; data: ChapterInput }) => {
      return prisma.chapter.update({
        where: { id },
        data,
        include: { novel: true },
      });
    },
    deleteChapter: async (_: any, { id }: { id: number }) => {
      return prisma.chapter.delete({
        where: { id },
        include: { novel: true },
      });
    },
    createGenre: async (_: any, { data }: { data: GenreInput }) => {
      return prisma.genre.create({
        data,
        include: { novels: true },
      });
    },
    updateGenre: async (_: any, { id, data }: { id: number; data: GenreInput }) => {
      return prisma.genre.update({
        where: { id },
        data,
        include: { novels: true },
      });
    },
    deleteGenre: async (_: any, { id }: { id: number }) => {
      return prisma.genre.delete({
        where: { id },
        include: { novels: true },
      });
    },
    createUser: async (_: any, { data }: { data: UserInput }) => {
      return prisma.user.create({
        data,
      });
    },
    updateUser: async (_: any, { id, data }: { id: number; data: UserInput }) => {
      return prisma.user.update({
        where: { id },
        data,
      });
    },
    deleteUser: async (_: any, { id }: { id: number }) => {
      return prisma.user.delete({
        where: { id },
      });
    },
  },
  Novel: {
    chapters: async (parent: { id: number }) => {
      return prisma.chapter.findMany({
        where: { novelId: parent.id },
        orderBy: { number: 'asc' },
      });
    },
    genres: async (parent: { id: number }) => {
      return prisma.genre.findMany({
        where: {
          novels: {
            some: { id: parent.id },
          },
        },
      });
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
      return prisma.novel.findMany({
        where: {
          genres: {
            some: { id: parent.id },
          },
        },
      });
    },
  },
}; 