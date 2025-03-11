export interface Novel {
  id: number;
  title: string;
  description?: string;
  coverImage?: string;
  author: string;
  status: string;
  createdAt: string;
  updatedAt: string;
  chapters: Chapter[];
  genres: Genre[];
}

export interface Chapter {
  id: number;
  number: number;
  title: string;
  content: string;
  createdAt: string;
  updatedAt: string;
  novelId: number;
  novel: Novel;
}

export interface Genre {
  id: number;
  name: string;
  novels: Novel[];
}

export interface NovelsData {
  novels: Novel[];
}

export interface NovelData {
  novel: Novel;
}

export interface GenresData {
  genres: Genre[];
}

export interface ChaptersData {
  chapters: Chapter[];
} 