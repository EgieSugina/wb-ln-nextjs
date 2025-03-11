import { gql } from '@apollo/client';

export const CREATE_NOVEL = gql`
  mutation CreateNovel($data: NovelInput!) {
    createNovel(data: $data) {
      id
      title
      description
      author
      status
      genres {
        id
        name
      }
    }
  }
`;

export const UPDATE_NOVEL = gql`
  mutation UpdateNovel($id: Int!, $data: NovelInput!) {
    updateNovel(id: $id, data: $data) {
      id
      title
      description
      author
      status
      genres {
        id
        name
      }
    }
  }
`;

export const DELETE_NOVEL = gql`
  mutation DeleteNovel($id: Int!) {
    deleteNovel(id: $id) {
      id
    }
  }
`;

export const CREATE_GENRE = gql`
  mutation CreateGenre($data: GenreInput!) {
    createGenre(data: $data) {
      id
      name
    }
  }
`;

export const UPDATE_GENRE = gql`
  mutation UpdateGenre($id: Int!, $data: GenreInput!) {
    updateGenre(id: $id, data: $data) {
      id
      name
    }
  }
`;

export const DELETE_GENRE = gql`
  mutation DeleteGenre($id: Int!) {
    deleteGenre(id: $id) {
      id
    }
  }
`;

export const CREATE_CHAPTER = gql`
  mutation CreateChapter($data: ChapterInput!) {
    createChapter(data: $data) {
      id
      number
      title
      content
      createdAt
      updatedAt
      novelId
    }
  }
`;

export const UPDATE_CHAPTER = gql`
  mutation UpdateChapter($id: Int!, $data: ChapterInput!) {
    updateChapter(id: $id, data: $data) {
      id
      number
      title
      content
      createdAt
      updatedAt
    }
  }
`;

export const DELETE_CHAPTER = gql`
  mutation DeleteChapter($id: Int!) {
    deleteChapter(id: $id) {
      id
    }
  }
`; 