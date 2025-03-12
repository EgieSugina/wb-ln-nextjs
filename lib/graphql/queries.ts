import { gql } from '@apollo/client';

export const GET_NOVELS = gql`
  query GetNovels {
    novels {
      id
      title
      description
      coverImage
      author
      status
      genres {
        id
        name
      }
      chapters {
        id
        number
        title
        createdAt
      }
    }
  }
`;

export const GET_NOVEL = gql`
  query GetNovel($id: Int!) {
    novel(id: $id) {
      id
      title
      description
      coverImage
      author
      status
      chapters {
        id
        number
        title
        createdAt
      }
      genres {
        id
        name
      }
    }
  }
`;

export const GET_GENRES = gql`
  query GetGenres {
    genres {
      id
      name
      novels {
        id
        title
      }
    }
  }
`;

export const GET_CHAPTERS = gql`
  query GetChapters($novelId: Int!) {
    chapters(novelId: $novelId) {
      id
      novelId
      number
      title
      content
      createdAt
      updatedAt
    }
  }
`; 